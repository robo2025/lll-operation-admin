import React, { Fragment } from "react";
import { Form, Input, Button, Card } from "antd";

const FormItem = Form.Item;

@Form.create({
  mapPropsToFields(props) {
    return {};
  }
})
export default class ContractForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        md: { span: 6 },
        xs: { span: 6 }
      },
      wrapperCol: {
        md: { span: 12 },
        xs: { span: 12 }
      }
    };
    return (
      <Fragment>
        <Form>
          <Card bordered={false}>
            <FormItem label="企业信息" {...formItemLayout}>
             <Button type="primary" onClick={this.props.showModal}>选择企业</Button>
            </FormItem>
            <FormItem label="企业名称" {...formItemLayout}>
              {getFieldDecorator("choose_Info")(<Input disabled/>)}
            </FormItem>
            <FormItem label="法人" {...formItemLayout}>
              {getFieldDecorator("choose_Info")(<Input disabled/>)}
            </FormItem>
            <FormItem label="账号" {...formItemLayout}>
              {getFieldDecorator("choose_Info")(<Input disabled/>)}
            </FormItem>
            <FormItem label="手机" {...formItemLayout}>
              {getFieldDecorator("choose_Info")(<Input disabled/>)}
            </FormItem>
            <FormItem label="联系邮箱" {...formItemLayout}>
              {getFieldDecorator("choose_Info")(<Input disabled/>)}
            </FormItem>
          </Card>
        </Form>
      </Fragment>
    );
  }
}
