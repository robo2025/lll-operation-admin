import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import moment from 'moment';
import { Card, Button, Row, Col, Form, Input, Select, Icon, Radio, Modal, message, Divider, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CustomizableTable from '../../components/CustomTable/CustomizableTable';
import ReturnAuditContent from './ReturnAuditContent';
import { PAGE_SIZE } from '../../constant/config';
import { handleServerMsgObj } from '../../utils/tools';
import styles from './order-list.less';

const { Option } = Select;
const FormItem = Form.Item;
// 订单状态
const returnsStatus = ['申请退货中', '退货中', '退货失败', '退货完成'];
// 处理状态
const dealStatus = ['未处理', '已处理'];

// 退货单列表
@connect(({ returns, loading }) => ({
  returns,
  loading: loading.models.returns,
}))
@Form.create()
export default class ReturnsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      isShowModal: false,
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'returns/fetch',
      offset: args.page ? (args.page - 1) * PAGE_SIZE : 0,
      limit: PAGE_SIZE,
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  // 处理表单搜索
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        start_time: fieldsValue.create_time ? fieldsValue.create_time[0].format('YYYY-MM-DD') : '',
        end_time: fieldsValue.create_time ? fieldsValue.create_time[1].format('YYYY-MM-DD') : '',
      };
      delete values.create_time;
      dispatch({
        type: 'returns/fetch',
        params: values,
      });
    });
  }

  // 是否展开查询条件表单
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  jumpToPage = (url) => {
    const { history } = this.props;
    history.push(url);
  }

  // 绑定审核弹出层form对象
  bindFormObj = (formObj) => {
    this.$FormObj = formObj;
  }

  // 审核按钮被点击
  handleAuditClick = (returnId) => {
    this.setState({
      isShowModal: true,
      returnId,
    });
  }

  // 审核退货：取消弹出层
  handleCancelModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 审核退货：确定弹出层
  handleOkModal = () => {
    const that = this;
    this.$FormObj.validateFields((err, values) => {
      if (!err) {
        this.setState({
          isShowModal: false,
        });
        that.handleAuditSubmit({
          is_pass: values.is_pass,
          remarks: values.remarks,
          responsible_party: values.responsible_party,
        });
      } else {
        console.log('校验出错', err);
      }
    });
  }

  // 提交审核
  handleAuditSubmit = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'returns/fetchAudit',
      returnId: this.state.returnId,
      data,
      success: () => {
        message.success('提交成功');
        const args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        this.props.dispatch({
          type: 'returns/fetch',
          offset: qs.page ? (args.page - 1) * PAGE_SIZE : 0,
          limit: PAGE_SIZE,
        });
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, history } = this.props;
    const { formValues } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };

    // 分页：将页数提取到url上
    history.push({
      pathname: '/returns/list',
      search: `?page=${params.currentPage}`,
    });
    dispatch({
      type: 'returns/fetch',
      offset: params.offset,
      limit: params.pageSize,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="退货单编号">
              {getFieldDecorator('returns_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="源订单编号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('is_deal')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待审核</Option>
                  <Option value="2">通过</Option>
                  <Option value="3">未通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
              展开 <Icon type="down" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="退货单编号">
              {getFieldDecorator('returns_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="源订单编号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('is_deal')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待审核</Option>
                  <Option value="2">通过</Option>
                  <Option value="3">未通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 64, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="客户公司名称">
              {getFieldDecorator('guest_company_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="供应商公司名称">
              {getFieldDecorator('supplier_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="退货状态">
              {getFieldDecorator('order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">申请退货</Option>
                  <Option value="2">退货中</Option>
                  <Option value="3">退货失败</Option>
                  <Option value="4">退货完成</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { returns, loading } = this.props;
    const { args, isShowModal } = this.state;
    const { total, list } = returns;


    const columns = [{
      title: '退货单编号',
      dataIndex: 'returns_sn',
      key: 'returns_sn',
      width: 200,
      fixed: 'left',
    }, {
      title: '源订单编号',
      dataIndex: 'order_sn',
      key: 'order_sn',
      width: 200,
    }, {
      title: '客户公司名称',
      dataIndex: 'guest_company_name',
      align: 'guest_company_name',
      width: 150,
      render: val => `${val}`,
    }, {
      title: '供应商公司名称',
      dataIndex: 'supplier_company_name',
      key: 'supplier_company_name',
      width: 150,
    }, {
      title: '交易总金额(元)',
      dataIndex: 'subtotal_money',
      key: 'subtotal_money',
      width: 150,
    }, {
      title: '退货金额(元)',
      dataIndex: 'return_money',
      key: 'return_money',
      width: 150,
    }, {
      title: '退货状态',
      dataIndex: 'return_status',
      key: 'return_status',
      width: 150,
      render: text => (<span>{returnsStatus[text - 1]}</span>),
    }, {
      title: '退货申请时间',
      dataIndex: 'return_add_time',
      key: 'return_add_time',
      sorter: true,
      render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: '处理状态',
      dataIndex: 'is_deal',
      key: 'is_deal',
      width: 120,
      fixed: 'right',
      render: text => (<span><Badge status={text === 2 ? 'success' : 'default'} />{dealStatus[text - 1]}</span>),
    }, {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => { this.handleAuditClick(record.return_id); }} >审核</a>
          <Divider type="vertical" />
          <a href={'#/returns/list/detail?orderId=' + record.return_id}>查看</a>
        </Fragment>
      ),
      width: 150,
      fixed: 'right',
    }];

    return (
      <PageHeaderLayout title="退货单列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <CustomizableTable
              onHandleOrderClick={this.handleModalToggle}
              rowKey="returns_sn"
              data={list}
              columns={columns}
              loading={loading}
              onChange={this.handleStandardTableChange}
              total={total}
              defaultPage={args.page}
            />
          </div>
        </Card>
        {/* 退货单审核面板 */}
        <Modal
          visible={isShowModal}
          title="审核面板"
          onCancel={() => { this.handleCancelModal(); }}
          onOk={() => { this.handleOkModal(); }}
        >
          <ReturnAuditContent
            bindFormObj={this.bindFormObj}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
