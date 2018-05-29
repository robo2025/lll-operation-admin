import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Table, Divider, Row, Col, Button, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import { queryString, handleServerMsg } from '../../utils/tools';
import { ORDER_STATUS, ACTION_STATUS } from '../../constant/statusList';
import { getAreaBycode } from '../../utils/cascader-address-options';

import styles from './OrderDetail.less';

const { Description } = DescriptionList;
const goodsData = [];// 订单商品数据
const logisticsData = [];
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
// 发货记录列
const logisticsColumns = [{
  title: '商品名称',
  dataIndex: 'goods_name',
  key: 'goods_name',
}, {
  title: '型号',
  dataIndex: 'model',
  key: 'model',
}, {
  title: '品牌',
  dataIndex: 'brand',
  key: 'brand',
}, {
  title: '数量',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '送货人',
  dataIndex: 'sender',
  key: 'sender',
  render: text => (<span>{text || '不可见'}</span>),  
}, {
  title: '联系号码',
  dataIndex: 'mobile',
  key: 'mobile',
  render: text => (<span>{text || '不可见'}</span>),
}, {
  title: '物流公司',
  dataIndex: 'logistics_company',
  key: 'logistics_company',
}, {
  title: '物流单号',
  dataIndex: 'logistics_number',
  key: 'logistics_number',
}, {
  title: '发货日期',
  dataIndex: 'date_of_delivery',
  key: 'date_of_delivery',
  render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD hh:mm:ss')}</span>),
}];
// 操作日志tab
const operationTabList = [{
  key: 'tab1',
  tab: '订单操作记录',
}, {
  key: 'tab2',
  tab: '异常操作记录',
}];
// 操作日志列
const actionColumns = [{
  title: '操作记录',
  dataIndex: 'record',
  key: 'record',
  render: text => (<span>{ACTION_STATUS[text]}</span>),
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
  render: text => (<span>{text}s</span>),
}];


@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
export default class OrderDetail extends Component {
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
    delivery_info = delivery_info || [];
    operation = operation || [];
    const orderGoodsList = [order_detail];
    const exceptionAction = operation.filter((val) => {
      return val.is_abnormal;
    });
    const deliveryInfo = delivery_info;
    const contentList = {
      tab1: <Table
        pagination={{
          defaultPageSize: 6,
          pageSize: 6,
        }}
        loading={false}
        dataSource={operation}
        columns={actionColumns}
        rowKey="add_time"
      />,
      tab2: <Table
        pagination={{
          defaultPageSize: 5,
          pageSize: 5,
        }}
        loading={false}
        dataSource={exceptionAction}
        columns={actionColumns}
        rowKey="add_time"
      />,
    };

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

    const supplierAdress = getAreaBycode(supplier_info.profile ? supplier_info.profile.district_id.toString() : '130303').join('');


    // console.log('订单详情', order_info);
    return (
      <PageHeaderLayout title="订单详情">
        <Card bordered={false} className={styles['order-detail']} loading={loading}>
          <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }}>
            <Description term="客户订单编号">{order_info.son_order_sn}</Description>
            <Description term="支付状态">{mapPayStatus[order_info.pay_status]}</Description>
            <Description term="订单状态">{ORDER_STATUS[order_info.order_status]}</Description>
            <Description term="母订单编号">{order_info.order_sn}</Description>
            <Description term="佣金服务费">{commission}元</Description>
            <Description term="下单时间" >{moment(order_info.add_time * 1000).format('YYYY-MM-DD h:mm:ss')}</Description>
          </DescriptionList>
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
            rowKey="abc"
          />
          <div className={styles['extra-good-info']}>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14}>总计</Col>
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 45 }}>商品件数：{orderGoodsList.length}</span>
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
                <span>佣金服务费：<span className="number">￥{commission}</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                {/* <span style={{ marginRight: 45, fontWeight: 'normal' }}>优惠券（YHQ20180103111256）满10元减0元</span> */}
                {/* <span>优惠抵扣：<span className="number">￥-0.00</span></span> */}
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
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="异常备注" style={{ marginBottom: 32 }}>
            <Description term="说明">{order_info.remarks || '无'}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />          
          <div className={styles.title}>发货记录</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={deliveryInfo}
            columns={logisticsColumns}
            rowKey="id"
            locale={{
              emptyText: '暂无物流信息',
            }}
          />
          {/* <Divider style={{ marginBottom: 32 }} /> */}
          <div className={styles.title}>操作日志记录</div>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            onTabChange={this.onOperationTabChange}
          >
            {contentList[this.state.operationkey]}
          </Card>
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={() => { this.props.history.goBack(); }}>返回列表</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
