import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Row,
  Col,
  Modal,
  Select,
  Table,
  Pagination,
  Badge,
  message,
  Alert,
} from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ authorizationManagement, loading }) => ({
  authorizationManagement,
  loading: loading.effects['authorizationManagement/fetchAuthorizationList'],
}))
@Form.create()
export default class AuthorizationTable extends Component {
  state = {
    formExpand: false,
    selectedRowKeys: [],
  };
  componentDidMount() {
    const { id } = this.props;
    this.props.dispatch({
      type: 'authorizationManagement/fetchAuthorizationList',
      payload: { id },
    });
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };
  onPageChange = (page, pageSize) => {
    const fieldsValue = this.props.form.getFieldsValue();
    const { rangeValue, district, ...others } = fieldsValue;
    this.props.dispatch({
      type: 'authorizationManagement/saveAuthorizationListPagination',
      payload: { current: page, pageSize },
    });
    this.props.dispatch({
      type: 'authorizationManagement/fetchAuthorizationList',
      payload: {
        ...others,
        id: this.props.id,
        start_time:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        end_time:
          rangeValue && rangeValue.length
            ? rangeValue[1].format('YYYY-MM-DD')
            : null,
      },
    });
  };
  handleFormReset = () => {
    const { dispatch, form, id } = this.props;
    form.resetFields();
    dispatch({
      type: 'authorizationManagement/fetchAuthorizationList',
      payload: { id },
    });
  };
  handleSearch = (e) => {
    const { id } = this.props;
    e.preventDefault();
    const { dispatch, form, authorizationManagement } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { rangeValue, ...others } = fieldsValue;
      const values = {
        ...others,
        id: this.props.id,
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
        type: 'authorizationManagement/saveAuthorizationListPagination',
        payload: { ...authorizationManagement.pagination, current: 1 },
      });
      dispatch({
        type: 'authorizationManagement/fetchAuthorizationList',
        payload: { ...values, id },
      });
    });
  };
  handleAuthorize = (pnos) => {
    const { id, dispatch } = this.props;
    dispatch({
      type: 'authorizationManagement/handleAuthorize',
      payload: { pnos, id },
      callback: (success, msg) => {
        if (success) {
          message.success(msg);
          dispatch({
            type: 'authorizationManagement/fetchAuthorizationList',
            payload: { id },
          });
        } else {
          message.error(msg);
        }
      },
    });
  };
  handleCancelAuthorize = (pno) => {
    const { dispatch, id } = this.props;
    Modal.confirm({
      title: '取消授权',
      content: '确认取消该系列的授权吗？',
      onOk: () => {
        dispatch({
          type: 'authorizationManagement/handleCancelAuthorize',
          payload: { pno, id },
          callback: (success, msg) => {
            if (success) {
              message.success(msg);
              dispatch({
                type: 'authorizationManagement/fetchAuthorizationList',
                payload: { id },
              });
            } else {
              message.error(msg);
            }
          },
        });
      },
    });
  };
  render() {
    const { loading, authorizationManagement } = this.props;
    const {
      authorizationList,
      authorizationListPagination,
    } = authorizationManagement;
    const { getFieldDecorator } = this.props.form;
    const paginationProps = {
      ...authorizationListPagination,
      style: { float: 'right', marginTop: 24 },
      showQuickJumper: true,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      showSizeChanger: true,
    };
    const rowSelection = {
      fixed: true,
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
        key: 'brand_name',
      },
      {
        title: '注册地',
        dataIndex: 'registration_place',
        key: 'registration_place',
      },
      {
        title: '所属三级类目',
        dataIndex: 'category_id_3',
        key: 'category_id_3',
      },
      {
        title: '所属二级类目',
        dataIndex: 'category_id_2',
        key: 'category_id_2',
        render: text => text || '-',
      },
      {
        title: '所属一级类目',
        dataIndex: 'category_id_1',
        key: 'category_id_1',
      },
      {
        title: '企业已上架商品数',
        dataIndex: 'publish_goods_count',
        key: 'publish_goods_count',
      },
      {
        title: '授权状态',
        dataIndex: 'status',
        key: 'status',
        render: text =>
          // 2已授权 1未授权
          (text === 2 ? (
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
        fixed: 'right',
        render: row =>
          (row.status === 2 ? (
            <a onClick={() => this.handleCancelAuthorize(row.pno)}>取消授权</a>
          ) : (
            <a onClick={() => this.handleAuthorize([row.pno])}>授权</a>
          )),
      },
    ];
    return (
      <Fragment>
        <Card title="搜索条件">
          <Form
            onSubmit={this.handleSearch}
            layout="inline"
            className={styles.tableListForm}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col xll={4} md={12} sm={24}>
                <FormItem label="所属类目">
                  {getFieldDecorator('category')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={12} sm={24}>
                <FormItem label="授权状态">
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="1">未授权</Option>
                      <Option value="2">已授权</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {this.state.formExpand ? (
              <Fragment>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col xll={4} md={12} sm={24}>
                    <FormItem label="品牌">
                      {getFieldDecorator('brand_name')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col xll={4} md={12} sm={24}>
                    <FormItem label="产品名称">
                      {getFieldDecorator('product_name')(
                        <Input placeholder="请输入" />
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
        <Card style={{ marginTop: 10 }} loading={loading}>
          <Button type="primary" onClick={() => this.handleAuthorize(this.state.selectedRowKeys)}> 批量授权</Button>
          <div style={{ marginTop: 8 }}>
            <Alert
              message={
                <Fragment>
                  已选择{' '}
                  <a style={{ fontWeight: 600 }}>
                    {this.state.selectedRowKeys.length}
                  </a>{' '}
                  项&nbsp;&nbsp;
                </Fragment>
              }
              type="info"
              showIcon
            />
          </div>
          <Table
            columns={columns}
            pagination={false}
            dataSource={authorizationList}
            rowKey="pno"
            scroll={{ x: 1300 }}
            rowSelection={rowSelection}
          />
          <Pagination {...paginationProps} />
        </Card>
      </Fragment>
    );
  }
}
