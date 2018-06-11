/*
 * @Author: lll 
 * @Date: 2018-03-08 14:51:15 
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-28 14:52:14
 */
import React, { Component } from 'react';
import { Card, Button, Row, Col, Form, Input, Select, Icon, DatePicker, Modal, message } from 'antd';
import { connect } from 'dva';
import qs from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ExceptionOrdersTable from '../../components/CustomTable/ExceptionOrdersTable';
import PushContent from '../../components/ModalContent/PushContent';
import RefundContent from '../../components/ModalContent/RefundContent';
import DelayOrderContent from '../../components/ModalContent/DelayOrderConten';
import RejectContent from '../../components/ModalContent/RejectContent';
import RejectDelayOrderContent from '../../components/ModalContent/RejectDelayOrderContent';
import { handleServerMsgObj } from '../../utils/tools';
import { PAGE_SIZE } from '../../constant/config';
import styles from './order-list.less';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
// 操作类型数据
const ACTIONS_DATA = {
  2: {
    title: <div>同意并退款<small className="modal-tips error">该操作确定后无法改回并自动生成退款单，请慎重操作！</small></div>,
    component: RefundContent,
  },
  3: {
    title: '无货驳回',
    component: RejectContent,
  },
  4: {
    title: '同意延期操作',
    component: DelayOrderContent,
  },
  5: {
    title: '延期订单取消',
    component: RejectDelayOrderContent,
  },
};

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
      isShowModal: false,
      isShowModal1: false, // 推送Modal
      data: {}, // 当前列表被点击的产品数据
      modalKey: 2,
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'orders/fetchExptionOrders',
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
        is_type: 1,
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


  // 绑定审核弹出层form对象
  bindFormObj = (formObj) => {
    this.$FormObj = formObj;
  }

  /**
   * 处理Modal的显示
   * @param {string} modalKey Modal的key
   * @param {string} orderId  订单ID
   */
  handleModalToggle = (modalKey, orderId, data) => {
    console.log('toggleModal', modalKey, orderId, data);
    this.setState({
      // ...modalTempJson,
      modalKey,
      isShowModal: true,
      orderId,
      data,
    });
  }

  // 确定模态框
  handleModalOk = () => {
    const that = this;
    let { modalKey } = this.state;
    this.$FormObj.validateFields((err, values) => {
      modalKey = parseInt(modalKey, 10);
      if (!err) {
        that.setState({
          isShowModal: false,
        });
        console.log('表单数据', values);
        if (modalKey === 2) { // 同意并退款Modal
          that.dispatchAgreeRefund(values);
        } else if (modalKey === 3) { // 无货驳回
          that.dispatchRejectRefund(values);
        } else if (modalKey === 4) { // 同意延期
          that.dispatchAgreeDelay({ ...values, due_time: values.due_time.format('YYYY-MM-DD') });
        } else if (modalKey === 5) { // 驳回延期
          that.dispatchRejectDelay(values);
        }
      } else {
        console.log('校验出错', err);
      }
    });
  }

  // 取消模态框
  handleModalCancel = () => {
    this.setState({ isShowModal: false });
  }

  // dispatch:同意并退款
  dispatchAgreeRefund = (data) => {
    const { orderId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchAgreeNoGood',
      orderId,
      data,
      success: () => {
        message.success('操作成功');
        const args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        dispatch({
          type: 'orders/fetchExptionOrders',
          offset: (args.page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        });
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // dispatch:无货驳回
  dispatchRejectRefund = (data) => {
    const { orderId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchRejectNoGood',
      orderId,
      data,
      success: () => {
        message.success('操作成功');
        const args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        dispatch({
          type: 'orders/fetchExptionOrders',
          offset: (args.page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        });
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // dispatch:同意延期
  dispatchAgreeDelay = (data) => {
    const { orderId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchAgreeDelay',
      orderId,
      data,
      success: () => {
        message.success('操作成功');
        const args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        dispatch({
          type: 'orders/fetchExptionOrders',
          offset: (args.page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        });
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // dispatch:驳回延期
  dispatchRejectDelay = (data) => {
    const { orderId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetchRejectDelay',
      orderId,
      data,
      success: () => {
        message.success('操作成功');
        const args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        dispatch({
          type: 'orders/fetchExptionOrders',
          offset: (args.page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        });
      },
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
            <FormItem label="商品订单号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="支付状态">
              {getFieldDecorator('pay_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="2">已支付</Option>
                  <Option value="1">未支付</Option>
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
            <FormItem label="商品订单号">
              {getFieldDecorator('guest_order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="支付状态">
              {getFieldDecorator('pay_status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="2">已支付</Option>
                  <Option value="1">未支付</Option>
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
            <FormItem label="订单号">
              {getFieldDecorator('order_sn')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
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
        </Row>
        <Row gutter={{ md: 64, lg: 64, xl: 48 }}>
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
      isShowModal,
      isShowModal1,
      modalKey,
      data,
    } = this.state;
    const { orders, loading } = this.props;
    const { total } = orders;
    const ModalComponent = ACTIONS_DATA[modalKey].component;

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
            <Modal
              visible={isShowModal}
              title={ACTIONS_DATA[modalKey].title}
              onCancel={this.handleModalCancel}
              onOk={this.handleModalOk}
            >
              <ModalComponent
                data={data}
                bindFormObj={this.bindFormObj}
              />
            </Modal>
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
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
