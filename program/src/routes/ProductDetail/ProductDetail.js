import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductForm from '../../components/CustomeForm/ProductForm';
import { queryString } from '../../utils/tools';

import styles from './ProductDetail.less';


@connect(({ loading, product }) => ({
  product,
  loading,
}))
export default class GoodDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: queryString.parse(window.location.href),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取商品详情
    dispatch({
      type: 'product/fetchDetail',
      pno: args.pno,
    });
  }

  render() {
    const { product, loading } = this.props;
    return (
      <PageHeaderLayout title="产品详情" >
        <Card bordered={false} className={styles['new-good-wrap']}>
          <SectionHeader
            title="产品基础信息"
          />
          <ProductForm
            loading={loading.models.product}
            data={product.detail}
          />
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={() => { this.props.history.goBack(); }}>返回列表</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
