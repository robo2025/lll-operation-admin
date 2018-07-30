import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Badge,
  Spin,
  Table,
  Divider,
  message,
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
} from 'antd';
import DescriptionList from '../../components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getAreaBycode } from '../../utils/cascader-address-options';
import { PasswordModal } from './AccountList';
import {
  allPermissions,
  convertCodeToName,
  convertNameToCode,
} from '../../constant/permissionDetail';
import LogTable from '../../components/LogTable';

const CheckboxGroup = Checkbox.Group;
const { Description } = DescriptionList;
const FormItem = Form.Item;
const COMPANY_TYPE = {
  supplier: '供应商',
  integrator: '集成商',
  agency: '代理商',
  other: '其他',
};
const ACTIVE_STATUS = {
  1: (
    <span>
      <Badge status="success" />启用
    </span>
  ),
  0: (
    <span>
      <Badge status="error" />禁用
    </span>
  ),
};
const FormModal = Form.create({
  mapPropsToFields(props) {
    const { rowSelected } = props;
    if (Object.keys(rowSelected).length === 0) {
      return {}; // 如果为空,返回false
    }
    const { profile, ...others } = rowSelected;
    const { permissions } = profile;
    let formData = {};
    // profile解构
    const data = { ...others, ...profile };
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
})((props) => {
  const {
    rowSelected,
    visible,
    handleAdd,
    handleModify,
    handleModalVisibal,
    modalType, // add||modify
    form,
  } = props;
  const checkAll = () => {
    if (
      form.getFieldValue('permissions') &&
      form.getFieldValue('permissions').length === allPermissions.length
    ) {
      form.setFieldsValue({ permissions: [] });
    } else {
      form.setFieldsValue({ permissions: allPermissions });
    }
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (modalType === 'add') {
        handleAdd(fieldsValue);
      } else if (modalType === 'modify') {
        handleModify(fieldsValue);
      }
      form.resetFields();
    });
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  return (
    <Modal
      destroyOnClose
      width={modalType === 'modify' ? 800 : undefined}
      title={modalType === 'add' ? '新增子账号' : '修改子账号'}
      visible={visible}
      onOk={okHandle}
      okText="确定"
      onCancel={() => {
        handleModalVisibal(false);
        form.resetFields();
      }}
    >
      <FormItem label="子账号" {...formItemLayout}>
        {form.getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: '该字段为必填项!',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      {modalType === 'add' ? (
        <FormItem label="密码" {...formItemLayout}>
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: true,
                min: 6,
                max: 16,
                message: '密码应在6-16位数之间!',
              },
            ],
          })(<Input type="password" placeholder="请输入密码" />)}
        </FormItem>
      ) : null}
      <FormItem label="姓名" {...formItemLayout}>
        {form.getFieldDecorator('realname')(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="联系方式" {...formItemLayout}>
        {form.getFieldDecorator('telphone')(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="岗位" {...formItemLayout}>
        {form.getFieldDecorator('position')(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="模块权限" {...formItemLayout}>
        <Checkbox
          onChange={() => checkAll()}
          checked={
            form.getFieldValue('permissions')
              ? form.getFieldValue('permissions').length ===
                allPermissions.length
              : false
          }
        >
          全部模块
        </Checkbox>
        {form.getFieldDecorator('permissions', {
          rules: [
            {
              required: true,
              message: '请选择模块权限!',
            },
          ],
        })(<CheckboxGroup options={allPermissions} />)}
      </FormItem>
      {modalType === 'modify' ? (
        <Card title="操作日志">
          <LogTable object_id={rowSelected.id} module="auth_user" />
        </Card>
      ) : null}
    </Modal>
  );
});
@connect(({ supAccount, loading }) => ({
  profile: supAccount.profile,
  subAccountList: supAccount.subAccountList,
  loading:
    loading.effects['supAccount/fetchDetail'] ||
    loading.effects['supAccount/fetchSubAccounts'],
}))
export default class SubAccountList extends Component {
  state = {
    passwordModalVisible: false,
    modalVisible: false,
    modalType: 'add',
    rowSelected: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supAccount/fetchDetail',
      payload: location.href.split('=').pop(),
    });
    dispatch({
      type: 'supAccount/fetchSubAccounts',
      payload: { id: location.href.split('=').pop() },
    });
  }
  disableAccount = (main_user_id, subuserid, is_active) => {
    this.props.dispatch({
      type: 'supAccount/disableSubAccount',
      payload: { main_user_id, subuserid, active_status: is_active },
      callback: (success, msg) => {
        if (success) {
          message.success(msg);
          this.props.dispatch({
            type: 'supAccount/fetchSubAccounts',
            payload: { id: location.href.split('=').pop() },
          });
        } else {
          message.error(msg);
        }
      },
    });
  };
  hanldeAccountAdd = () => {
    this.setState({
      rowSelected: {},
      modalVisible: true,
      modalType: 'add',
    });
  };
  hanldeAccountModify = (row) => {
    this.setState({
      rowSelected: row,
      modalVisible: true,
      modalType: 'modify',
    });
  };
  hanldeAccountDelete = (row) => {
    const { dispatch } = this.props;
    const { main_user_id, id } = row;
    Modal.confirm({
      title: '删除子账户',
      content: '确认删除该供应商子账户吗？删除后将不能回复！',
      onOk: () => {
        dispatch({
          type: 'supAccount/hanldeSubAccountDelete',
          payload: { main_user_id, subuserid: id },
          callback: (success, msg) => {
            if (success) {
              message.success(msg);
              dispatch({
                type: 'supAccount/fetchSubAccounts',
                payload: { id: location.href.split('=').pop() },
              });
            } else {
              message.error(msg);
            }
          },
        });
      },
    });
  };
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: flag,
    });
  };
  handlePasswordModalVisible = (flag) => {
    this.setState({
      passwordModalVisible: flag,
    });
  };

  hanldePasswordChange = (row) => {
    const { profile } = this.props.profile;
    this.setState({
      rowSelected: {
        ...row,
        profile: { ...row.profile, company: profile.company },
      }, // 把主账号的公司名加进去
    });
    this.handlePasswordModalVisible(true);
  };
  hanldePasswordChangeSubmit = ({ password }) => {
    const { rowSelected } = this.state;
    this.props.dispatch({
      type: 'supAccount/passwordChange',
      payload: { id: rowSelected.id, password },
      callback: (success, msg) => {
        if (success) {
          message.success(msg);
          this.handlePasswordModalVisible(false);
        } else {
          message.error(msg);
        }
      },
    });
  };
  handleAdd = (formData) => {
    const id = location.href.split('=').pop();
    this.props.dispatch({
      type: 'supAccount/addSubAccount',
      payload: { formData, id },
      callback: (success, msg) => {
        if (success) {
          message.success(msg);
          this.handleModalVisible(false);
          this.props.dispatch({
            type: 'supAccount/fetchSubAccounts',
            payload: { id },
          });
        } else {
          message.error(msg);
        }
      },
    });
  };
  handleModify = (formData) => {
    const id = location.href.split('=').pop();
    this.props.dispatch({
      type: 'supAccount/modifySubAccount',
      payload: { formData, id, subuserid: this.state.rowSelected.id },
      callback: (success, msg) => {
        if (success) {
          message.success(msg);
          this.handleModalVisible(false);
          this.props.dispatch({
            type: 'supAccount/fetchSubAccounts',
            payload: { id },
          });
        } else {
          message.error(msg);
        }
      },
    });
  };
  render() {
    const { profile, subAccountList, loading } = this.props;
    if (!profile.profile) {
      return <Spin />;
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render: (text, record, index) => index + 1,
      },
      {
        title: '子帐号帐号',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'profile.realname',
        key: 'profile.realname',
      },
      {
        title: '联系方式',
        dataIndex: 'profile.telphone',
        key: 'profile.telphone',
        render: text => text || '-',
      },
      {
        title: '岗位',
        dataIndex: 'profile.position',
        key: 'profile.position',
        render: text => text || '-',
      },
      {
        title: '创建人',
        dataIndex: 'profile.creator',
        key: 'profile.creator',
      },
      {
        title: '创建日期',
        dataIndex: 'created_time',
        key: 'created_time',
        render: text => moment.unix(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        key: 'is_active',
        render: text => ACTIVE_STATUS[text],
        filters: [
          {
            text: '启用',
            value: '1',
          },
          {
            text: '禁用',
            value: '0',
          },
        ],
        onFilter: (value, record) => `${record.is_active}` === value, // 类型不同
      },
      {
        title: '操作',
        key: 'opreation',
        render: row => (
          <Fragment>
            {row.is_active ? (
              <a
                onClick={() => this.disableAccount(row.main_user_id, row.id, 0)}
              >
                禁用
              </a>
            ) : (
              <a
                onClick={() => this.disableAccount(row.main_user_id, row.id, 1)}
              >
                启用
              </a>
            )}
            <Divider type="vertical" />
            <a onClick={() => this.hanldeAccountModify(row)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.hanldeAccountDelete(row)}>删除</a>

            <Divider type="vertical" />
            <a onClick={() => this.hanldePasswordChange(row)}>密码重置</a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="供应商子账号列表">
        <Card title="主账号信息" bordered style={{ marginTop: 35 }}>
          <div style={{ color: '#1890ff', fontSize: 16, marginBottom: 5 }}>
            <span>主账号 ：{profile.username}</span>
          </div>
          <DescriptionList size="small" col="2">
            <Description term="企业名称">{profile.profile.company}</Description>
            <Description term="手机号">{profile.mobile}</Description>
            <Description term="企业地址">
              <span>
                {getAreaBycode(`${profile.profile.district_id}`)}
                {profile.profile.address}
              </span>
            </Description>
            <Description term="联系邮箱">{profile.email}</Description>
            <Description term="法人">{profile.profile.legal}</Description>
            <Description term="固定电话">
              {profile.profile.telphone}
            </Description>
            <Description term="企业性质">
              {COMPANY_TYPE[profile.profile.company_type]}
            </Description>
            <Description term="注册时间">
              {moment.unix(profile.created_time).format('YYYY-MM-DD')}
            </Description>
            <Description term="状态">
              {ACTIVE_STATUS[profile.is_active]}
            </Description>
          </DescriptionList>
        </Card>
        <Card title="子帐号信息" style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={() => this.hanldeAccountAdd()}
              icon="plus"
            >
              新建子账号
            </Button>
          </div>
          <Table
            loading={loading}
            columns={columns}
            dataSource={
              subAccountList
                ? subAccountList.map((item) => {
                    return { ...item, key: item.created_time };
                  })
                : []
            }
          />
        </Card>
        <PasswordModal
          handleSubmit={this.hanldePasswordChangeSubmit}
          handleModalVisible={this.handlePasswordModalVisible}
          modalVisible={this.state.passwordModalVisible}
          row={this.state.rowSelected}
        />
        <FormModal
          visible={this.state.modalVisible}
          modalType={this.state.modalType}
          rowSelected={this.state.rowSelected}
          handleModalVisibal={this.handleModalVisible}
          handleAdd={this.handleAdd}
          handleModify={this.handleModify}
        />
      </PageHeaderLayout>
    );
  }
}
