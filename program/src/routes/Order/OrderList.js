import React, { Component } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import { Card, Button, Row, Col, Form, Input, Select, Icon, DatePicker, Modal, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OrderTable from '../../components/CustomTable/OrderTable';
import ReminderContent from '../../components/ModalContent/ReminderContent';
import CancelOrderContent from '../../components/ModalContent/CancelOrderContent';
import DelayOrderContent from '../../components/ModalContent/DelayOrderConten';
import { handleServerMsgObj } from '../../utils/tools';
import { PAGE_SIZE } from '../../constant/config';
import styles from './order-list.less';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
@Form.create()
export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      isShowModal1: false, // 催货Modal
      isShowModal2: false, // 订单取消Modal
      isShowModal3: false, // 收货延迟Modal
      cancelOrderData: {// 取消订单的数据结构
        responsible_party: '1',
        cancel_desc: '',
      },
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;    
    dispatch({
      type: 'orders/fetch',
      offset: (args.page - 1) * PAGE_SIZE,
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
        type: 'orders/fetchSearch',
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

  /**
   * 处理Modal的显示
   * @param {string} modalKey Modal的key
   * @param {string} orderId  订单ID
   */
  handleModalToggle = (modalKey, orderId) => {
    const modalTempJson = {};
    modalTempJson['isShowModal' + modalKey] = true;
    this.setState({ ...modalTempJson, orderId });
  }

  /**
   * 取消：Modal的隐藏
   * @param {string} modalKey Modal的key
   * @param {string} orderId  订单ID
   */
  handleModalHidden = (modalKey) => {
    const modalTempJson = {};
    modalTempJson['isShowModal' + modalKey] = false;
    this.setState({ ...modalTempJson });
  }

  /**
   * 确定：Modal关闭,提交表单
   */
  handleModalConfirm = (modalKey) => {
    const { orderId, cancelOrderData } = this.state;
    const modalTempJson = {};
    modalTempJson['isShowModal' + modalKey] = false;
   
    if (modalKey === 2) { // 取消订单
      if (cancelOrderData.cancel_desc) {
        this.setState({ ...modalTempJson });
        this.dispatchCancelOrder();
      }
    }
  }

  // 取消订单Modal内容改变时处理
  handleCancelOrderContentChange = (content) => {
    console.log('取消订单Modal:', content);
    this.setState({ cancelOrderData: content });
  }

  // dispatch:取消订单
  dispatchCancelOrder = () => {
    const { orderId, cancelOrderData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchCancel',
      orderId,
      data: cancelOrderData,
      success: () => { 
        message.success('取消订单成功'); 
        const args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });        
        dispatch({
          type: 'orders/fetch',
          offset: (args.page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        });
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, history } = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    
    // 分页：将页数提取到url上
    history.push({
      pathname: '/orders/list',
      search: `?page=${params.currentPage}`,
    });

    dispatch({
      type: 'orders/fetch',      
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
            <FormItem label="商品订单号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="支付状态">
              {getFieldDecorator('pay_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">已支付</Option>
                  <Option value="2">未支付</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">待支付</Option>
                  <Option value="2">取消订单</Option>
                  <Option value="3">待结单</Option>
                  <Option value="4">待发货</Option>
                  <Option value="5">已发货,配送中</Option>
                  <Option value="6">已完成</Option>
                  <Option value="8">申请延期中</Option>
                  <Option value="10">退款中</Option>
                  <Option value="11">退货中</Option>
                  <Option value="12">作废</Option>
                  <Option value="13">无货</Option>
                  <Option value="14">退款完成</Option>
                  <Option value="15">退货完成</Option>
                  <Option value="16">订单流转结束</Option>
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
            <FormItem label="商品订单号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="支付状态">
              {getFieldDecorator('pay_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">已支付</Option>
                  <Option value="2">未支付</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">待接单</Option>
                  <Option value="2">已接单</Option>
                  <Option value="3">已部分发货</Option>
                  <Option value="4">已全部发货</Option>
                  <Option value="5">已完成</Option>
                  <Option value="6">已确认收货</Option>
                  <Option value="7">已全部发货</Option>
                  <Option value="8">上架申请延期</Option>
                  <Option value="9">客户允许延期</Option>
                  <Option value="10">客户已取消</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 64, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="供应商公司名称">
              {getFieldDecorator('supplier_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="客户公司名称">
              {getFieldDecorator('guest_company_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="下单时间">
              {getFieldDecorator('create_time')(
                <RangePicker format="YYYY-MM-DD" onChange={this.onChange} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
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
    const { isShowModal1, isShowModal2, isShowModal3, cancelOrderData, args } = this.state;
    const { orders, loading } = this.props;
    const { total, list } = orders;

    return (
      <PageHeaderLayout title="订单列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <OrderTable
              onHandleOrderClick={this.handleModalToggle}
              data={list}
              loading={loading}
              onChange={this.handleStandardTableChange}
              total={total}
              defaultPage={args.page || 1}              
            />
            {/* 催货Modal */}
            <Modal
              visible={isShowModal1}
              title="催单操作"
              onCancel={() => { this.handleModalHidden(1); }}
            >
              <ReminderContent
                onChange={this.handleModalContentChange}
              />
            </Modal>
            {/* 订单取消Modal */}
            <Modal
              visible={isShowModal2}
              title="取消订单"
              onCancel={() => { this.handleModalHidden(2); }}
              onOk={() => { this.handleModalConfirm(2); }}
            >
              <CancelOrderContent
                data={cancelOrderData}
                onChange={this.handleCancelOrderContentChange}
              />
            </Modal>
            {/* 收货延迟Modal */}
            <Modal
              visible={isShowModal3}
              title="收货延迟"
              onCancel={() => { this.handleModalHidden(3); }}
            >
              <DelayOrderContent
                onChange={this.handleModalContentChange}
              />
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
