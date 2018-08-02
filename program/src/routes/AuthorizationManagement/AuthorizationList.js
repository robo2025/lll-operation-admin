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
  Badge,
  Divider,
  message,
  Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';
import AuthorizationTable from './AuthorizationTable';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const AuthorizationModal = Form.create()((props) => {
  const { form, handleModalVisible, modalVisible, row } = props;
  return (
    <Modal
      width={1100}
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
          handleModalVisible(false);
        });
      }}
      title="产品授权"
    >
      <Row style={{ marginLeft: 30, marginBottom: 8 }}>
        <Col span={12}>企业名称：{row.company}</Col>
        <Col span={12}>账号：{row.username}</Col>
      </Row>
      <AuthorizationTable id={row.id} />
    </Modal>
  );
});
@connect(({ authorizationManagement, loading }) => ({
  authorizationManagement,
  loading: loading.effects['authorizationManagement/fetch'],
}))
@Form.create()
export default class AuthorizationList extends Component {
  state = {
    formExpand: false,
    modalVisible: false,
    rowSelected: {},
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'authorizationManagement/fetch',
    });
  }
  onPageChange = (page, pageSize) => {
    const fieldsValue = this.props.form.getFieldsValue();
    const { rangeValue, district, ...others } = fieldsValue;
    this.props.dispatch({
      type: 'authorizationManagement/savePagination',
      payload: { current: page, pageSize },
    });
    this.props.dispatch({
      type: 'authorizationManagement/fetch',
      payload: {
        start_time:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        end_time:
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
      type: 'authorizationManagement/fetch',
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form, authorizationManagement } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { rangeValue, ...others } = fieldsValue;
      const values = {
        ...others,
        start_time:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        end_time:
          rangeValue && rangeValue.length
            ? rangeValue[1].format('YYYY-MM-DD')
            : null,
      };
      dispatch({
        type: 'authorizationManagement/savePagination',
        payload: { ...authorizationManagement.pagination, current: 1 },
      });
      dispatch({
        type: 'authorizationManagement/fetch',
        payload: values,
      });
    });
  };
  handleModalVisible = (flag) => {
    this.setState({ modalVisible: flag });
  };
  handleModalSubmit = ({ password }) => {
    const { rowSelected } = this.state;
    this.props.dispatch({
      type: 'authorizationManagement/passwordChange',
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
  handleAuthorization = (row) => {
    this.setState({ rowSelected: row }, this.handleModalVisible(true));
  };
  render() {
    const { loading, authorizationManagement } = this.props;
    const { supplierList, pagination } = authorizationManagement;
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
        dataIndex: 'company',
        key: 'company',
      },
      {
        title: '法人',
        dataIndex: 'legal',
        key: 'legal',
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
        dataIndex: 'date_joined',
        key: 'date_joined',
        render: text => moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '授权状态',
        dataIndex: 'status',
        key: 'status',
        render: text =>
          (text ? (
            <span>
              <Badge status="success" />已授权
            </span>
          ) : (
            <span>
              <Badge status="error" />未授权
            </span>
          )),
      },
      {
        title: '操作',
        key: 'option',
        render: row => (
          <Fragment>
            <a onClick={() => this.handleAuthorization(row)}>
              {row.status ? '编辑授权' : '产品授权'}
            </a>
            <Divider type="vertical" />
            <a
              onClick={() =>
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/authorizationManagement/authorizationDetail',
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
                  {getFieldDecorator('rangeValue')(<RangePicker />)}
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
                      {getFieldDecorator('status')(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                          <Option value="0">未授权</Option>
                          <Option value="1">已授权</Option>
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
        <AuthorizationModal
          modalVisible={this.state.modalVisible}
          handleModalVisible={this.handleModalVisible}
          row={this.state.rowSelected}
        />
      </PageHeaderLayout>
    );
  }
}
