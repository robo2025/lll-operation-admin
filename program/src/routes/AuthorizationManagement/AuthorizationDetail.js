import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Spin, Table } from 'antd';
import { getAreaBycode } from '../../utils/cascader-address-options';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { FILE_SERVER } from '../../constant/config';
import DescriptionList from '../../components/DescriptionList';
import RecordTable from '../../components/RecordTable';

const { Description } = DescriptionList;
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
const columns = [
  {
    title: '序号',
    key: 'id',
    render: (text, record, index) => index + 1,
  },
  {
    title: '产品名称',
    dataIndex: 'product_name',
    key: 'product_name',
  },
  {
    title: '品牌',
    dataIndex: 'brand_name',
    key: 'brand_name',
  },
  {
    title: '注册地',
    dataIndex: 'registration_place',
    key: 'registration_place',
  },
  {
    title: '所属三级类目',
    dataIndex: 'category_id_3.category_name',
    key: 'category_id_3.id',
  },
  {
    title: '所属二级类目',
    dataIndex: 'category_id_2.category_name',
    key: 'category_id_2.id',
  },
  {
    title: '所属一级类目',
    dataIndex: 'category_id_1.category_name',
    key: 'category_id_1.id',
  },
];
@connect(({ authorizationManagement, loading }) => ({
  profile: authorizationManagement.profile,
  loading: loading.effects['authorizationManagement/fetchDetail'],
}))
export default class AuthorizationDetail extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authorizationManagement/fetchDetail',
      payload: location.href.split('=').pop(),
    });
  }
  render() {
    const { profile } = this.props;
    const {
      basic_info,
      qualification_info,
      operation_records,
      auth_info,
    } = profile;
    if (!basic_info) {
      return <Spin />;
    }
    const license = qualification_info.find(
      val => val.qualifi_name === 'license'
    );
    return (
      <PageHeaderLayout title="企业信息">
        <Card title="基本信息" bordered style={{ marginTop: 35 }}>
          <div style={{ color: '#1890ff', fontSize: 16, marginBottom: 5 }}>
            <span>账号 ：{basic_info.username}</span>
          </div>
          <DescriptionList size="small" col="2">
            <Description term="企业名称">{basic_info.company}</Description>
            <Description term="手机号">{basic_info.mobile}</Description>
            <Description term="企业地址">
              <span>
                {getAreaBycode(`${basic_info.district_id}`)}
                {basic_info.address}
              </span>
            </Description>
            <Description term="联系邮箱">{basic_info.email}</Description>
            <Description term="法人">{basic_info.legal}</Description>
            <Description term="固定电话">{basic_info.telephone}</Description>
            <Description term="企业性质">
              {COMPANY_TYPE[basic_info.company_type]}
            </Description>
            <Description term="注册时间">
              {moment(basic_info.date_joined).format('YYYY-MM-DD')}
            </Description>
          </DescriptionList>
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
          {qualification_info.map(item => (
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
                  {moment(item.effective_date).format('YYYY-MM-DD')}
                  ~
                  {moment(item.expire_date).format('YYYY-MM-DD')}
                </div>
              </div>
            </FormItem>
          ))}
        </Card>
        <Card title="已授权产品" bordered style={{ marginTop: 35 }}>
          <Table
            columns={columns}
            dataSource={auth_info}
            rowKey="product_name"
          />
        </Card>
        <RecordTable
          dataSource={
            operation_records
              ? operation_records.map((item) => {
                  return {
                    ...item,
                    key: item.created_time + item.change_message,
                  };
                })
              : []
          }
        />
      </PageHeaderLayout>
    );
  }
}
