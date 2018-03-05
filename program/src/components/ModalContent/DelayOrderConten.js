/*
 * @Author: lll 
 * @Date: 2018-03-05 10:17:15 
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-05 14:19:35
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
    this.setState(tempJson);
  }

   // 处理输入框改变
   handleTextChange = (key, text) => {
    const tempJson = {};
    tempJson[key] = text;
    this.setState(tempJson);
    console.log(text);
  }

  render() {
    const { delayTime, desc } = this.state;
    return (
      <div className={styles['modal-content']}>
          <Row>
            <Col span={12}>订单编号：123456789</Col>
            <Col span={12}>下单时间：2017-01-02 12:12:11</Col>
          </Row>
          <Row>
            <Col span={12}>客户公司名称：长沙ABC公司</Col>
          </Row>
          <Row>
            <Col span={12}>供应商公司名称：长沙DEF公司</Col>
          </Row>
          <Row>
            <Col span={5}>延长时间至：</Col>
            <DatePicker 
              value={moment(delayTime, dateFormat)}
              onChange={(date, dateString) => { this.handleDataPickerChange('delayTime', date, dateString); }}
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
