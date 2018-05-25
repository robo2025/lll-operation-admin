/*
 * @Author: lll 
 * @Date: 2018-03-09 14:56:55 
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-25 17:30:25
 */

import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Table, Divider, Row, Col, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import { queryString, handleServerMsg } from '../../utils/tools';
import { getAreaBycode } from '../../utils/cascader-address-options';

import styles from './OrderDetail.less';

const { Description } = DescriptionList;
const goodsData = [];// 订单商品数据
const logisticsData = [];
// 订单状态
const mapOrderStatus = ['全部', '待支付', '已取消', '已接单', '待发货', '已发货', '已确认收货', '已完成', '申请延期', '确认延期', '退款', '退货', '作废', '无货'];
// 支付状态
const mapPayStatus = ['全部', '未支付', '已支付'];

// 订单列
const goodsColumns = [{
  title: '商品编号',
  dataIndex: 'goods_sn',
  key: 'goods_sn',
}, {
  title: '商品名称',
  dataIndex: 'goods_name',
  key: 'goods_name',
}, {
  title: '型号',
  dataIndex: 'model',
  key: 'model',
}, {
  title: '发货日',
  dataIndex: 'max_delivery_time',
  key: 'max_delivery_time',
  render: text => (<span>{text}天</span>),
}, {
  title: '单价',
  dataIndex: 'univalent',
  key: 'univalent',
}, {
  title: '单价优惠',
  dataIndex: 'price_discount',
  key: 'price_discount',
}, {
  title: '商品售出单价',
  key: 'sold_price',
  render: text => (<span>{text.univalent - text.price_discount}</span>),
}, {
  title: '数量',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '商品小计',
  dataIndex: 'subtotal_money',
  key: 'subtotal_money',
}];
const operationTabList = [{
  key: 'tab1',
  tab: '订单操作记录',
}, {
  key: 'tab2',
  tab: '异常操作记录',
}];
const actionColumns = [{
  title: '操作记录',
  dataIndex: 'record',
  key: 'record',
}, {
  title: '操作员',
  dataIndex: 'guest_id',
  key: 'guest_id',
}, {
  title: '执行明细',
  dataIndex: 'execution_detail',
  key: 'execution_detail',
}, {
  title: '当前进度',
  dataIndex: 'progress',
  key: 'progress',
}, {
  title: '操作时间',
  dataIndex: 'add_time',
  key: 'add_time',
  render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD h:mm:ss')}</span>),
}, {
  title: '耗时',
  dataIndex: 'time_consuming',
  key: 'time_consuming',
  render: text => (<span>{text >> 0}s</span>),
}];


