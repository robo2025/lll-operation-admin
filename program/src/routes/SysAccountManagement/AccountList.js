import React, { Fragment } from 'react';
import moment from 'moment';
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Divider,
  Table,
  Modal,
  Checkbox,
  Icon,
  message,
  Spin,
  Badge,
} from 'antd';
import { connect } from 'dva';
import { sha256 } from 'js-sha256';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  operationAllPermissions,
  convertCodeToName,
  convertNameToCode,
} from '../../constant/operationPermissionDetail';
import { ACTIVE_STATUS, USER_TYPE } from '../../constant/statusList';
import styles from './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const { confirm } = Modal;
const BADGE_STATUS = ['error', 'success'];
const ModifyPasswordModal = Form.create()((props) => {
    const {
      passwordModalVisible,
      modifyPasswordModalCancel,
      modifyPasswordOk,
      form,
      recordInfo,
      modifyPasswordLoading,
    } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: 5,
      },
      wrapperCol: {
        sm: 16,
      },
    };
    const checkConfirm = (rule, value, callback) => {
      if (value && value.length < 6) {
        callback('密码长度为6-12位');
      } else if (value && value.length > 12) {
        callback('密码长度为6-12位');
      } else if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不匹配!');
      } else {
        callback();
      }
    };
    const checkNewpassword = (rule, value, callback) => {
      const newPassword = form.getFieldValue('new_password');
      if (newPassword && newPassword.length >= 6) {
        form.validateFields(['new_password'], { force: true });
      }
      callback();
    };
    const onOk = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
          const { new_password } = fieldsValue;
          const values = sha256.hex(new_password);
          modifyPasswordOk(values);
      });
    };
    return (
      <Modal
        title="修改密码"
        okText="确认修改"
        destroyOnClose
        onOk={onOk}
        onCancel={() => modifyPasswordModalCancel()}
        visible={passwordModalVisible}
      >
      <Spin spinning={modifyPasswordLoading || false}>
      <Form>
          <FormItem label="新密码" {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入新密码' },
                {
                  min: 6,
                  message: '密码长度为6-12位',
                },
                {
                  max: 12,
                  message: '密码长度为6-12位',
                },
                {
                  validator: checkNewpassword,
                },
              ],
            })(<Input type="password" placeholder="请输入新密码" />)}
          </FormItem>
          <FormItem label="确认密码" {...formItemLayout}>
            {getFieldDecorator('new_password', {
              rules: [
                { required: true, message: '请输入密码' },
                { validator: checkConfirm },
              ],
            })(<Input placeholder="请确认密码" type="password" />)}
          </FormItem>
      </Form>
      </Spin>
        
      </Modal>
    );
  });
