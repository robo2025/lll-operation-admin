import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Table, Divider, Row, Col, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import { ACTION_STATUS } from '../../constant/statusList';
import { queryString, handleServerMsg } from '../../utils/tools';
import styles from './OrderDetail.less';

const { Description } = DescriptionList;
// 处理状态
const DEAL_STATUS = ['未处理', '已处理'];

// 订单列
const goodsColumns = [{
  title: '商品ID编号',
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
  title: '品牌',
  dataIndex: 'brand',
  key: 'brand',
}, {
  title: '数量',
  dataIndex: 'number',
  key: 'number',
}, {
  title: '单价(元)',
  dataIndex: 'univalent',
  key: 'univalent',
}, {
  title: '单价优惠',
  dataIndex: 'price_discount',
  key: 'price_discount',
}, {
  title: '商品销售售单价',
  dataIndex: 'sale_price',
  key: 'sale_price',
}];
// 发货记录列
const logisticsColumns = [{
  title: '商品名称',
  dataIndex: 'goodName',
  key: 'goodName',
}, {
  title: '型号',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '品牌',
  dataIndex: 'brand',
  key: 'brand',
}, {
  title: '数量',
  dataIndex: 'count',
  key: 'count',
}, {
  title: '发货日期',
  dataIndex: 'delivery',
  key: 'delivery',
}, {
  title: '送货人',
  dataIndex: 'delivery_man',
  key: 'delivery_man',
}, {
  title: '联系号码',
  dataIndex: 'mobile',
  key: 'mobile',
}, {
  title: '物流公司',
  dataIndex: 'delivery_company',
  key: 'delivery_company',
}, {
  title: '物流单号',
  dataIndex: 'delivery_id',
  key: 'delivery_id',
}];
// 操作日志列
const actionColumns = [{
  title: '操作记录',
  dataIndex: 'status',
  key: 'status',
  render: text => (<span>{ACTION_STATUS[text - 1]}</span>),
}, {
  title: '操作员',
  dataIndex: 'operator',
  key: 'operator',
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
}];

@connect(({ returns, orders, loading }) => ({
  returns,
  orders,
  loading: loading.models.orders,
}))
export default class ReturnsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: queryString.parse(window.location.href),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'returns/fetchDetail',
      returnId: args.orderId,
      error: (res) => { message.error(handleServerMsg(res.msg)); },
    });
  }

  render() {
    const { returns, loading } = this.props;
    const orderDetail = returns.detail;
    const {
      order_info,
      guest_info,
      receipt_info,
      supplier_info,
      order_detail,
      delivery_info,
      return_info,
      return_logistics,
      operation_record } = orderDetail;

    const orderInfo = order_info || {};
    const supplierInfo = supplier_info || {};
    const guestInfo = guest_info || {};
    const returnInfo = return_info || {};
    const orderGoodsList = [order_detail];
    const operationRecord = operation_record || [];
    const returnLogistics = return_logistics || {};
    const exceptionAction = operationRecord.filter((val) => {
      return val.is_abnormal;
    });

    return (
      <PageHeaderLayout title="退货单详情">
        <Card bordered={false} className={styles['order-detail']} loading={loading}>
          <DescriptionList size="large" title="退货申请" style={{ marginBottom: 32 }}>
            <Description term="退货单编号">{returnInfo.return_sn}</Description>
            <Description term="处理状态">{DEAL_STATUS[returnInfo.is_deal]}</Description>
            <Description term="源订单编号">{returnInfo.order_sn}(客户订单号)</Description>
            <Description term="退货申请时间" >{moment(returnInfo.add_time * 1000).format('YYYY-MM-DD h:mm:ss')}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="客户信息" style={{ marginBottom: 32 }}>
            <Description term="公司名称">{guestInfo.guest_company_name}</Description>
            <Description term="联系人">{guestInfo.receiver}</Description>
            <Description term="联系电话">{guestInfo.mobile}</Description>
            <Description term="收货地址">{guestInfo.address}</Description>
            <Description term="退货说明">{guestInfo.return_desc}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="供应商信息" style={{ marginBottom: 32 }}>
            <Description term="公司名称">{supplierInfo.company}</Description>
            <Description term="公司法人">{supplierInfo.contactname}</Description>
            <Description term="公司类型">{supplierInfo.nature}</Description>
            <Description term="联系人">{supplierInfo.contactname}</Description>
            <Description term="联系号码">{supplierInfo.mobile}</Description>
            <Description term="收货地址">{supplierInfo.shipping_address}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>退货商品</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={[orderInfo]}
            columns={goodsColumns}
            rowKey="abc"
          />
          <div className={styles['extra-good-info']}>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14}>总计</Col>
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                <span style={{ marginRight: 45 }}>商品件数：{orderGoodsList.length}</span>
                <span style={{ marginRight: 45 }}>配送：包邮</span>
                <span>商品总金额：<span className="number money">￥{orderInfo.subtotal_money}</span></span>
              </Col>
            </Row>
          </div>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="物流记录" style={{ marginBottom: 32 }}>
            <Description term="物流公司名称">{returnLogistics.logistics_company}</Description>
            <Description term="物流单号">{returnLogistics.logistics_number}</Description>
          </DescriptionList>
          {/* <Divider style={{ marginBottom: 32 }} />           */}
          <div className={styles.title}>操作日志记录</div>
          <Card
            className={styles.tabsCard}
            bordered={false}
          >
            <Table
              pagination={{
                defaultPageSize: 6,
                pageSize: 6,
              }}
              loading={false}
              dataSource={operationRecord}
              columns={actionColumns}
              rowKey="add_time"
            />
          </Card>
        </Card>
      </PageHeaderLayout>
    );
  }
}
