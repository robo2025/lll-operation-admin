/*
 * @Author: lll 
 * @Date: 2018-01-31 16:19:39 
 * @Last Modified by: lll
 * @Last Modified time: 2018-01-31 17:38:16
 */
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col } from 'antd';

import styles from './good-info.less';

const FormItem = Form.Item;

@Form.create()
class GoodInfo extends PureComponent {
  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { data } = this.props;
    for (const keyName in data) {
      if (data[keyName]) {
        const temp = {};
        temp[keyName] = data[keyName];
        setFieldsValue(temp);       
      }
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
    };

    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    console.log(this.props);
    
    return (
      <Form layout="horizontal" className={`good-info ${styles['good-info']}`}>
        <FormItem
          label="所属分类"
          {...formItemLayout}
        >
           {getFieldDecorator('cate', {
            })(
              <Input disabled />
            )}
        </FormItem>
        <FormItem
          label="产品ID"
          {...formItemLayout}
        >
           {getFieldDecorator('good_id', {
            })(
              <Input disabled />
            )}
        </FormItem>
        <FormItem
          label="商品名称"
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            })(
              <Input disabled />              
            )}
        </FormItem>
        <FormItem
          label="商品ID"
          {...formItemLayout}
        >
           {getFieldDecorator('product_id', {
            })(
              <Input disabled />
            )}
        </FormItem>
        <FormItem
          label="型号"
          {...formItemLayout}
        >
          {getFieldDecorator('type', {
            })(
              <Input disabled />
            )}
        </FormItem>
        <FormItem
          label="品牌"
          {...formItemLayout}
        >
          {getFieldDecorator('band', {
            })(
              <Input disabled />
            )}
        </FormItem>
        <FormItem
          label="英文名"
          {...formItemLayout}
        >
           {getFieldDecorator('en_name', {
            })(
              <Input disabled />
            )}
        </FormItem>
        <FormItem
          label="产地"
          {...formItemLayout}
        >
           {getFieldDecorator('place', {
            })(
              <Input disabled />
            )}
        </FormItem>
        <FormItem
          label="质保期"
          {...formItemLayout}
        >
           {getFieldDecorator('warranty', {
            })(
              <Input />
            )}
        </FormItem>
        <FormItem
          label="销售单位"
          {...formItemLayout}
        >
           {getFieldDecorator('unit', {
            })(
              <Input />
            )}
        </FormItem>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem
              label="库存"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 11 }}   
            >
            {getFieldDecorator('stock', {
              rules: [{ required: true, message: '请输入库存量' }],
            })(
              <Input />
            )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              label="最低采购量"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 11 }}          
            >
            {
              getFieldDecorator('min_buy_num', {
                rules: [{ required: true, message: '请输入最低采购量' }],
              })(
                <Input />
              )
            }
            </FormItem>
          </Col>
        </Row>
        <FormItem
          label="运费"
          {...formItemLayout}
        >
          {
              getFieldDecorator('freight', {
              })(
                <span>{data.freight}</span>
              )
            }
        </FormItem>
      </Form>
    );
  }
}

export default GoodInfo;