@Form.create()
@connect(({ sysAccount, loading }) => ({
  sysAccount,
  loading: loading.effects['sysAccount/fetchAccountList'],
  modifyPasswordLoading: loading.effects['sysAccount/fetchModifyPassword'],
}))
export default class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {
        page: 1,
        pageSize: 10,
      },
      expandForm: false,
      searchValues: {},
      passwordModalVisible: false,
      recordInfo: {}, // 修改密码存储信息
    };
  }
  componentDidMount() {
    this.onGetLevel();
    this.onGetAccountList({
      params: {},
      offset: 0,
      limit: 10,
    });
  }
  onGetLevel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchDeptLevel',
    });
  }
  onGetAccountList({ params, offset, limit }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchAccountList',
      params,
      offset,
      limit,
    });
  }
  onDelete = (record) => {
    // 删除帐号
    const { dispatch, form } = this.props;
    const { args } = this.state;
    const that = this;
    confirm({
      title: `您确定删除${record.username}吗？`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'sysAccount/fetchDeleteAccount',
            userid: record.id,
            success: (res) => {
              message.success(res.msg);
              that.setState({
                searchValues: {},
                args: {
                  page: 1,
                  pageSize: args.pageSize,
                },
              });
              form.resetFields();
              that.onGetAccountList({
                params: {},
                offset: 0,
                limit: args.pageSize,
              });
              resolve();
            },
            error: (res) => {
              message.error(res.msg);
              reject();
            },
          });
        });
      },
      onCancel() {},
    });
  };
  onIsActive = (record) => {
      // 禁用或者启用帐号
    const { dispatch } = this.props;
    const { args, searchValues } = this.state;
    const { is_active } = record;
    const name = is_active === 0 ? '启用' : '禁用';
    const active_status = is_active === 0 ? 1 : 0;
    const that = this;
    confirm({
      title: `您确定${name}${record.username}吗？`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'sysAccount/fetcChangeStatus',
            userid: record.id,
            active_status,
            success: (res) => {
              message.success(res.msg);
              that.onGetAccountList({
                params: searchValues,
                offset: (args.page - 1) * args.pageSize,
                limit: args.pageSize,
              });
              resolve();
            },
            error: (res) => {
              message.error(res.msg);
              reject();
            },
          });
        });
      },
      onCancel() {},
    });
  }
  onPaginationChange = (pagination) => {
    // table页码改变
    const { searchValues } = this.state;
    this.setState({
      args: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.onGetAccountList({
      params: searchValues,
      offset: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });
  };
  handleSearch = (e) => {
    // 搜索
    e.preventDefault();
    const { form } = this.props;
    const { args } = this.state;
    form.validateFields((err, fieldsValue) => {
      const values = {};
      const { create_time, ...others } = fieldsValue;
      if (create_time && create_time.length > 0) {
        values.created_start = create_time[0].format('YYYY-MM-DD');
        values.created_end = create_time[1].format('YYYY-MM-DD');
      }
      for (const key in others) {
        if (others[key] && others[key].trim().length > 0) {
          values[key] = others[key].trim();
        }
      }
      this.setState({
        args: {
          page: 1,
          pageSize: args.pageSize,
        },
        searchValues: values,
      });
      this.onGetAccountList({
        params: values,
        offset: 0,
        limit: args.pageSize,
      });
    });
  };
  handleFormReset = () => {
    // 重置
    const { form } = this.props;
    const { args } = this.state;
    form.resetFields();
    this.setState({
      args: {
        page: 1,
        pageSize: args.pageSize,
      },
      searchValues: {},
    });
    this.onGetAccountList({
      params: {},
      offset: 0,
      limit: args.pageSize,
    });
  };
  // 弹出修改密码模态框
  modifyPassword = (record) => {
    this.setState({
      passwordModalVisible: true,
      recordInfo: record,
    });
  };
  // 修改密码模态框取消
  modifyPasswordModalCancel = () => {
    this.setState({
      passwordModalVisible: false,
    });
  };
  // 确认修改密码
  modifyPasswordOk = (values) => {
    const { recordInfo } = this.state;
    const { dispatch } = this.props;
    console.log(recordInfo);
    dispatch({
      type: 'sysAccount/fetchModifyPassword',
      userid: recordInfo.id,
      password: values,
      success: () => {
        message.success('修改密码成功');
        this.setState({
            passwordModalVisible: false,
        });
      },
      error: (res) => {
        message.error(res.msg);
      },
    });
  };
  renderForm() {
    const { form, sysAccount } = this.props;
    const { getFieldDecorator } = form;
    const { deptLevel } = sysAccount;
    const { expandForm } = this.state;
    const formItemLayout = {
      wrapperCol: {
        xs: 17,
      },
      labelCol: {
        xs: 7,
      },
    };
    return (
      <Form onSubmit={this.handleSearch} style={{ marginBottom: 20 }}>
        <Row gutter={{ md: 10, xs: 12 }}>
          <Col md={8} xs={24}>
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} xs={24}>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('realname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} xs={24}>
            <FormItem label="联系方式" {...formItemLayout}>
              {getFieldDecorator('telphone')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Fragment>
              <Col md={8} xs={24}>
                <FormItem label="帐号状态" {...formItemLayout}>
                  {getFieldDecorator('active_status')(
                    <Select placeholder="请选择">
                      <Option value="">全部</Option>
                      <Option value="0">禁用</Option>
                      <Option value="1">启用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} xs={24}>
                <FormItem label="所属部门" {...formItemLayout}>
                  {getFieldDecorator('dept_id')(
                    <Select placeholder="请选择">
                      <Option value="">全部</Option>
                      {deptLevel.map(ele => (
                        <Option key={ele.id}>{ele.name}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} xs={24}>
                <FormItem label="创建日期" {...formItemLayout}>
                  {getFieldDecorator('create_time')(
                    <RangePicker style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Fragment>
          ) : null}
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <span
              style={{ marginLeft: 8 }}
              onClick={this.toggleForm}
              className={styles.unfold}
            >
              {expandForm ? (
                <a
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    this.setState({ expandForm: false });
                  }}
                >
                  收起
                  <Icon type="up" />
                </a>
              ) : (
                <a
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    this.setState({ expandForm: true });
                  }}
                >
                  展开
                  <Icon type="down" />
                </a>
              )}
            </span>
          </span>
        </div>
      </Form>
    );
  }
  render() {
    const { sysAccount, loading, modifyPasswordLoading } = this.props;
    const { accountList, accountTotal } = sysAccount;
    const { args, passwordModalVisible, recordInfo } = this.state;
    const { page, pageSize } = args;
    const columns = [
      {
        title: '序号',
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '用户名',
        key: 'username',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        key: 'realname',
        dataIndex: 'realname',
        render: (val, record) => (record.user_type === 4 ? '--' : val || '--'),
      },
      {
        title: '联系方式',
        key: 'telphone',
        render: record =>
          (record.user_type === 4 ? '--' : record.profile.telphone || '--'),
      },
      {
        title: '所属部门',
        key: 'dept_name',
        render: record =>
          (record.user_type === 4 ? '--' : record.profile.group.dept_name || '--'),
      },
      {
        title: '角色名称',
        key: 'user_type',
        dataIndex: 'user_type',
        render: val => USER_TYPE[val],
      },
      {
        title: '职位',
        key: 'position',
        render: record => (record.user_type === 4
            ? '--' :
            record.profile.position || '--'),
      },
      {
        title: '创建日期',
        key: 'created_time',
        render: record =>
          (record.user_type === 4
            ? '--'
            : moment(record.created_time * 1000).format('YYYY-MM-DD HH:mm:ss')),
      },
      {
        title: '帐号状态',
        key: 'is_active',
        dataIndex: 'is_active',
        render: val => (
          <Badge status={BADGE_STATUS[val]} text={ACTIVE_STATUS[val]} />
        ),
      },
      {
        title: '操作',
        width: 270,
        fixed: 'right',
        key: 'operation',
        render: record =>
          (record.user_type === 4 ? (
            '--'
          ) : (
            <div>
              <a
                href={`${location.href}/operation?typeId=${
                  record.id
                }&type=modify`}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                href={`${location.href}/operation?typeId=${
                    record.id
                  }&type=view`}
              >
                查看
              </a>
              <Divider type="vertical" />
              <a href=" javascript:;" onClick={() => this.modifyPassword(record)}>
                修改密码
              </a>
              <Divider type="vertical" />
              <a
                href=" javascript:;"
                onClick={() => this.onIsActive(record)}
              >
              {record.is_active === 0 ? '启用' : '禁用'}
              </a>
              <Divider type="vertical" />
              <a href=" javascript:;" onClick={() => this.onDelete(record)}>
                删除
              </a>
            </div>
          )),
      },
    ];
    const paginationOptions = {
      current: page >> 0,
      pageSize: pageSize >> 0,
      total: accountTotal >> 0,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <PageHeaderLayout title="帐号列表">
        <Card title="搜索条件" style={{ marginBottom: 30 }}>
          {this.renderForm()}
        </Card>
        <Card>
          <div style={{ marginBottom: 20 }}>
            <Button type="primary">
              <a href={`${location.href}/operation?type=add`}>
                <Icon type="plus" />
                新增帐号
              </a>
            </Button>
          </div>
          <Table
            columns={columns}
            scroll={{ x: 1300 }}
            dataSource={accountList.map((ele) => {
              return { ...ele, key: ele.created_time };
            })}
            loading={loading}
            pagination={paginationOptions}
            onChange={this.onPaginationChange}
          />
        </Card>
        <ModifyPasswordModal
          passwordModalVisible={passwordModalVisible}
          modifyPasswordModalCancel={this.modifyPasswordModalCancel}
          recordInfo={recordInfo}
          modifyPasswordOk={this.modifyPasswordOk}
          modifyPasswordLoading={modifyPasswordLoading}
        />
      </PageHeaderLayout>
    );
  }
}
