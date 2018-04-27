import React, { Component } from 'react';
import { Form, Row, Col, Input, Checkbox } from 'antd';

const FormItem = Form.Item;


// 添加商品属性表单
@Form.create()
class AddAttrForm extends Component {
  componentDidMount() {
    this.props.handleValidate(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row gutter={24}>
          <Col span={9} offset={1}>
            <FormItem
              label="参数项名称"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              {
                getFieldDecorator('spec_name', {
                  rules: [{
                    required: true,
                    message: '请输入',
                  }],
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem
              label="单位"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
            >
              {
                getFieldDecorator('spec_unit', {
                  rules: [{
                    required: false,
                    message: '请输入',
                  }],
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={5} offset={5}>
            <FormItem
              label=""
              labelCol={{ span: 1 }}
              wrapperCol={{ span: 23 }}
            >
              {
                getFieldDecorator('is_require', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox>必填项</Checkbox>
                )
              }
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label=""
              labelCol={{ span: 1 }}
              wrapperCol={{ span: 23 }}
            >
              {
                getFieldDecorator('is_search', {
                  valuePropName: 'checked',                  
                  initialValue: false,                  
                })(
                  <Checkbox>筛选条件项</Checkbox>
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default AddAttrForm;
