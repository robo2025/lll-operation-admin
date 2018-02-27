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
    console.log('供货信息组件props', this.props);
    const { product, loadding, productId } = this.props;
    const currProduct = product.list.filter(val => (
      val.id === productId
    ));
    console.log('供货信息组件props', this.props, currProduct);

    return (
      <div>
        <div style={{ marginBottom: 5 }}>
          <Row className={styles['product-info']}>
            <Col span={7} offset={1}>产品名称：{currProduct[0].product_name}</Col>
            <Col span={8}>型号：{currProduct[0].partnumber}</Col>
            <Col span={8}>品牌：{currProduct[0].brand_name}</Col>
            <Col span={7} offset={1}>产品ID：{currProduct[0].id}</Col>
            <Col span={8}>所属分类：
              {`
              ${currProduct[0].category.category_name}-${currProduct[0].category.children.category_name}
              ${currProduct[0].category.children.children.category_name}-${currProduct[0].category.children.children.children.category_name}
              `
              }
            </Col>
            <Col span={8}>创建人：{currProduct[0].staff_name}</Col>
            <Col span={7} offset={1}>创建时间：{moment(currProduct[0].created_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</Col>
          </Row>
        </div>
        <Table
          loading={loadding}
          bordered
          dataSource={product.supplierList}
          columns={this.columns}
          rowKey={record => (`${record.pno}-${record.id}`)}
        />
      </div>
    );
  }
}
