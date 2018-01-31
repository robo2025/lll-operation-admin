/*
 * @Author: lll 
 * @Date: 2018-01-31 15:37:34 
 * @Last Modified by: lll
 * @Last Modified time: 2018-01-31 17:48:31
 */
import React, { Component } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodInfo from '../../components/Form//GoodInfo';
import goodInfo from './good-info.json';

import styles from './good-detail.less';


class GoodDetail extends Component {
  render() {
    return (
      <PageHeaderLayout title="商品详情审核页">
        <Card className={styles['good-detail-wrap']}>
          <h2>商品基础信息</h2>
          <GoodInfo data={goodInfo} />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GoodDetail;
