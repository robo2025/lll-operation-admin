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
    const { defaultValue } = this.props;
    console.log('穿过来要被修改的数据', defaultValue);
    return (
      <Form>
        <Row gutter={24}>
          <Col span={9} offset={1} style={{ display: 'none' }}>
            <FormItem
              label="ID"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              {
                getFieldDecorator('id', {
                  rules: [{
                    required: false,
                    message: '请输入',
                  }],
                  initialValue: defaultValue ? defaultValue.id : '',
                })(
                  <span />
                )
              }
            </FormItem>
          </Col>
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
                  initialValue: defaultValue ? defaultValue.spec_name : '',
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
                  initialValue: defaultValue ? defaultValue.spec_unit : '',
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
                  initialValue: defaultValue ? defaultValue.is_require : false,
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
                  initialValue: defaultValue ? defaultValue.is_search : false,
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
