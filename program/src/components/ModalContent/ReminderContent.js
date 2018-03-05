/*
 * @Author: lll 
 * @Date: 2018-03-05 10:05:56 
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-05 11:35:40
 */
import React, { PureComponent } from 'react';
import { Row, Col, Checkbox, Select, Input } from 'antd';

import styles from './modal-content.less';

const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { Option } = Select;
const plainOptions = [
  { label: '站内信', value: 'a' },
  { label: '短信', value: 'b' },
  { label: '邮件', value: 'c' },
];
 // 催单弹出层内容 
 export default class ReminderContent extends PureComponent {
  onCheckboxChange = (checkedValues) => {
    console.log(checkedValues);
  }

  handleSelectChange = (value) => {
    console.log(value);
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
            <Col span={5}>催单方式：</Col>
            <Col span={15}>
              <CheckboxGroup
              options={plainOptions}
              onChange={this.onCheckboxChange}
              />          
            </Col>
          </Row>
          <Row>
            <Col span={5}>对象方：</Col>
            <Select defaultValue="supplier" style={{ width: 120 }} allowClear onChange={this.handleSelectChange}>
              <Option value="supplier">供应商</Option>
              <Option value="guest">客户</Option>
            </Select>
          </Row>
          <Row>
            <Col span={5}>催单描述：</Col>
            <Col span={12}>
            <TextArea />
            </Col>
          </Row>
      </div>
    );
  }
 }
