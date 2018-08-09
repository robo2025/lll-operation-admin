import React from 'react';
import { Form, Input, Select, Button, Spin, Checkbox, Card } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  operationAllPermissions,
  convertCodeToName,
  convertNameToCode,
} from '../../constant/operationPermissionDetail';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
@Form.create({})
@connect(({ sysAccount, loading }) => ({
  sysAccount,
}))
export default class OperateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
    };
  }
  componentDidMount() {
    this.onGetLevel();
    this.onGetRoleLevel();
    this.props.dispatch({
      type: 'sysAccount/fetchPositions', // 得到职位列表，进行职位选择
    });
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
  renderForm() {
    const { form, sysAccount } = this.props;
    const { getFieldDecorator } = form;
    const { deptLevel, positionList, roleLevel } = sysAccount;
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
    const disabled = false;
    return (
      <Form>
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input placeholder="请输入" />)}
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
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                message: '请输入6-16位数字字母混合密码',
              },
            ],
          })(<Input type="password" placeholder="请输入" />)}
        </FormItem>
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('realname', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="联系方式" {...formItemLayout}>
          {getFieldDecorator('telphone', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input placeholder="请输入" />)}
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
                message: '请输入角色名称',
                whitespace: true,
              },
              {
                max: 50,
                message: '角色长度不可超过50',
              },
            ],
          })(
            <Select placeholder="请选择" disabled={disabled}>
              {roleLevel.map(ele => <Option key={ele.name}>{ele.name}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem label="所属部门" {...formItemLayout}>
          {getFieldDecorator('dept_name', {
            rules: [
              {
                required: true,
                message: '请选择所属部门',
              },
            ],
          })(
            <Select placeholder="请选择" disabled>
              {deptLevel.map(ele => <Option key={ele.name}>{ele.name}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem label="模块权限" {...formItemLayout}>
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
          {getFieldDecorator('permissions', {
            rules: [
              {
                required: true,
                message: '请选择模块权限!',
              },
            ],
          })(
            <CheckboxGroup
              disabled
              className={styles.roleModal}
              options={operationAllPermissions}
            />
          )}
        </FormItem>
      </Form>
    );
  }
  render() {
    return (
      <PageHeaderLayout title="编辑">
        <Card>{this.renderForm()}</Card>
      </PageHeaderLayout>
    );
  }
}
