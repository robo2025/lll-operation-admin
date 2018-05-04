import React, { Component } from 'react';
import moment from 'moment';
import { Table, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './supply-infomation.less';

const shippingFee = ['包邮', '货到付款'];

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
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '供应商名称',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
      },
      {
        title: '商品ID',
        dataIndex: 'gno',
        key: 'gno',
      },
      {
        title: '价格（含税）',
        dataIndex: 'prices',
        render: val => (<span >{val[0].price}</span>),
        key: 'price',
      },
      {
        title: '运费',
        dataIndex: 'shipping_fee_type',
        align: 'shipping_fee_type',
        render: val => `${shippingFee[val - 1]}`,
      },
      {
        title: '库存数量',
        dataIndex: 'stock',
        key: 'stock',
      },
    ];
  }
  render() {
    const { product, loadding, headerData } = this.props;


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
        {/* <Table
          loading={loadding}
          bordered
          dataSource={product.supplierList}
          columns={this.columns}
          rowKey={record => (`${record.pno}-${record.id}`)}
        /> */}
      </div>
    );
  }
}
