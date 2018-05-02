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

@connect(({ brand, loading }) => ({
  brand,
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
                  detail.certificate_urls.map(val => (
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
                固高科技(香港)有限公司成立于1999年，总部位于香港科技大学。创立者为自动化和微电子领域的国际知名
                专家、学者。具有多年在加利福尼亚大学(UC Berkeley)、麻省理工学院 (MIT)、贝尔实验
                室(Bell Lab)等国际一流科研机构进行研发和管理经验，同年，固高科技（深圳）有限公司成立。
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
