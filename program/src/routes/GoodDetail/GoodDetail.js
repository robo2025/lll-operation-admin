/*
 * @Author: lll
 * @Date: 2018-01-31 15:37:34
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-24 18:45:15
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodInfo from '../../components/Form//GoodInfo';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import { actionsLog, actionsLog2, actionsLog3 } from './action-log';
import { queryString } from '../../utils/tools';
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

// 操作记录列
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

// 商品详情页
@connect(({ good, loading }) => ({
  good,
  loading: loading.models.good,
})
)
class GoodDetail extends Component {
  constructor(props) {
    super(props);
    this.getSupplierInfo = this.getSupplierInfo.bind(this);
    this.handleProductAttr = this.handleProductAttr.bind(this);
    this.state = {
      operationkey: 'tab1',
      args: queryString.parse(this.props.location.search),
      fields: {},
    };
  }

  componentDidMount() {
    console.log(this.state);
    const { dispatch } = this.props;
    dispatch({
      type: 'good/fetchDetail',
      goodId: this.state.args.goodId,
      // callback: this.getSupplierInfo,
    });
  }


  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }

  // 获取供应商信息
  getSupplierInfo(supplierid) {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchSupplierInfo',
      supplierid,
    });
  }

  // 当表单输入框被修改事件
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  }

  /**
   * 当产品其他属性被修改事件[产品概述、详情、FAQ,其他属性，图片]
   * 
   * @param {object} obj json对象，产品属性key=>value
   * 
   */
  handleProductAttr(obj) {
    this.setState({
      fields: { ...this.state.fields, ...obj },
    });
  }

  render() {
    console.log('detail state:', this.state);
    const { good, loading } = this.props;
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
        <Card className={styles['good-detail-wrap']} loading={loading}>
          <GoodInfo
            data={{ ...good.detail, ...this.state.fields }}
            onChange={this.handleFormChange}
            loading={loading}
            onAttrChange={this.handleProductAttr}
          />
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
