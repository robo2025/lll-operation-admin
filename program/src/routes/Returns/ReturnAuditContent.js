import React, { Component } from 'react';
import { Form, Row, Select, Input, Radio } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

@Form.create()
export default class ReturnAuditContent extends Component {
  state = {
    auditData: {
      is_pass: 1,
    },
  }

  componentDidMount() {
    const { bindFormObj } = this.props;
    if (bindFormObj) {
      bindFormObj(this.props.form);
    }
  }

  // 审核选择
  handleAuditRadioChange = (value) => {
    const { auditData } = this.state;
    this.setState({
      auditData: { ...auditData, is_pass: value },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { auditData } = this.state;
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
        {
          auditData.is_pass >> 0 === 1 ? (
            <Row>
              <FormItem
                label="责任方"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('responsible_party', {
                    rules: [{
                      required: true,
                      message: '你必须选择一个责任方',
                    }],
                    initialValue: '1',
                  })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="1">客户</Option>
                      <Option value="2">供应商</Option>
                      <Option value="3">平台</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Row>
          )
            : null
        }
      </Form>
    );
  }
}
