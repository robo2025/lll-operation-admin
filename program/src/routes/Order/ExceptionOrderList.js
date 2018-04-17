/*
 * @Author: lll 
 * @Date: 2018-03-08 14:51:15 
 * @Last Modified by: lll
 * @Last Modified time: 2018-04-17 13:56:54
 */
import React, { Component } from 'react';
import { Card, Button, Row, Col, Form, Input, Select, Icon, DatePicker, Modal, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ExceptionOrdersTable from '../../components/CustomTable/ExceptionOrdersTable';
import PushContent from '../../components/ModalContent/PushContent';
import RefundContent from '../../components/ModalContent/RefundContent';
import DelayOrderContent from '../../components/ModalContent/DelayOrderConten';
import RejectContent from '../../components/ModalContent/RejectContent';
import RejectDelayOrderContent from '../../components/ModalContent/RejectDelayOrderContent';
import { handleServerMsgObj } from '../../utils/tools';
import styles from './order-list.less';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
@Form.create()
export default class ExceptionOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      isShowModal1: false, // 推送Modal
      isShowModal2: false, // 延期并退款Modal
      isShowModal3: false, // 延期驳回Modal
      isShowModal4: false, // 同意延期Modal
      data: {}, // 当前列表被点击的产品数据
      refundOrderData: { // 无货同意并退款的数据结构
        responsible_party: '1',
        desc: '',
        is_pass: 1,
        status: 3,
      },
      rejectOrderData: { // 无货驳回的数据结构
        desc: '',
        is_pass: 0,
        status: 3,
      },
      delayOrderData: { // 延期订单数据
        due_time: '2018-3-29',
        desc: '',
        is_pass: 1,
        status: 2,
      },
      rejectDelayOrderData: { // 驳回延期数据
        responsible_party: '2',
        desc: '',
        is_pass: 0,
        status: 2,
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchExptionOrders',
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log('props', nextProps, nextState);
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  // 处理表单搜索
  handleSearch = (e) => {
    e.preventDefault();
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        start_time: fieldsValue.create_time ? fieldsValue.create_time[0].format('YYYY-MM-DD') : '',
        end_time: fieldsValue.create_time ? fieldsValue.create_time[1].format('YYYY-MM-DD') : '',
      };

      console.log('搜索字段', values);
      dispatch({
        type: 'orders/fetchSearch',
        data: values,
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
  handleModalToggle = (modalKey, orderId, data) => {
    console.log('toggleModal', modalKey, orderId, data);
    const { delayOrderData, rejectDelayOrderData } = this.state;
    const modalTempJson = {};
    modalTempJson['isShowModal' + modalKey] = true;
    this.setState({
      ...modalTempJson,
      orderId,
      data,
      delayOrderData: {
        ...delayOrderData,
        due_time: moment(data.due_time * 1000).format('YYYY-MM-DD'),
      },
      rejectDelayOrderData: {
        ...rejectDelayOrderData, responsible_party: data.responsible_party,
      },
    });
  }

  /**
   * 处理Modal的隐藏
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
    const { orderId, refundOrderData } = this.state;
    console.log('确定取消订单', modalKey, orderId, refundOrderData);
    const modalTempJson = {};
    modalTempJson['isShowModal' + modalKey] = false;

    if (modalKey === 2) { // 同意并退款Modal
      if (refundOrderData.desc) {
        this.setState({ ...modalTempJson });
        this.dispatchAgreeRefund();
      }
    } else if (modalKey === 3) { // 无货驳回
      this.setState({ ...modalTempJson });
      this.dispatchRejectRefund();
    } else if (modalKey === 4) { // 同意延期
      this.setState({ ...modalTempJson });
      this.dispatchAgreeDelay();
    } else if (modalKey === 5) { // 驳回延期
      this.setState({ ...modalTempJson });
      this.dispatchRejectDelay();
    }
  }

  // modal内容改变时处理
  handleModalContentChange = (content) => {
    console.log('modal conten change:', content);
  }

  // 同意并退款Modal改变时处理
  handleRefundModalContenChange = (content) => {
    const { refundOrderData } = this.state;
    this.setState({
      refundOrderData: { ...refundOrderData, ...content },
    });
  }

  // 同意延期Modal改变时处理
  handleAgreeDelayOrderContentChange = (content) => {
    const { delayOrderData } = this.state;
    this.setState({ delayOrderData: { ...delayOrderData, ...content } });
  }

  // 驳回延期Modal改变时处理
  handleRejectDelayOrderContentChange = (content) => {
    const { rejectDelayOrderData } = this.state;
    this.setState({ rejectDelayOrderData: { ...rejectDelayOrderData, ...content } });
  }

  // 无货驳回Modal改变时处理
  handleRejectModalContentChange = (content) => {
    const { rejectOrderData } = this.state;
    this.setState({
      rejectOrderData: { ...rejectOrderData, ...content },
    });
  }

  // dispatch:同意并退款
  dispatchAgreeRefund = () => {
    const { orderId, refundOrderData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchAgreeNoGood',
      orderId,
      data: refundOrderData,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // dispatch:无货驳回
  dispatchRejectRefund = () => {
    const { orderId, rejectOrderData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchRejectNoGood',
      orderId,
      data: rejectOrderData,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // dispatch:同意延期
  dispatchAgreeDelay = () => {
    const { orderId, delayOrderData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchAgreeDelay',
      orderId,
      data: delayOrderData,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // dispatch:驳回延期
  dispatchRejectDelay = () => {
    const { orderId, rejectDelayOrderData } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchRejectDelay',
      orderId,
      data: rejectDelayOrderData,
      success: () => { message.success('操作成功'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    dispatch({
      type: 'orders/fetchExptionOrders',
      offset: params.offset,
      limit: params.pageSize,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 64, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="客户订单编号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
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
          <Col xll={4} md={6} sm={24}>
            <FormItem label="异常状态标签">
              {getFieldDecorator('abnormal_type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">正常</Option>
                  <Option value="1">无货</Option>
                  <Option value="2">延期</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="处理状态标签">
              {getFieldDecorator('deal_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">已处理</Option>
                  <Option value="2">未处理</Option>
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
          <Col xll={4} md={6} sm={24}>
            <FormItem label="客户订单编号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
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
          <Col xll={4} md={6} sm={24}>
            <FormItem label="异常状态标签">
              {getFieldDecorator('order_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">正常</Option>
                  <Option value="1">无货</Option>
                  <Option value="2">延期</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="处理状态标签">
              {getFieldDecorator('deal_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">已处理</Option>
                  <Option value="2">未处理</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 64, lg: 64, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="供应商公司名称">
              {getFieldDecorator('suppier_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="客户公司名称">
              {getFieldDecorator(' guest_company_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="责任方">
              {getFieldDecorator('res_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">供应商</Option>
                  <Option value="2">客户</Option>
                  <Option value="3">平台</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="是否发货">
              {getFieldDecorator('is_delivery')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="2">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 64, lg: 64, xl: 48 }}>

          <Col xll={4} md={6} sm={24}>
            <FormItem label="是否接单">
              {getFieldDecorator('is_taking')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="2">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="下单时间">
              {getFieldDecorator('create_time')(
                <RangePicker onChange={this.onChange} />
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
    const {
      isShowModal1,
      isShowModal2,
      isShowModal3,
      isShowModal4,
      isShowModal5,
      data,
    } = this.state;
    const { orders, loading } = this.props;
    const { total } = orders;

    console.log('异常订单列表', this.state);

    return (
      <PageHeaderLayout title="异常订单列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false} className={styles['order-list-wrap']}>
          <div className={styles.tableList}>
            <ExceptionOrdersTable
              onHandleOrderClick={this.handleModalToggle}
              data={orders.exceptionList}
              loading={loading}
              onChange={this.handleStandardTableChange}
              total={total}
            />
            {/* 推送Modal */}
            <Modal
              visible={isShowModal1}
              title={<div>推送操作<small className="modal-tips">请确认相关说明内容后在推送至客户</small></div>}
              onCancel={() => { this.handleModalHidden(1); }}
            >
              <PushContent
                onChange={this.handleModalContentChange}
              />
            </Modal>
            {/* 无货同意并退款Modal */}
            <Modal
              visible={isShowModal2}
              title={<div>同意并退款<small className="modal-tips error">该操作确定后无法改回并自动生成退款单，请慎重操作！</small></div>}
              onCancel={() => { this.handleModalHidden(2); }}
              onOk={() => { this.handleModalConfirm(2); }}

            >
              <RefundContent
                data={data}
                onChange={this.handleRefundModalContenChange}
              />
            </Modal>
            {/* 无货驳回Modal */}
            <Modal
              visible={isShowModal3}
              title="无货驳回"
              onCancel={() => { this.handleModalHidden(3); }}
              onOk={() => { this.handleModalConfirm(3); }}
            >
              <RejectContent
                data={data}
                onChange={this.handleRejectModalContentChange}
              />
            </Modal>
            {/* 同意延期Modal */}
            <Modal
              visible={isShowModal4}
              title="同意延期操作"
              onCancel={() => { this.handleModalHidden(4); }}
              onOk={() => { this.handleModalConfirm(4); }}
            >
              <DelayOrderContent
                data={data}
                onChange={this.handleAgreeDelayOrderContentChange}
              />
            </Modal>
            {/* 驳回延期 */}
            <Modal
              visible={isShowModal5}
              title="延期订单取消"
              onCancel={() => { this.handleModalHidden(5); }}
              onOk={() => { this.handleModalConfirm(5); }}
            >
              <RejectDelayOrderContent
                data={data}
                onChange={this.handleRejectDelayOrderContentChange}
              />
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
