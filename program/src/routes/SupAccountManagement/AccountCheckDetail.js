import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Spin } from 'antd';
import { getAreaBycode } from '../../utils/cascader-address-options';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { FILE_SERVER } from '../../constant/config';
import RecordTable from '../../components/RecordTable';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 8 },
  },
};
const style = {
  marginBottom: 10,
};
const COMPANY_TYPE = {
  supplier: '供应商',
  integrator: '集成商',
  agency: '代理商',
  other: '其他',
};
const IMAGE_NAME = {
  license: '营业执照照片',
  production: '生产许可证',
  certification: '产品合格证',
  supplier: '厂家相关证书',
  taxpayer: '纳税人相关证书',
  integrator: '集成商相关证书',
  agency: '代理商相关证书',
  other: '其他证书',
};
@connect(({ supAudit, loading }) => ({
  profile: supAudit.profile,
  loading: loading.effects['supAudit/fetchDetail'],
}))
export default class AccountCheckDetail extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supAudit/fetchDetail',
      payload: location.href.split('=').pop(),
    });
  }
  render() {
    const { profile } = this.props;
    const { basic_info, qualifications, operation_records } = profile;
    if (!basic_info) {
      return <Spin />;
    }
    const license = qualifications.find(val => val.qualifi_name === 'license');
    return (
      <PageHeaderLayout title="企业信息">
        <Card title="基本信息" bordered style={{ marginTop: 35 }} hoverable>
          <FormItem {...formItemLayout} label="用户名" style={style}>
            <span>{basic_info.username}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="手机号" style={style}>
            <span>{basic_info.mobile}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="联系邮箱" style={style}>
            <span>{basic_info.email || '无'}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="企业名称" style={style}>
            <span>{basic_info.company}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="企业法人" style={style}>
            <span>{basic_info.legal}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="企业地址" style={style}>
            <span>
              {getAreaBycode(`${basic_info.district_id}`)}
              {basic_info.address}
            </span>
          </FormItem>
          <FormItem {...formItemLayout} label="固定电话" style={style}>
            <span>{basic_info.telephone}</span>
          </FormItem>
        </Card>
        <Card
          title="资质信息"
          bordered={false}
          style={{ marginTop: 35 }}
          hoverable
        >
          <FormItem {...formItemLayout} label="营业执照号" style={style}>
            <span>{license.qualifi_code}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="企业性质" style={style}>
            <span>{COMPANY_TYPE[basic_info.company_type]}</span>
          </FormItem>
          {qualifications.map(item => (
            <FormItem
              key={item.effective_date + item.expire_date}
              {...formItemLayout}
              label={`${IMAGE_NAME[item.qualifi_name]}`}
              style={style}
            >
              <div>
                <img
                  width={100}
                  height={100}
                  src={FILE_SERVER + item.qualifi_url}
                  alt={`${IMAGE_NAME[item.qualifi_name]}`}
                  onClick={() => {
                    window.open(FILE_SERVER + item.qualifi_url);
                  }}
                />
                <div>
                  有效期：
                  {moment.unix(item.effective_date).format('YYYY-MM-DD')}
                  ~
                  {moment.unix(item.expire_date).format('YYYY-MM-DD')}
                </div>
              </div>
            </FormItem>
          ))}
        </Card>
        <RecordTable
          dataSource={
            operation_records
              ? operation_records.map((item) => {
                  return { ...item, key: item.created_time };
                })
              : []
          }
        />
      </PageHeaderLayout>
    );
  }
}
