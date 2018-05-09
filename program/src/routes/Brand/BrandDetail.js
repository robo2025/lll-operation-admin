import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { queryString } from '../../utils/tools';
import { ACTION_FLAG } from '../../constant/statusList';

import styles from './style.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
// 操作记录列
const actionColumns = [{
  title: '操作类型',
  dataIndex: 'action_flag',
  key: 'action_flag',
  render: val => <span>{ACTION_FLAG[val]}</span>,
}, {
  title: '说明',
  dataIndex: 'change_message',
  key: 'change_message',
}, {
  title: '操作员',
  dataIndex: 'creator',
  key: 'creator',
  render: (text, record) => (<span>{`${text}(${record.creator_id})`}</span>),
}, {
  title: '操作时间',
  dataIndex: 'created_time',
  key: 'created_time',
  render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
}];

@connect(({ brand, product, logs, loading }) => ({
  brand,
  product,
  logs,
  loading,
}))
export default class BrandDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: queryString.parse(window.location.href),
      selectedRows: [],
    };
    this.columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
      render: (record, text, idx) => (<span>{idx + 1}</span>),
    }, {
      title: '已关联产品',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 130,
    }, {
      title: '所属三级类目',
      dataIndex: 'category',
      render: val => (val.children.children.category_name),
      width: 150,
      key: 'menu-3',
    }, {
      title: '所属二级类目',
      dataIndex: 'category',
      render: val => (val.category_name),
      width: 100,
      key: 'menu-2',
    }, {
      title: '所属一级类目',
      dataIndex: 'category',
      render: val => (val.children.category_name),
      width: 100,
      key: 'menu-1',
    }];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取服务器品牌详情
    dispatch({
      type: 'brand/fetchDetail',
      bno: args.bno,
    });
    // 获取产品列表
    dispatch({
      type: 'product/fetch',
      params: {
        bno: args.bno,
      },
    });
    // 获取品牌操作日志
    dispatch({
      type: 'logs/fetch',
      module: 'brand',
      objectId: args.bno,
    });
  }

  render() {
    const { brand, product, logs, loading } = this.props;
    const { detail } = brand;
    const { selectedRows, args } = this.state;
    console.log('请求到的产品列表:', product.list);

    return (
      <PageHeaderLayout title="查看品牌">
        <Card bordered={false} style={{ marginBottom: 25 }}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="品牌ID"
            >
              <span>{detail.bno}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌"
            >
              <span>{detail.brand_name}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="英文名(选填)"
            >
              <span>{detail.english_name}</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="LOGO"
            >
              <div className="pic-box">
                <img
                  src={detail.logo_url}
                  alt="图片"
                  width={80}
                  height={80}
                />
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌证书"
            >
              <div className="pic-box">
                {
                  detail.certificate_urls && detail.certificate_urls.map(val => (
                    <img
                      src={val}
                      alt="证书图片加载失败"
                      width={150}
                    />
                  ))
                }

              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌介绍"
            >
              <p>
                {detail.summary}
              </p>
            </FormItem>
          </Form>
        </Card>
        <Card bordered={false} title="已关联产品" style={{ marginBottom: 25 }}>
          <Table
            loading={loading.models.product}
            dataSource={product.list}
            total={product.total}
            defaultPage={args.page || 1}
            columns={this.columns}
            rowKey="pno"
          />
        </Card>
        <Card bordered={false} title="操作记录" style={{ marginBottom: 25 }}>
          <Table
            loading={loading.models.logs}
            rowKey="id"
            columns={actionColumns}
            dataSource={logs.list}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