// 延期订单详情页
@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
export default class DelayOrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operationkey: 'tab1',
      args: queryString.parse(window.location.href),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'orders/fetchDetail',
      orderId: args.orderId,
      error: (res) => { message.error(handleServerMsg(res.msg)); },
    });
  }

  onOperationTabChange = (key) => {
    console.log(key);
    this.setState({ operationkey: key });
  }

  render() {
    const { orders, loading } = this.props;
    const orderDetail = orders.detail;
    let {
      order_info,
      guest_info,
      receipt_info,
      supplier_info,
      order_detail,
      delivery_info,
      operation } = orderDetail;
    order_info = order_info || {};
    guest_info = guest_info || {};
    receipt_info = receipt_info || {};
    supplier_info = supplier_info || {};
    order_detail = order_detail || {};
    delivery_info = delivery_info || {};
    operation = operation || [];
    const orderGoodsList = [order_detail];
    const exceptionAction = operation.filter((val) => {
      return val.is_abnormal;
    });

    // 计算商品数量，商品总金额，佣金，优惠抵扣，实付总金额
    let goodsTotal = 0;
    let goodAmount = 0;
    let commission = 0;
    let discountMoney = 0;
    let money = 0;
    orderGoodsList.forEach((val) => {
      goodsTotal += val.number;
      goodAmount += val.subtotal_money;
      commission += val.commission;
      discountMoney += val.price_discount;
      money += val.subtotal_money;
    });

    const contentList = {
      tab1: <Table
        pagination={{
          defaultPageSize: 6,
          pageSize: 6,
        }}
        loading={false}
        dataSource={operation}
        columns={actionColumns}
        rowKey="id"
      />,
      tab2: <Table
        pagination={{
          defaultPageSize: 5,
          pageSize: 5,
        }}
        loading={false}
        dataSource={exceptionAction}
        columns={actionColumns}
        rowKey="id"
      />,
    };
    const supplierAdress = getAreaBycode(supplier_info.profile ? supplier_info.profile.district_id.toString() : '130303').join('');


    return (
      <PageHeaderLayout title="延期订单详情">
        <Card bordered={false} className={styles['order-detail']} loading={loading}>
          <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }}>
            <Description term="客户订单编号">{order_info.order_sn}</Description>
            <Description term="支付状态">{mapPayStatus[order_info.pay_status]}</Description>
            <Description term="订单状态">{mapOrderStatus[order_info.order_status]}</Description>
            <Description term="母订单编号">3214321432</Description>
            <Description term="下单时间" >{moment(order_info.add_time * 1000).format('YYYY-MM-DD h:mm:ss')}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>延期商品明细</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={orderGoodsList}
            columns={goodsColumns}
            rowKey="id"
          />
          <div className={styles['extra-good-info']}>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14}>总计</Col>
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 45 }}>商品件数：{goodsTotal}</span>
                <span>商品总金额：<span className="number">￥{goodAmount}</span></span>
              </Col>
            </Row>
            <Row>
              <b>延期发货时间：</b><span style={{ fontWeight: 500 }}>{moment(order_info.due_time * 1000).format('YYYY-MM-DD')}</span>
            </Row>
            <Row>
              <b>延期说明：</b><span style={{ fontWeight: 500 }}>{order_info.remarks}</span>
            </Row>
          </div>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="客户信息" style={{ marginBottom: 32 }}>
            <Description term="用户姓名">{guest_info.receiver}</Description>
            <Description term="联系电话">{guest_info.mobile}</Description>
            <Description term="公司名称">{guest_info.company_name}</Description>
            <Description term="收货地址">{guest_info.address}</Description>
            <Description term="备注">{guest_info.remarks}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="开票信息" style={{ marginBottom: 32 }}>
            <Description term="公司全称">{receipt_info.title}</Description>
            <Description term="公司账户">{receipt_info.account}</Description>
            <Description term="税务编号">{receipt_info.tax_number}</Description>
            <Description term="公司电话">{receipt_info.telephone}</Description>
            <Description term="开户银行">{receipt_info.bank}</Description>
            <Description term="公司地址">{receipt_info.company_address}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="供应商信息" style={{ marginBottom: 32 }}>
            <Description term="联系人">{supplier_info.username}</Description>
            <Description term="联系电话">{supplier_info.mobile}</Description>
            <Description term="公司名称">{supplier_info.profile ? supplier_info.profile.company : ''}</Description>
            <Description term="收货地址">{supplierAdress}{supplier_info.profile ? supplier_info.profile.address : ''}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>订单商品明细</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={orderGoodsList}
            columns={goodsColumns}
            rowKey="id"
          />
          <div className={styles['extra-good-info']}>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14}>总计</Col>
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 45 }}>商品件数：{goodsTotal}</span>
                <span>商品总金额：<span className="number">￥{goodAmount}</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 45 }}>&nbsp;</span>
                <span>运费金额：<span className="number">￥0.00</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 45 }}>&nbsp;</span>
                <span>佣金：<span className="number">￥{commission}</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                {/* <span
                  style={{ marginRight: 45, fontWeight: 'normal' }}
                >
                  优惠券（YHQ20180103111256）满10元减1元
                </span> */}
                <span>优惠抵扣：<span className="number">￥-0.00</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 45 }}>&nbsp;</span>
                <span>实付总金额：<span style={{ color: '#E6382F' }} className="number">￥{money}</span></span>
              </Col>
            </Row>
          </div>
          {/* <Divider style={{ marginBottom: 32 }} />           */}
          <div className={styles.title}>操作日志记录</div>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            onTabChange={this.onOperationTabChange}
          >
            {contentList[this.state.operationkey]}
          </Card>
        </Card>
      </PageHeaderLayout>
    );
  }
}
