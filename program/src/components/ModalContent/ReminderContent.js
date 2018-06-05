/*
 * @Author: lll 
 * @Date: 2018-03-05 10:05:56 
 * @Last Modified by: lll
 * @Last Modified time: 2018-06-05 16:48:26
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
  state = {
    remindTypes: [],
    receiver: 'supplier',
    desc: '',
  }
  // 处理多多选框改变
  onCheckboxChange = (key, checkedValues) => {
    const tempJson = {};
    tempJson[key] = checkedValues;
    this.setState(tempJson);
    console.log(key, checkedValues);
  }
  // 处理下拉列表改变
  handleSelectChange = (key, value) => {
    const tempJson = {};
    tempJson[key] = value;
    this.setState(tempJson);
    console.log(key, value);
  }
  // 处理输入框改变
  handleTextChange = (key, text) => {
    const tempJson = {};
    tempJson[key] = text;
    this.setState(tempJson);
    console.log(text);
  }
  render() {
    const { remindTypes, receiver, desc } = this.state;
    this.props.onChange(this.state);

    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单号：123456789</Col>
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
              value={remindTypes}
              onChange={(e) => { this.onCheckboxChange('remindTypes', e); }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={5}>对象方：</Col>
          <Select
            value={receiver}
            style={{ width: 120 }}
            allowClear
            onChange={(e) => { this.handleSelectChange('receiver', e); }}
          >
            <Option value="supplier">供应商</Option>
            <Option value="guest">客户</Option>
          </Select>
        </Row>
        <Row>
          <Col span={5}>催单描述：</Col>
          <Col span={12}>
            <TextArea
              value={desc}
              onChange={(e) => {
                this.handleTextChange('desc', e.target.value);
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
