/*
 * @Author: lll 
 * @Date: 2018-03-05 10:17:15 
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-05 11:53:06
 */
import React, { PureComponent } from 'react';
import { Row, Col, Input, DatePicker } from 'antd';
import styles from './modal-content.less';

const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
 // 延迟收货弹出层内容 
 export default class ReminderContent extends PureComponent {
  handleDataPickerChange = (data, dateString) => {
    console.log(data, dateString);
  }
  render() {
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
            <DatePicker onChange={this.handleDataPickerChange} />
          </Row>
          <Row>
            <Col span={5}>延迟说明：</Col>
            <Col span={12}>
            <TextArea />
            </Col>
          </Row>
      </div>
    );
  }
 }
