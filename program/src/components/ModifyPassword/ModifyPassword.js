import React from 'react';
import { sha256 } from 'js-sha256';
import { Form, Modal, Input, Spin } from 'antd';

const FormItem = Form.Item;
@Form.create()
export default class ModifyPassword extends React.Component {
  onOk = () => {
    const { form, modifyPasswordOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return false;
      const { old_password, new_password } = fieldsValue;
      const values = { old_password: sha256(old_password), new_password: sha256(new_password) };
      console.log(values);
      modifyPasswordOk(values);
    });
  };
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value.length < 6) {
      callback('密码长度为6-12位');
    } else if (value && value.length > 12) {
      callback('密码长度为6-12位');
    } else if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };
  checkNewpassword = (rule, value, callback) => {
    const { form } = this.props;
    const newPassword = form.getFieldValue('new_password');
    if (newPassword && newPassword.length >= 6) {
      form.validateFields(['new_password'], { force: true });
    }
    callback();
  };
  render() {
    const { form, passwordModalVisible, onCancel, currentUser } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: 5,
      },
      wrapperCol: {
        sm: 16,
      },
    };
    return (
      <Modal
        title="修改密码"
        okText="确认修改"
        destroyOnClose
        onOk={this.onOk}
        onCancel={onCancel}
        visible={passwordModalVisible}
      >
          <Form>
          <FormItem label="用户名" {...formItemLayout}>
                <span>{currentUser.username}</span>
          </FormItem>
            <FormItem label="旧密码" {...formItemLayout}>
              {getFieldDecorator('old_password', {
                rules: [
                  {
                    required: true,
                    message: '请输入旧密码',
                    
                  },
                  {
                    min: 6,
                    message: '密码长度为6-12位',
                    whitespace: true,
                  },
                  {
                    max: 12,
                    message: '密码长度为6-12位',
                  },
                ],
              })(<Input type="password" placeholder="请输入旧密码" />)}
            </FormItem>
            <FormItem label="新密码" {...formItemLayout}>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: '请输入新密码' },
                  {
                    min: 6,
                    message: '密码长度为6-12位',
                  },
                  {
                    max: 12,
                    message: '密码长度为6-12位',
                  },
                  {
                    validator: this.checkNewpassword,
                  },
                ],
              })(<Input type="password" placeholder="请输入新密码" />)}
            </FormItem>
            <FormItem label="确认密码" {...formItemLayout}>
              {getFieldDecorator('new_password', {
                rules: [
                  { required: true, message: '请输入密码' },
                  { validator: this.checkConfirm },
                ],
              })(<Input placeholder="请确认密码" type="password" />)}
            </FormItem>
          </Form>
      </Modal>
    );
  }
}
