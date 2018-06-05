/*
 * @Author: lll 
 * @Date: 2018-03-05 10:15:16 
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-02 11:57:30
 */

import React, { PureComponent } from 'react';
import { Row, Col, Checkbox, Select, Input } from 'antd';

import styles from './modal-content.less';

const { Option } = Select;
const { TextArea } = Input;

// 取消订单弹出层内容 
export default class ReminderContent extends PureComponent {
  // 处理下拉列表改变
  handleSelectChange = (key, value) => {
    const { data, onChange } = this.props;
    const tempJson = {};
    tempJson[key] = value;
    onChange({
      ...data,
      ...tempJson,
    });
  }

  // 处理输入框改变
  handleTextChange = (key, text) => {
    const { data, onChange } = this.props;
    const tempJson = {};
    tempJson[key] = text;
    onChange({
      ...data,
      ...tempJson,
    });
  }


  render() {
    const { data } = this.props;

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
          <Col span={5}>责任方：</Col>
          <Select
            value={data.responsible_party}
            style={{ width: 120 }}
            onChange={(e) => { this.handleSelectChange('responsible_party', e); }}
          >
            <Option value="2">供应商</Option>
            <Option value="1">客户</Option>
            <Option value="3">平台</Option>
          </Select>
        </Row>
        <Row>
          <Col span={5}>*取消说明：</Col>
          <Col span={12}>
            <TextArea
              value={data.cancel_desc}
              onChange={(e) => { this.handleTextChange('cancel_desc', e.target.value); }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
