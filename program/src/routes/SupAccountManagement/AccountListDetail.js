import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Badge, Spin } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getAreaBycode } from '../../utils/cascader-address-options';
import SubAccountList from './SubAccountList';

const { Description } = DescriptionList;
const COMPANY_TYPE = {
  supplier: '供应商',
  integrator: '集成商',
  agency: '代理商',
  other: '其他',
};
const ACTIVE_STATUS = {
  1: (
    <span>
      <Badge status="success" />启用
    </span>
  ),
  0: (
    <span>
      <Badge status="error" />禁用
    </span>
  ),
};

@connect(({ supAccount, loading }) => ({
  profile: supAccount.profile,
  subAccountList: supAccount.subAccountList,
  loading: loading.effects['supAccount/fetchDetail'],
}))
export default class AccountListDetail extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supAccount/fetchDetail',
      payload: location.href.split('=').pop(),
    });
    dispatch({
      type: 'supAccount/fetchSubAccounts',
      payload: { id: location.href.split('=').pop() },
    });
  }
  render() {
    const { profile, subAccountList } = this.props;
    if (!profile.profile) {
      return <Spin />;
    }
    return (
      <PageHeaderLayout title="供应商主帐号详情">
        <Card title="主账号信息" bordered style={{ marginTop: 35 }}>
          <div style={{ color: '#1890ff', fontSize: 16, marginBottom: 5 }}>
            <span>主账号 ：{profile.username}</span>
          </div>
          <DescriptionList size="small" col="2">
            <Description term="企业名称">{profile.profile.company}</Description>
            <Description term="手机号">{profile.mobile}</Description>
            <Description term="企业地址">
              <span>
                {getAreaBycode(`${profile.profile.district_id}`)}
                {profile.profile.address}
              </span>
            </Description>
            <Description term="联系邮箱">{profile.email}</Description>
            <Description term="法人">{profile.profile.legal}</Description>
            <Description term="固定电话">
              {profile.profile.telphone}
            </Description>
            <Description term="企业性质">
              {COMPANY_TYPE[profile.profile.company_type]}
            </Description>
            <Description term="注册时间">
              {moment.unix(profile.created_time).format('YYYY-MM-DD')}
            </Description>
            <Description term="状态">
              {ACTIVE_STATUS[profile.is_active]}
            </Description>
          </DescriptionList>
        </Card>
        <SubAccountList
          dataSource={
            subAccountList
              ? subAccountList.map((item) => {
                  return { ...item, key: item.created_time };
                })
              : []
          }
        />
      </PageHeaderLayout>
    );
  }
}
