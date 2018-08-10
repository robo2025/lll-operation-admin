import React from 'react';
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
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  operationAllPermissions,
  convertCodeToName,
  convertNameToCode,
} from '../../constant/operationPermissionDetail';
import styles from './index.less';
import LogTable from '../../components/LogTable/index';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const { confirm } = Modal;

const RoleModal = Form.create({
  mapPropsToFields(props) {
    const { rowSelected } = props;
    if (Object.keys(rowSelected).length === 0) {
      return {}; // 如果为空,返回false
    }
    const { permissions, ...others } = rowSelected;
    let formData = {};
    const data = { ...others };
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
    form,
    visible,
    deptLevel,
    onRoleModalCancal,
    modalType,
    onRoleModalOk,
    editLoading,
    addLoading,
    rowSelected,
  } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      md: 6,
    },
    wrapperCol: {
      md: 14,
    },
  };
  const disabled = modalType === 'view';
  const modalTitle =
    modalType === 'view'
      ? '查看角色'
      : modalType === 'modify'
        ? '编辑角色'
        : '新增角色';
  const buttonTitle =
    modalType === 'view'
      ? '返回'
      : modalType === 'modify'
        ? '确认编辑'
        : '确认新增';
  const checkAll = () => {
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
  const onOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { permissions, dept_name, name } = fieldsValue;
      const arr = deptLevel.filter((ele) => {
        return ele.name === dept_name;
      });
      const values = {
        permissions: convertNameToCode(permissions),
        dept_id: arr[0].id,
        name: name.trim(),
      };
      onRoleModalOk(values);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={modalTitle}
      visible={visible}
      width={1000}
      onCancel={onRoleModalCancal}
      onOk={onOk}
      footer={null}
    >
      <Spin spinning={editLoading || addLoading || false}>
        <Form style={{ width: 610, margin: '0 auto' }}>
          <FormItem label="所属部门" {...formItemLayout}>
            {getFieldDecorator('dept_name', {
              rules: [
                {
                  required: true,
                  message: '请选择所属部门',
                },
              ],
            })(
              <Select placeholder="请选择" disabled={disabled}>
                {deptLevel.map(ele => (
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
            })(<Input placeholder="请输入" disabled={disabled} />)}
          </FormItem>
          <FormItem label="模块权限" {...formItemLayout}>
            <Checkbox
              disabled={disabled}
              onChange={() => checkAll()}
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
                disabled={disabled}
                className={styles.roleModal}
                options={operationAllPermissions}
              />
            )}
          </FormItem>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={onOk}>
              {buttonTitle}
            </Button>
          </div>
        </Form>
        {modalType !== 'add' ? (
          <Card style={{ marginTop: 30 }}>
          <LogTable
                object_id={rowSelected.id >> 0}
                module="auth_user"
                platform="operation"
          />
          </Card>
        ) : null}
      </Spin>
    </Modal>
  );
});
@Form.create()
@connect(({ sysAccount, loading }) => ({
  sysAccount,
  loading: loading.effects['sysAccount/fetchRoleList'],
  editLoading: loading.effects['sysAccount/fetchEditRole'],
  addLoading: loading.effects['sysAccount/fetchAddRole'],
}))
export default class RolePermission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {
        page: 1,
        pageSize: 10,
      },
      searchValues: {},
      visible: false,
      rowSelected: {},
      modalType: '',
    };
  }
  componentDidMount() {
    this.onGetLevel();
    this.onGetRoleList({
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
  onGetRoleList({ params, offset, limit }) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchRoleList',
      params,
      offset,
      limit,
    });
  }
  onRoleModalCancal = () => {
    // 点击模态框取消按钮
    this.setState({
      visible: false,
    });
  };
  onRoleModalOk = (values) => {
    // 点击模态框确认按钮
    const { modalType, args, searchValues, rowSelected } = this.state;
    const { dispatch, form } = this.props;
    if (modalType === 'add') {
      // 新增
      dispatch({
        type: 'sysAccount/fetchAddRole',
        params: values,
        success: (res) => {
          message.success(res.msg);
          this.setState({
            visible: false,
            searchValues: {},
            args: {
              page: 1,
              pageSize: args.pageSize,
            },
          });
          this.onGetRoleList({
            params: {},
            offset: 0,
            limit: args.pageSize,
          });
          form.resetFields();
        },
        error: (error) => {
          message.error(error.msg);
        },
      });
    } else if (modalType === 'modify') {
      // 编辑
      dispatch({
        type: 'sysAccount/fetchEditRole',
        params: values,
        groupid: rowSelected.id,
        success: (res) => {
          message.success(res.msg);
          this.setState({
            visible: false,
          });
          this.onGetRoleList({
            params: searchValues,
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize,
          });
        },
      });
    } else if (modalType === 'view') {
      // 查看
      this.setState({
        visible: false,
      });
    }
  };
  onDelete = (record) => {
    // 删除角色
    const { dispatch, form } = this.props;
    const { args } = this.state;
    const that = this;
    confirm({
      title: `您确定删除${record.name}吗？`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'sysAccount/fetchDeleteRole',
            groupid: record.id,
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
              that.onGetRoleList({
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
  onPaginationChange = (pagination) => {
    // table页码改变
    const { searchValues } = this.state;
    this.setState({
      args: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.onGetRoleList({
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
      this.onGetRoleList({
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
    this.onGetRoleList({
      params: {},
      offset: 0,
      limit: args.pageSize,
    });
  };
  handleRoleAdd = () => {
    // 新增角色
    this.setState({
      rowSelected: {},
      visible: true,
      modalType: 'add',
    });
  };
  handleRoleModify = (record) => {
    // 编辑角色
    this.setState({
      rowSelected: record,
      visible: true,
      modalType: 'modify',
    });
  };
  handleRoleView = (record) => {
    // 查看角色
    this.setState({
      rowSelected: record,
      visible: true,
      modalType: 'view',
    });
  };
  renderForm() {
    const { form, sysAccount } = this.props;
    const { getFieldDecorator } = form;
    const { deptLevel } = sysAccount;
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
          <Col xl={8} md={12} xs={12}>
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
          <Col xl={8} md={12} xs={12}>
            <FormItem label="角色名称" {...formItemLayout}>
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xl={8} md={12} xs={12}>
            <FormItem label="创建日期" {...formItemLayout}>
              {getFieldDecorator('create_time')(<RangePicker />)}
            </FormItem>
          </Col>
          <Col
            xl={{ span: 8, offset: 16 }}
            md={12}
            xs={12}
            style={{ textAlign: 'right' }}
          >
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { sysAccount, loading, editLoading, addLoading } = this.props;
    const { roleList, roleListTotal, deptLevel } = sysAccount;
    const { args, visible, rowSelected, modalType } = this.state;
    const { page, pageSize } = args;
    const columns = [
      {
        title: '序号',
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '角色名称',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '所属部门',
        key: 'dept_name',
        dataIndex: 'dept_name',
      },
      {
        title: '已有帐号数',
        key: 'user_count',
        dataIndex: 'user_count',
      },
      {
        title: '创建日期',
        key: 'created_time',
        dataIndex: 'created_time',
        render: val => moment(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'operation',
        render: record => (
          <div>
            <a
              href=" javascript:;"
              onClick={() => this.handleRoleModify(record)}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a href=" javascript:;" onClick={() => this.handleRoleView(record)}>
              查看
            </a>
            <Divider type="vertical" />
            <a href=" javascript:;" onClick={() => this.onDelete(record)}>
              删除
            </a>
          </div>
        ),
      },
    ];
    const paginationOptions = {
      current: page >> 0,
      pageSize: pageSize >> 0,
      total: roleListTotal >> 0,
      showSizeChanger: true,
      showQuickJumper: true,
    };
    return (
      <PageHeaderLayout title="角色列表">
        <Card title="搜索条件" style={{ marginBottom: 30 }}>
          {this.renderForm()}
        </Card>
        <Card>
          <div style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={this.handleRoleAdd}>
              <Icon type="plus" />
              新增角色
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={roleList.map((ele) => {
              return { ...ele, key: ele.created_time };
            })}
            loading={loading}
            pagination={paginationOptions}
            onChange={this.onPaginationChange}
          />
        </Card>
        <RoleModal
          visible={visible}
          deptLevel={deptLevel}
          onRoleModalCancal={this.onRoleModalCancal}
          modalType={modalType}
          rowSelected={rowSelected}
          onRoleModalOk={this.onRoleModalOk}
          editLoading={editLoading}
          addLoading={addLoading}
        />
      </PageHeaderLayout>
    );
  }
}
