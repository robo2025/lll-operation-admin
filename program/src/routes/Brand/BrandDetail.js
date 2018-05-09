import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { queryString } from '../../utils/tools';

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
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取服务器品牌详情
    dispatch({
      type: 'brand/fetchDetail',
      bno: args.bno,
    });
  }

  render() {
    const { brand } = this.props;
    const { detail } = brand;

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
          456
        </Card>
        <Card bordered={false} title="操作记录" style={{ marginBottom: 25 }}>
          456
        </Card>
      </PageHeaderLayout>
    );
  }
}
