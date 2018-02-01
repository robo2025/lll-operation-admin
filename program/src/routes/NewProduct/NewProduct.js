/*
 * @Author: lll 
 * @Date: 2018-02-01 11:30:59 
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-01 15:04:06
 */
import React, { Component } from 'react';
import { Card, Button, Form, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ProductForm from '../../components/Form/ProductForm';
import SectionHeader from '../../components/PageHeader/SectionHeader';

import data from './product.json';

const FormItem = Form.Item;

export default class NewProduct extends Component {
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    const buttonGrop = (
      <div style={{ display: 'inline-block', marginLeft: 20 }}>
        <Button type="primary">关联参照数据</Button>
        <Button style={{ marginLeft: 20 }}>一键清除数据</Button>
      </div>);

    return (
      <PageHeaderLayout title="新建产品信息">
        <Card bordered={false}>
          <SectionHeader
            title="产品基础信息"
            extra={buttonGrop}
          />
          <ProductForm data={data} />
          <SectionHeader
            title="产品其他属性"
            extra={<Button style={{ marginLeft: 20 }} icon="plus">添加其他属性项</Button>}
          />
          <Form style={{ width: 500, maxWidth: '50%' }}>
            <FormItem
              label="控制输出"
              {...formItemLayout}
            >
              <Input />
            </FormItem>
            <FormItem
              label="检测物体"
              {...formItemLayout}              
            >
              <Input />
            </FormItem>
            <FormItem
              label="形状"
              {...formItemLayout}              
            >
              <Input />
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
