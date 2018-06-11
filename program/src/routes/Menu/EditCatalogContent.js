import React, { Component } from 'react';
import { Form, Input, Radio } from 'antd';

const FormItem = Form.Item;


@Form.create()
export default class EditCatalogContent extends Component {
  componentDidMount() {
    this.props.bindForm(this.props.form);
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };
    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    console.log('编辑弹出层props：', this.props);

    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal">
        <FormItem
          label="类目名称"
          {...formItemLayout}
        >
          {
            getFieldDecorator('category_name', {
              rules: [{
                required: true,
                message: '请输入类目名称',
              }],
              initialValue: data.category_name,
            })(
              <Input />
            )
          }
        </FormItem>
        <FormItem
          className="collection-create-form_last-form-item"
          label="状态"
          {...formItemLayout}
        >
          {
            getFieldDecorator('is_active', {
              rules: [{
                required: true,
                message: '请选择是否启用',
              }],
              initialValue: data.is_active.toString(),
            })(
              <Radio.Group>
                <Radio value="1">启用</Radio>
                <Radio value="0">禁用</Radio>
              </Radio.Group>
            )
          }
        </FormItem>
      </Form>
    );
  }
}
