/*
 * @Author: lll
 * @Date: 2018-01-31 15:37:34
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-07 17:46:46
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import { Card, Radio, Tooltip, Input, Button, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodInfo from '../../components/Form//GoodInfo';
import { handleServerMsgObj } from '../../utils/tools';

import styles from './good-detail.less';

const RadioGroup = Radio.Group;

// 商品详情页
@connect(({ good, loading, user }) => ({
  good,
  loading: loading.models.good,
  user,
})
)
class GoodDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      auditStatus: 1, // 审核状态
      auditDesc: '', // 审批意见
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取商品详情
    dispatch({
      type: 'good/fetchDetail',
      gno: args.gno,
      success: (res) => {
        this.setState({
          fields: {
            shipping_fee_type: res.data.shipping_fee_type,
            shelf_life: res.data.shelf_life, // 质保期
            sales_unit: res.data.sales_unit, // 销售单位
            stock: res.data.stock, // 库存
            min_buy: res.data.min_buy, // 最小采购量
          },
        });
        this.dispatchSupplierInfo(res.data.supplier_id);
      },
    });
  }

  // 获取供应商信息
  dispatchSupplierInfo = (supplierid) => {
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
  handleProductAttr = (obj) => {
    this.setState({
      fields: { ...this.state.fields, ...obj },
    });
  }

  // 处理审批意见的单选框按钮
  handleRadioChange = (e) => {
    this.setState({
      auditStatus: e.target.value,
    });
  }

  // 处理填写审批意见
  handleAuditDesc = (e) => {
    this.setState({
      auditDesc: e.target.value,
    });
  }

  // 提交审核
  handleSubmit = () => {
    const { fields, auditStatus, auditDesc, args } = this.state;
    const { dispatch, history } = this.props;
    const data = {
      ...fields,
      audit_status: auditStatus,
      audit_desc: auditDesc,
    };
    if (auditStatus === 2 && !auditDesc) {
      message.info('审批意见必须填写');
    } else {
      dispatch({
        type: 'good/modifyInfo',
        gno: args.gno,
        data,
        success: () => { history.goBack(); },
        error: (res) => { message.error(handleServerMsgObj(res.msg)); },
      });
    }
  }

  render() {
    const { good, loading, user } = this.props;
    const { args, auditStatus, auditDesc } = this.state;

    return (
      <PageHeaderLayout title="商品详情审核页">
        <Card className={styles['good-detail-wrap']} loading={loading}>
          <GoodInfo
            data={{ ...good.detail, ...this.state.fields }}
            onChange={this.handleFormChange}
            loading={loading}
            onAttrChange={this.handleProductAttr}
            user={user.supplier}
          />
          <Card bordered={false}>
            {
              args.audit ?
                (
                  <div className={styles['submit-btn-wrap']}>
                    <div className="left">
                      审批意见：
                      <RadioGroup onChange={this.handleRadioChange} value={auditStatus}>
                        <Radio value={1}>通过</Radio>
                        <Radio value={2}>不通过</Radio>
                      </RadioGroup>
                      <Tooltip title="审批意见不能为空" visible={auditStatus === 2} autoAdjustOverflow={false}>
                        <Input
                          placeholder="未通过说明"
                          className={auditStatus === 2 ? 'show-inline' : 'hide'}
                          onChange={e => this.handleAuditDesc(e)}
                        />
                      </Tooltip>
                    </div>
                    <div className="right">
                      <Button onClick={() => { this.props.history.goBack(); }}>返回列表</Button>
                      <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                    </div>
                  </div>
                )
                :
                (
                  <div className={styles['back-btn-wrap']}>
                    <Button onClick={() => { this.props.history.goBack(); }}>返回列表</Button>
                  </div>
                )
            }
          </Card>

        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GoodDetail;
