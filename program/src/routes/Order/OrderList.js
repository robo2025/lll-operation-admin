import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Row, Col, Form, Input, Select, Icon, DatePicker, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OrderTable from '../../components/CustomTable/OrderTable';
import ReminderContent from '../../components/ModalContent/ReminderContent';
import CancelOrderContent from '../../components/ModalContent/CancelOrderContent';
import DelayOrderContent from '../../components/ModalContent/DelayOrderConten';
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
    };
  }

  componentDidMount() {
    console.log('我渲染好了', this.props);
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetch',
    });
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
  handleModalToggle = (modalKey, orderId) => {
    console.log('toggleModal', modalKey, orderId);
    const modalTempJson = {};
    modalTempJson['isShowModal' + modalKey] = true;
    this.setState({ ...modalTempJson, orderId });
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

  // modal内容改变时处理
  handleModalContentChange = (content) => {
    console.log('modal conten change:', content);
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 64, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="客户订单编号">
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
            <FormItem label="客户订单编号">
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
    const { isShowModal1, isShowModal2, isShowModal3 } = this.state;
    const { orders, loading } = this.props;
    console.log(this.props.orders);

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
              data={orders.list}
              loading={loading}
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
            >
              <CancelOrderContent
                onChange={this.handleModalContentChange}

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
