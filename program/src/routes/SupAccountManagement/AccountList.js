import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Pagination,
  Divider,
  message,
  Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PasswordModal = Form.create()((props) => {
  const { form, handleModalVisible, handleSubmit, modalVisible, row } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={modalVisible}
      onCancel={() => {
        form.resetFields();
        handleModalVisible(false);
      }}
      onOk={() => {
        form.validateFields((err, value) => {
          if (err) {
            return;
          }
          form.resetFields();
          handleSubmit(value);
        });
      }}
      title="重置密码"
    >
      <Form layout="inline" style={{ marginTop: 15 }}>
        <div style={{ textAlign: 'center' }}>
          <FormItem label="账号">{row.username}</FormItem>
          <FormItem label="企业名称">
            {row.profile ? row.profile.company : ''}
          </FormItem>
        </div>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <FormItem label="新密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  min: 6,
                  max: 12,
                  message: '密码应在6-12位数之间!',
                },
              ],
            })(<Input type="password" placeholder="请输入密码" />)}
          </FormItem>
        </div>
      </Form>
    </Modal>
  );
});
@connect(({ supAccount, loading }) => ({
  supAccount,
  loading: loading.effects['supAccount/fetch'],
}))
@Form.create()
export default class AccountList extends Component {
  state = {
    formExpand: false,
    modalVisible: false,
    rowSelected: {},
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'supAccount/fetch',
    });
  }
  onPageChange = (page, pageSize) => {
    const fieldsValue = this.props.form.getFieldsValue();
    const rangeValue = fieldsValue['range-picker'];
    const { district, ...others } = fieldsValue;
    this.props.dispatch({
      type: 'supAccount/savePagination',
      payload: { current: page, pageSize },
    });
    this.props.dispatch({
      type: 'supAccount/fetch',
      payload: {
        created_start:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        created_end:
          rangeValue && rangeValue.length
            ? rangeValue[1].format('YYYY-MM-DD')
            : null,
        ...others,
      },
    });
  };
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'supAccount/fetch',
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form, supAccount } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const rangeValue = fieldsValue['range-picker'];
      const values = {
        ...fieldsValue,
        created_start:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        created_end:
          rangeValue && rangeValue.length
            ? rangeValue[1].format('YYYY-MM-DD')
            : null,
      };
      dispatch({
        type: 'supAccount/savePagination',
        payload: { ...supAccount.pagination, current: 1 },
      });
      dispatch({
        type: 'supAccount/fetch',
        payload: values,
      });
    });
  };
  disableAccount = (id, is_active) => {
    this.props.dispatch({
      type: 'supAccount/disableAccount',
      payload: { id, active_status: is_active },
      callback: (success, msg) => {
        if (success) {
          message.success(msg);
        } else {
          message.error(msg);
        }
      },
    });
  };
  handleModalVisible = (flag) => {
    this.setState({ modalVisible: flag });
  };
  hanldePasswordChange = (row) => {
    this.setState({ rowSelected: row });
    this.handleModalVisible(true);
  };
  handleModalSubmit = ({ password }) => {
    const { rowSelected } = this.state;
    this.props.dispatch({
      type: 'supAccount/passwordChange',
      payload: { id: rowSelected.id, password },
      callback: (success, msg) => {
        if (success) {
          message.success(msg);
          this.handleModalVisible(false);
        } else {
          message.error(msg);
        }
      },
    });
  };
  render() {
    const { loading, supAccount } = this.props;
    const { supplierList, pagination } = supAccount;
    const { getFieldDecorator } = this.props.form;
    const paginationProps = {
      ...pagination,
      style: { float: 'right', marginTop: 24 },
      showQuickJumper: true,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      showSizeChanger: true,
    };
    const columns = [
      {
        title: '序号',
        key: 'id',
        render: (text, record, index) => index + 1,
      },
      {
        title: '账号',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '企业名称',
        dataIndex: 'profile.company',
        key: 'profile.company',
      },
      {
        title: '法人',
        dataIndex: 'profile.legal',
        key: 'profile.legal',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '联系邮箱',
        dataIndex: 'email',
        key: 'email',
        render: text => text || '-',
      },
      {
        title: '注册日期',
        dataIndex: 'created_time',
        key: 'created_time',
        render: text => moment.unix(text).format('YYYY-MM-DD'),
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        key: 'is_active',
        render: text => (text ? '启用' : '禁用'),
      },
      {
        title: '操作',
        key: 'option',
        render: row => (
          <Fragment>
            {row.is_active ? (
              <a onClick={() => this.disableAccount(row.id, 0)}>禁用</a>
            ) : (
              <a onClick={() => this.disableAccount(row.id, 1)}>启用</a>
            )}
            <Divider type="vertical" />
            <a>子账号管理</a>
            <Divider type="vertical" />
            <a onClick={() => this.hanldePasswordChange(row)}>密码重置</a>
            <Divider type="vertical" />
            <a
              onClick={() =>
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/supAccountManagement/accountListDetail',
                    search: `?id=${row.id}`,
                  })
                )
              }
            >
              查看
            </a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="账号列表">
        <Card title="搜索条件">
          <Form
            onSubmit={this.handleSearch}
            layout="inline"
            className={styles.tableListForm}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="账号">
                  {getFieldDecorator('username')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="企业名称">
                  {getFieldDecorator('company')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>

              <Col xll={4} md={8} sm={24}>
                <FormItem label="注册时间">
                  {getFieldDecorator('range-picker')(<RangePicker />)}
                </FormItem>
              </Col>
            </Row>
            {this.state.formExpand ? (
              <Fragment>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="法人">
                      {getFieldDecorator('legal')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="手机">
                      {getFieldDecorator('mobile')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="联系邮箱">
                      {getFieldDecorator('email')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="状态">
                      {getFieldDecorator('active_status')(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                          <Option value="0">禁用</Option>
                          <Option value="1">启用</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Fragment>
            ) : null}

            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={this.handleFormReset}
                >
                  重置
                </Button>
                <span
                  style={{ marginLeft: 8 }}
                  onClick={this.toggleForm}
                  className={styles.unfold}
                >
                  {this.state.formExpand ? (
                    <a
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        this.setState({ formExpand: false });
                      }}
                    >
                      收起<Icon type="up" />
                    </a>
                  ) : (
                    <a
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        this.setState({ formExpand: true });
                      }}
                    >
                      展开<Icon type="down" />
                    </a>
                  )}
                </span>
              </span>
            </div>
          </Form>
        </Card>
        <Card bordered={false} style={{ marginTop: 30 }} loading={loading}>
          <Table
            columns={columns}
            pagination={false}
            dataSource={supplierList}
          />
          <Pagination {...paginationProps} />
        </Card>
        <PasswordModal
          handleSubmit={this.handleModalSubmit}
          handleModalVisible={this.handleModalVisible}
          modalVisible={this.state.modalVisible}
          row={this.state.rowSelected}
        />
      </PageHeaderLayout>
    );
  }
}
