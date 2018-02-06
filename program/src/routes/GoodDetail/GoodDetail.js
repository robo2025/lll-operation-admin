/*
 * @Author: lll
 * @Date: 2018-01-31 15:37:34
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-02 09:33:09
 */
import React, { Component } from 'react';
import moment from 'moment';
import { Card, Table, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodInfo from '../../components/Form//GoodInfo';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import goodInfo from './good-info.json';
import { actionsLog, actionsLog2, actionsLog3 } from './action-log';

import styles from './good-detail.less';

const operationTabList = [{
  key: 'tab1',
  tab: '操作日志一',
}, {
  key: 'tab2',
  tab: '操作日志二',
}, {
  key: 'tab3',
  tab: '操作日志三',
}];

const mapStatus = ['失败', '成功'];

const columns = [{
  title: '操作类型',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '操作员',
  dataIndex: 'operator',
  key: 'operator',
}, {
  title: '执行结果',
  dataIndex: 'status',
  key: 'status',
  render: (text, record) => (<span>{`${mapStatus[record.status]}`}</span>),
}, {
  title: '操作时间',
  dataIndex: 'createdAt',
  key: 'createdAt',
  render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
}, {
  title: '耗时',
  dataIndex: 'elapsed',
  key: 'elapsed',
  render: (text, record) => (<span>{`${record.elapsed}s`}</span>),
}];

class GoodDetail extends Component {
  state = {
    operationkey: 'tab1',
  }
  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  render() {
    console.log('---', actionsLog);
    const contentList = {
      tab1: <Table
        pagination={false}
        loading={false}
        dataSource={actionsLog}
        columns={columns}
      />,
      tab2: <Table
        pagination={false}
        loading={false}
        dataSource={actionsLog2}
        columns={columns}
      />,
      tab3: <Table
        pagination={false}
        loading={false}
        dataSource={actionsLog3}
        columns={columns}
      />,
    };
    return (
      <PageHeaderLayout title="商品详情审核页">
        <Card className={styles['good-detail-wrap']}>
          <GoodInfo data={goodInfo} />
          <SectionHeader title="操作记录" />
        </Card>
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[this.state.operationkey]}

          <Button style={{ margin: '30px 0 20px 45%' }} onClick={() => { window.history.back(); }}>返回</Button>

        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GoodDetail;
