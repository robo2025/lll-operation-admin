import React, { Component } from 'react';
import { Card, Badge, Table, Divider, Row, Col } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';

import styles from './OrderDetail.less';

const { Description } = DescriptionList;
const goodsData = [];// 订单商品数据
const logisticsData = [];
// 订单列
const goodsColumns = [{
  title: '商品编号',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '商品名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '型号',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '发货日',
  dataIndex: 'delivery',
  key: 'delivery',
}, {
  title: '单价',
  dataIndex: 'price',
  key: 'price',
}, {
  title: '单价优惠',
  dataIndex: 'yh',
  key: 'yh',
}, {
  title: '商品售出单价',
  dataIndex: 'price2',
  key: 'price2',
}, {
  title: '数量',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '商品小计',
  dataIndex: 'amount',
  key: 'amount',
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
for (let i = 0; i < 3; i++) { // 生成订单商品假数据
  goodsData.push({
    id: i + 1,
    name: '测试' + i,
    type: '测试' + i,
    price: 10,
    num: 5,
    delivery: '当天',
    yh: 0,
    price2: 10,
    amount: 50,
  });
}
for (let i = 0; i < 3; i++) { // 生成订单商品假数据
  logisticsData.push({
    id: i + 1,
    goodName: '压轧滚珠丝杠　轴径28·32、螺距6·10·32 标准螺帽' + i,
    type: '测试' + i,
    brand: '欧姆龙',
    num: 5,
    delivery: '2017-12-7 11:45:30',
    delivery_man: '王麻子',
    mobile: '13574488306',
    delivery_company: '恒运货运',
    delivery_id: 'HYWL12345789',
  });
}
const operationTabList = [{
  key: 'tab1',
  tab: '订单操作记录',
}, {
  key: 'tab2',
  tab: '异常操作记录',
}];
const actionColumns = [{
  title: '操作记录',
  dataIndex: 'desc',
  key: 'desc',
}, {
  title: '操作员',
  dataIndex: 'operater',
  key: 'operater',
}, {
  title: '执行明细',
  dataIndex: 'detail',
  key: 'detail',
}, {
  title: '当前进度',
  dataIndex: 'progress',
  key: 'progress',
}, {
  title: '操作时间',
  dataIndex: 'create_time',
  key: 'create_time',
}, {
  title: '耗时',
  dataIndex: 'time',
  key: 'time',
}];
const actionLogs = [{
  id: 1,
  desc: '提交订单',
  operater: 'admin',
  detail: '未支付',
  progress: '已支付',
  create_time: '2017-10-12 12:56:30',
  time: 5,
}];

export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operationkey: 'tab1',
    };
  }

  onOperationTabChange = (key) => {
    console.log(key);
    this.setState({ operationkey: key });
  }

  render() {
    const contentList = {
      tab1: <Table
        pagination={{
          defaultPageSize: 6,
          pageSize: 6,
        }}
        loading={false}
        dataSource={actionLogs}
        columns={actionColumns}
        rowKey="id"
      />,
      tab2: <Table
        pagination={{
          defaultPageSize: 5,
          pageSize: 5,
        }}
        loading={false}
        dataSource={actionLogs}
        columns={actionColumns}
        rowKey="id"        
      />,
    };
    return (
      <PageHeaderLayout title="订单详情">
        <Card bordered={false} className={styles['order-detail']}>
          <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }}>
            <Description term="客户订单编号">1000000000</Description>
            <Description term="支付状态">已支付</Description>
            <Description term="订单状态">已完成</Description>
            <Description term="母订单编号">3214321432</Description>
            <Description term="下单时间" >2016-09-21  08:50:08</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="客户信息" style={{ marginBottom: 32 }}>
            <Description term="用户姓名">付小小</Description>
            <Description term="联系电话">18100000000</Description>
            <Description term="公司名称">菜鸟仓储</Description>
            <Description term="收货地址">浙江省杭州市西湖区万塘路18号</Description>
            <Description term="备注">无</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="开票信息" style={{ marginBottom: 32 }}>
            <Description term="公司全称">长沙君正合企业管理有限公司</Description>
            <Description term="公司账户">18100000000</Description>
            <Description term="税务编号">菜鸟仓储</Description>
            <Description term="公司电话">0731-87257485</Description>
            <Description term="开户银行">中国建设银行股份有限公司长沙南湖路支行</Description>
            <Description term="公司地址">长沙市开福区新河街道晴岚路68号北辰凤凰天阶</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="供应商信息" style={{ marginBottom: 32 }}>
            <Description term="联系人">付小小</Description>
            <Description term="联系电话">18100000000</Description>
            <Description term="公司名称">菜鸟仓储</Description>
            <Description term="收货地址">浙江省杭州市西湖区万塘路18号</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>订单商品明细</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={goodsData}
            columns={goodsColumns}
            rowKey="id"
          />
          <div className={styles['extra-good-info']}>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14}>总计</Col>
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                  <span style={{ marginRight: 45 }}>商品件数：15</span>
                  <span>商品总金额：<span className="number">￥150.00</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                  <span style={{ marginRight: 45 }}>&nbsp;</span>
                  <span>运费金额：<span className="number">￥10.00</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                  <span style={{ marginRight: 45 }}>&nbsp;</span>
                  <span>佣金：<span className="number">￥10.00</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                  <span style={{ marginRight: 45, fontWeight: 'normal' }}>优惠券（YHQ20180103111256）满10元减1元</span>
                  <span>优惠抵扣：<span className="number">￥-1.00</span></span>
              </Col>
            </Row>
            <Row gutter={8} justify="end" align="end" type="flex">
              <Col span={14} />
              <Col span={10} pull={2} style={{ textAlign: 'right' }}>
                  <span style={{ marginRight: 45 }}>&nbsp;</span>
                  <span>实付总金额：<span style={{ color: 'red' }} className="number">￥149.00</span></span>
              </Col>
            </Row>
          </div>
          <Divider style={{ marginBottom: 32 }} />          
          <div className={styles.title}>发货记录</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={false}
            dataSource={logisticsData}
            columns={logisticsColumns}
            rowKey="id"
          />
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
