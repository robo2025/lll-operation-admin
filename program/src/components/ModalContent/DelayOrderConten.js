/*
 * @Author: lll 
 * @Date: 2018-03-05 10:17:15 
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-22 16:11:07
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Input, DatePicker } from 'antd';
import styles from './modal-content.less';

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
 // 延迟收货弹出层内容 
 export default class ReminderContent extends PureComponent {
  state = {
    delayTime: moment().format(dateFormat),
    desc: '',
  }

  // 处理时间选择器改变
  handleDataPickerChange = (key, data, dateString) => {
    console.log(data, dateString);
    const tempJson = {};
    tempJson[key] = dateString;
    this.props.onChange(tempJson);
  }

   // 处理输入框改变
   handleTextChange = (key, text) => {
    const tempJson = {};
    tempJson[key] = text;
    this.setState(tempJson);
    this.props.onChange(tempJson);    
  }

  render() {
    const { delayTime, desc } = this.state;
    const { data } = this.props;
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
            <Col span={5}>延长时间至：</Col>
            <DatePicker 
              defaultValue={moment(data.due_time * 1000)}
              format={dateFormat}
              disabledDate={current => (current && current < moment(data.due_time * 1000).endOf('day'))}
              onChange={(date, dateString) => { this.handleDataPickerChange('due_time', date, dateString); }}
            />
          </Row>
          <Row>
            <Col span={5}>延迟说明：</Col>
            <Col span={12}>
            <TextArea
              value={desc}
              onChange={(e) => { this.handleTextChange('desc', e.target.value); }}              
            />
            </Col>
          </Row>
      </div>
    );
  }
 }
