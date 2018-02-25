/*
 * @Author: lll
 * @Date: 2018-01-31 15:37:34
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-25 22:02:51
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Button, Radio, Input, Tooltip, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodInfo from '../../components/Form//GoodInfo';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import { actionsLog, actionsLog2, actionsLog3 } from './action-log';
import { queryString } from '../../utils/tools';
import styles from './good-detail.less';

const RadioGroup = Radio.Group;
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
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleAuditDesc = this.handleAuditDesc.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      operationkey: 'tab1',
      args: queryString.parse(this.props.location.search),
      fields: {},
      audit_status: 1, // 审核状态
      audit_desc: '', // 审批意见
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch({
      type: 'good/fetchDetail',
      goodId: this.state.args.goodId,
      callback: (res) => { 
        console.log('毁掉函数', res);
        const { shelf_life, sales_unit, stock, min_buy, audit_status, audit_desc, shipping_fee_type } = res;
        // 获取供应商信息
        // this.getSupplierInfo(res.supplier_id); 
        this.setState({ fields: {
          shelf_life, // 质保期
          sales_unit, // 销售单位
          stock, // 库存
          min_buy, // 最小采购量
          audit_status, // 审核状态 (1:审核通过 2:审核不通过)
          audit_desc, // 审核说明 (审核不通过需要填写)
          shipping_fee_type, // 运费类型
        } });
      },
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

  // 处理审批意见的单选框按钮
  handleRadioChange(e) {
    console.log('radio checked', e.target.value);
    this.setState({
      audit_status: e.target.value,
    });
  }

  // 处理填写审批意见
  handleAuditDesc(e) {
    this.setState({
      audit_desc: e.target.value,
    });
  }

  // 提交审核
  handleSubmit() {
    const { fields, audit_status, audit_desc } = this.state;
    const { dispatch, history } = this.props;
    const data = {
      ...fields,
      audit_status,
      audit_desc,
    };
    if (audit_status === 2 && !audit_desc) {
      message.info('审批意见必须填写');
    } else {
      console.log('提交审核数据', data);      
      dispatch({
        type: 'good/modifyInfo',
        goodId: this.state.args.goodId,
        data,
        callback: () => { history.push('/goods/list'); },
      });
    }
  }

  render() {
    console.log('detail state:', this.state);
    const { good, loading } = this.props;
    const { audit_status } = this.state;
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

          <div className={styles['submit-btn-wrap']}>
            <div className="left">
              审批意见：
              <RadioGroup onChange={this.handleRadioChange} value={audit_status}>
                <Radio value={1}>通过</Radio>
                <Radio value={2}>不通过</Radio>
              </RadioGroup>
              <Tooltip title="审批意见不能为空" visible={audit_status === 2} autoAdjustOverflow={false}>
                <Input
                  placeholder="未通过说明"
                  className={audit_status === 2 ? 'show-inline' : 'hide'}
                  onChange={e => this.handleAuditDesc(e)}
                />
              </Tooltip>
            </div>
            <div className="right">
              <Button>取消</Button>
              <Button type="primary" onClick={this.handleSubmit}>提交</Button>
            </div>

          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GoodDetail;
