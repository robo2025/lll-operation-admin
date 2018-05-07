import React, { Component } from 'react';
import moment from 'moment';
import { Table, Row, Col } from 'antd';
import { connect } from 'dva';
import { SHIPPING_FEE_TYPE } from '../../constant/statusList';
import styles from './supply-infomation.less';


@connect(({ product, loading }) => ({
  product,
  loadding: loading.models.product,
}))
export default class SupplyInformation extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'idx',
        key: 'idx',
        render: (text, reocrd, idx) => (<span>{idx + 1}</span>),
      },
      {
        title: '供应商公司名称',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
      },
      {
        title: '商品ID',
        dataIndex: 'gno',
        key: 'gno',
      },
      {
        title: '销售单价（含税）',
        dataIndex: 'prices',
        key: 'price',
        render: val => (<span >{val.length > 0 ? `${val.slice(0)[0].price}-${val.slice(-1)[0].price}` : '无'}</span>),
      },
      {
        title: '运费',
        dataIndex: 'shipping_fee_type',
        align: 'shipping_fee_type',
        render: val => `${SHIPPING_FEE_TYPE[val]}`,
      },
      {
        title: '库存数量',
        dataIndex: 'stock',
        key: 'stock',
      },
    ];
  }

  render() {
    const { data, headerData, loading } = this.props;

    return (
      <div>
        <div style={{ marginBottom: 5 }}>
          <Row className={styles['product-info']}>
            <Col span={8}>所属分类：
              {
                headerData.product && `
                ${headerData.product.category.category_name}-
                ${headerData.product.category.children.category_name}-
                ${headerData.product.category.children.children.category_name}-
                ${headerData.product.category.children.children.children.category_name}`
              }
            </Col>
            <Col span={7} offset={1}>系列ID：{headerData.mno}</Col>
            <Col span={7} offset={1}>系列名称：{headerData.product && headerData.product.product_name}</Col>
            <Col span={8}>品牌：{headerData.product && headerData.product.brand.brand_name}</Col>
            <Col span={8}>产品型号ID：{headerData.mno}</Col>
            <Col span={8}>产品型号：{headerData.partnumber}</Col>
            <Col span={8}>创建人：{headerData.creator}</Col>
            <Col span={7} offset={1}>创建时间：{moment(headerData.created_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</Col>
          </Row>
        </div>
        <Table
          loading={loading}
          bordered
          dataSource={data}
          columns={this.columns}
          rowKey="gno"
        />
      </div>
    );
  }
}
