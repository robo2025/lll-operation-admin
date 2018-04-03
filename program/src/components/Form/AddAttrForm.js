import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';

const FormItem = Form.Item;


// 添加商品属性表单
@Form.create({
  onFieldsChange: (props, fileds) => { props.onFieldsChange(fileds); },
})
class AddAttrForm extends Component {
  componentDidMount() {
    this.props.handleValidate(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row gutter={24}>
          <Col span={9} offset={2}>
            <FormItem
              label="属性名称"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
            >
              {
                getFieldDecorator('attr_name', {
                  rules: [{
                    required: true,
                    message: '请输入属性名称',
                  }],
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem
              label="数值"
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
            >
              {
                getFieldDecorator('attr_value', {
                  rules: [{
                    required: true,
                    message: '请输入数值数据',
                  }],
                })(
                  <Input />
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
