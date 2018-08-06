import React from 'react';
import { Card, Form, Input, Icon, Button, Popconfirm, message } from 'antd';

const FormItem = Form.Item;
let uuid = -1;

export default class EditPosition extends React.Component {
  remove = (k) => {
    const { form, onRemove } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key.id !== k.id),
    });
    if (k.id >= 0) {
      onRemove(k);
    }
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys =
      keys.length === 0 ? [{ id: uuid }] : keys.concat({ id: uuid });
    uuid--;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  render() {
    const { initData, form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 5 },
      },
    };
    getFieldDecorator('keys', { initialValue: initData });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k) => {
      return (
        <FormItem {...formItemLayoutWithOutLabel} required={false} key={k.id}>
          {getFieldDecorator(`${k.id}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入职位名称或删除此行',
              },
            ],
            initialValue: k.name,
          })(
            <Input
              placeholder="请输入部门名称"
              style={{ width: '60%', marginRight: 8 }}
            />
          )}
          {k.id < 0 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              style={{ fontSize: 16, marginLeft: 8, color: 'red' }}
              onClick={() => this.remove(k)}
            />
          ) : (
            <Popconfirm
              placement="topLeft"
              title="确认删除？"
              onConfirm={() => this.remove(k)}
              okText="确认"
              cancelText="取消"
            >
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                style={{ fontSize: 16, marginLeft: 8, color: 'red' }}
              />
            </Popconfirm>
          )}
        </FormItem>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}
