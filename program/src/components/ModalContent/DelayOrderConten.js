/*
 * @Author: lll 
 * @Date: 2018-03-05 10:17:15 
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-24 17:37:45
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Row, Col, Input, DatePicker } from 'antd';
import styles from './modal-content.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
// 延迟收货弹出层内容 
@Form.create()
export default class ReminderContent extends PureComponent {

  componentDidMount() {
    const { bindFormObj } = this.props;
    if (bindFormObj) {
      bindFormObj(this.props.form);
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    console.log('延期Modal', data);
    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单编号：{data.son_order_sn}</Col>
          <Col span={12}>下单时间：{moment(data.add_time * 1000).format('YYYY-MM-DD hh:mm:ss')}</Col>
        </Row>
        <Row>
          <Col span={12}>客户公司名称：{data.guest_name}</Col>
        </Row>
        <Row>
          <Col span={12}>供应商公司名称：{data.supplier_name}</Col>
        </Row>
        <Row>
          <FormItem
            label="延长时间至"
            {...formItemLayout}
          >
            {
              getFieldDecorator('due_time', {
                rules: [{
                  required: true,
                  message: '请选择延长时间',
                }],
                initialValue: moment(data.due_time * 1000),
              })(
                <DatePicker
                  format={dateFormat}
                  disabledDate={current => (current && current < moment(data.due_time * 1000).endOf('day'))}
                />
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
              getFieldDecorator('desc', {
                rules: [{
                  required: true,
                  message: '你必须填写审核说明',
                }],
                initialValue: data.supplier_remarks || '',
              })(
                <TextArea />
              )
            }
          </FormItem>
          {/* 以下是隐藏项 */}
          <FormItem
            label="延期审核"
            {...formItemLayout}
            style={{ display: 'none' }}
          >
            {
              getFieldDecorator('status', {
                rules: [{
                  required: true,
                  message: '你必须填写审核说明',
                }],
                initialValue: 2,
              })(
                <input />
              )
            }
          </FormItem>
          <FormItem
            label="延期审核"
            {...formItemLayout}
            style={{ display: 'none' }}
          >
            {
              getFieldDecorator('is_pass', {
                rules: [{
                  required: true,
                  message: '是否通过',
                }],
                initialValue: 1,
              })(
                <input />
              )
            }
          </FormItem>
        </Row>
      </div>
    );
  }
}
