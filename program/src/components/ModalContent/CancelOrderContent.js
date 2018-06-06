/*
 * @Author: lll 
 * @Date: 2018-03-05 10:15:16 
 * @Last Modified by: lll
 * @Last Modified time: 2018-06-06 12:02:12
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Form, Select, Input } from 'antd';

import styles from './modal-content.less';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;

// 取消订单弹出层内容 
@Form.create()
export default class ReminderContent extends PureComponent {
  componentDidMount() {
    const { bindForm } = this.props;
    if (bindForm) {
      bindForm(this.props.form);
    }
  }

  render() {
    const { data } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单号：{data && data.son_order_sn}</Col>
          <Col span={12}>下单时间：{moment(data.add_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</Col>
        </Row>
        <Row>
          <Col span={12}>客户公司名称：{data && data.guest_name}</Col>
        </Row>
        <Row>
          <Col span={12}>供应商公司名称：{data && data.supplier_name}</Col>
        </Row>
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
        <Row>
          <FormItem
            label="取消说明"
            {...formItemLayout}
          >
            {
              getFieldDecorator('cancel_desc', {
                rules: [{
                  required: true,
                  message: '你必须填写取消说明',
                }],
              })(
                <TextArea />
              )
            }
          </FormItem>
        </Row>
      </div>
    );
  }
}
