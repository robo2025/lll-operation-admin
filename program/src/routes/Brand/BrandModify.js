import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { queryString, handleServerMsg } from '../../utils/tools';

import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
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
@Form.create()
export default class BrandModify extends Component {
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
    const { getFieldDecorator } = this.props.form;
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
              {
                getFieldDecorator('bno', {
                  initialValue: detail.bno,
                })(
                  <span>{detail.bno}</span>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌"
            >
              {
                getFieldDecorator('brand_name', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: detail.brand_name,
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="英文名(选填)"
            >
              {
                getFieldDecorator('english_name', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: detail.english_name,
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="注册地"
            >
              {
                getFieldDecorator('registration_place', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: detail.registration_place,
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="LOGO"
            >
              <div className="pic-box">
                <img
                  src="https://ss.intsig.net/yemai/vip/camfs/qxb/11111_16d11642e1a8286ae3b3028fa2de13db"
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
                <img
                  src="http://img1.maka.im/2013364/128551285456ebb6f6a8a558.26902182.png@0-0-1200-357a_80Q.src"
                  alt="图片"
                  width={150}
                />
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌介绍"
            >
              {
                getFieldDecorator('register', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: brand.summary,
                })(
                  <TextArea
                    autosize={{ minRows: 8, maxRows: 16 }}
                  />
                )
              }
              <p />
            </FormItem>
            <div className={styles['submit-box']}>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={() => { history.goBack(); }}>取消</Button>
            </div>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
