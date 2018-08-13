import React, { Fragment } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Spin,
  Checkbox,
  Card,
  message,
} from 'antd';
import { connect } from 'dva';
import { sha256 } from 'js-sha256';
import qs from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  operationAllPermissions,
  convertCodeToName,
  convertNameToCode,
} from '../../constant/operationPermissionDetail';
import styles from './index.less';
import LogTable from '../../components/LogTable/index';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
@connect(({ sysAccount, loading }) => ({
  sysAccount,
  loading: loading.effects['sysAccount/fetchAccountDetail'],
  addLoading: loading.effects['sysAccount/fetchAddAccount'],
  editLoading: loading.effects['sysAccount/fetchEditAccount'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { sysAccount } = props;
    const { accountDetail } = sysAccount;
    if (Object.keys(accountDetail).length === 0) {
      return {}; // 如果为空,返回false
    }
    const { profile, ...others } = accountDetail;
    const { group } = profile || {};
    const permissions = accountDetail.permissions || group.permissions;
    let formData = {};
    // profile解构
    const data = { ...profile, ...group, ...others };
    Object.keys(data).map((item) => {
      formData = {
        ...formData,
        [item]: Form.createFormField({ value: data[item] }),
      };
      return null;
    });
    let permissionList = [];
    Object.keys(permissions).map((key) => {
      permissionList = permissionList.concat(permissions[key]);
      return null;
    });
    return {
      ...formData,
      permissions: Form.createFormField({
        value: convertCodeToName(permissionList), // 获得已有的permissions
      }),
    };
  },
})
export default class OperateAccount extends React.Component {
  constructor(props) {
    const params = qs.parse(props.location.search, {
      ignoreQueryPrefix: true,
    });
    const { type, typeId } = params; // 从URL中取值,判断操作类型
    super(props);
    this.state = {
      roleParams: {}, // 选择角色后存储当前值
      title:
        type === 'add'
          ? '新增帐号'
          : type === 'modify'
            ? '编辑帐号'
            : '查看帐号',
      typeId: typeId || '',
      disabled: type === 'view',
      type,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { typeId } = this.state;
    this.onGetLevel();
    this.onGetRoleLevel();
    dispatch({
      type: 'sysAccount/fetchPositions', // 得到职位列表，进行职位选择
    });
    if (typeId) {
      this.onGetAccountDetail({ userid: typeId });
    } else {
      dispatch({
        type: 'sysAccount/saveAccountDetail',
        payload: {},
      });
    }
  }
  onGetLevel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchDeptLevel',
    });
  }
  onGetRoleLevel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchRoleLevel',
    });
  }
  onGetAccountDetail({ userid }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchAccountDetail',
      userid,
    });
  }
  onSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form, sysAccount, history } = this.props;
    const { roleParams, type } = this.state;
    const { accountDetail } = sysAccount;

    form.validateFields((err, fieldsValue) => {
      // roleParams为{},则选取accountDetail中的值
      if (err) return;
      const {
        username,
        password,
        realname,
        telphone,
        position,
        permissions,
        name,
        dept_name,
      } = fieldsValue;
        const values = {
          username: username.trim(),
          password: sha256(password),
          realname: realname.trim(),
          telphone,
          position: position || '',
        };
      const setValues = {
        username: username.trim(),
        password,
        realname: realname.trim(),
        telphone,
        position,
        permissions: convertNameToCode(permissions),
        name,
        dept_name,
      };
      dispatch({
        type: 'sysAccount/saveAccountDetail',
        payload: { ...accountDetail, ...setValues },
      });
      if (Object.keys(roleParams).length > 0) {
        values.group_id = roleParams.id;
      } else {
        const { profile } = accountDetail;
        const { group_id } = profile;
        values.group_id = group_id;
      }
      if (type === 'add') {
        dispatch({
          type: 'sysAccount/fetchAddAccount',
          params: values,
          success: (res) => {
            message.success(res.msg, 1);
            history.go(-1);
          },
          error: (error) => {
            message.error(error.msg);
          },
        });
      } else if (type === 'modify') {
        dispatch({
          type: 'sysAccount/fetchEditAccount',
          params: values,
          userid: accountDetail.id,
          success: (res) => {
            history.go(-1);
            message.success(res.msg, 1);
          },
          error: (error) => {
            message.error(error.msg);
          },
        });
      }
    });
  };
  handleFormReset = () => {
    // 点击重置
    const { form } = this.props;
    form.resetFields();
  };
  checkAll = () => {
    const { form } = this.props;
    if (
      form.getFieldValue('permissions') &&
      form.getFieldValue('permissions').length ===
        operationAllPermissions.length
    ) {
      form.setFieldsValue({ permissions: [] });
    } else {
      form.setFieldsValue({ permissions: operationAllPermissions });
    }
  };
  roleChange = (value, roleparams) => {
    const { form } = this.props;
    const { props } = roleparams;
    const { label } = props;
    const { permissions, dept_name } = label;
    this.setState({
      roleParams: label,
    });
    let permissionList = [];
    Object.keys(permissions).map((key) => {
      permissionList = permissionList.concat(permissions[key]);
      return null;
    });
    form.setFieldsValue({
      permissions: convertCodeToName(permissionList),
      dept_name,
    });
  };
  renderForm() {
    const { form, sysAccount } = this.props;
    const { getFieldDecorator } = form;
    const { positionList, roleLevel } = sysAccount;
    const { disabled, type } = this.state;
    const formItemLayout = {
      labelCol: {
        md: 7,
        xxl: 8,
      },
      wrapperCol: {
        md: 10,
        xxl: 8,
      },
    };
    return (
      <Form
        onSubmit={this.onSubmit}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input placeholder="请输入" disabled={disabled} />)}
        </FormItem>
        <FormItem label="登录密码" {...formItemLayout}>
          {/* ^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$ 匹配8-16位数字或字母 */}
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入登录密码',
              },
              {
                min: 6,
                max: 16,
                whitespace: true,
                message: '请输入6-16位密码',
              },
            ],
            initialValue: type === 'add' ? '' : '123456',
          })(
            <Input
              type="password"
              placeholder="请输入"
              disabled={disabled || type === 'modify'}
            />
          )}
        </FormItem>
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('realname', {
            rules: [
              {
                required: true,
                message: '请输入真实姓名',
              },
            ],
          })(<Input placeholder="请输入" disabled={disabled} />)}
        </FormItem>
        <FormItem label="联系方式" {...formItemLayout}>
          {getFieldDecorator('telphone', {
            rules: [
              {
                required: true,
                message: '请输入联系方式',
              },
              {
                pattern: /^1[0-9]{10}$/,
                message: '请输入正确手机号',
              },
            ],
          })(<Input placeholder="请输入" disabled={disabled} />)}
        </FormItem>
        <FormItem label="职位" {...formItemLayout}>
          {getFieldDecorator('position', {
            rules: [
              {
                required: false,
                message: '请选择职位',
              },
            ],
          })(
            <Select placeholder="请选择" disabled={disabled}>
              {positionList.map(ele => (
                <Option key={ele.name}>{ele.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="角色名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请选择角色名称',
              },
            ],
          })(
            <Select
              placeholder="请选择"
              disabled={disabled}
              onChange={this.roleChange}
            >
              {roleLevel.map(ele => (
                <Option key={ele.name} label={ele}>
                  {ele.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="所属部门" {...formItemLayout} required>
          {getFieldDecorator('dept_name', {})(
            <Input placeholder="请输入" disabled />
          )}
        </FormItem>
        <FormItem label="模块权限" {...formItemLayout} required>
          <Checkbox
            disabled
            onChange={() => this.checkAll()}
            checked={
              form.getFieldValue('permissions')
                ? form.getFieldValue('permissions').length ===
                  operationAllPermissions.length
                : false
            }
          >
            全部模块
          </Checkbox>
          {getFieldDecorator('permissions')(
            <CheckboxGroup
              disabled
              className={styles.roleModal}
              options={operationAllPermissions}
            />
          )}
        </FormItem>
        <FormItem style={{ textAlign: 'center' }}>
          {type === 'view' ? (
            <Button
              type="primary"
              onClick={() => {
                this.props.history.go(-1);
              }}
            >
              返回
            </Button>
          ) : (
            <Fragment>
              <Button type="primary" htmlType="submit">
                {type === 'modify' ? '确认编辑' : '确认新增'}
              </Button>
              {/* <Button style={{ marginLeft: 15 }} onClick={this.handleFormReset}>重置</Button> */}
            </Fragment>
          )}
        </FormItem>
      </Form>
    );
  }
  render() {
    const { title, typeId } = this.state;
    const { loading, editLoading, addLoading } = this.props;
    return (
      <PageHeaderLayout title={title}>
        <Spin spinning={loading || editLoading || addLoading || false}>
          <Card>{this.renderForm()}</Card>
          {typeId ? (
            <Card title="操作日志" style={{ marginTop: 30 }}>
              <LogTable
                object_id={typeId >> 0}
                module="auth_user"
                platform="operation"
              />
            </Card>
          ) : null}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
