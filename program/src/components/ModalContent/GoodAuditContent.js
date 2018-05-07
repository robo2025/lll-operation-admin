import React, { Component } from 'react';
import { Form, Row, Input, Radio } from 'antd';

const { FormItem } = Form;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
export default class GoodAuditContent extends Component {
  componentDidMount() {
    this.props.handleValidate(this.props.form);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Form>
        <Row>
          <FormItem
            label="审核选择"
            {...formItemLayout}
          >
            {
              getFieldDecorator('is_pass', {
                rules: [{
                  required: true,
                  message: '',
                }],
                initialValue: 1,
              })(
                <RadioGroup onChange={(e) => { this.handleAuditRadioChange(e.target.value); }}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={0}>不通过</Radio>
                </RadioGroup>
              )
            }

          </FormItem>
        </Row>
        <Row>
          <FormItem
            label="说明"
            {...formItemLayout}
          >
            {
              getFieldDecorator('remarks', {
                rules: [{
                  required: true,
                  message: '你必须填写审核说明',
                }],
              })(
                <TextArea />
              )
            }
          </FormItem>
        </Row>
      </Form>
    );
  }
}
