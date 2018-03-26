/*
 * @Author: lll 
 * @Date: 2018-03-05 10:15:16 
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-26 10:09:36
 */

import React, { PureComponent } from 'react';
import moment from 'moment';
import { Row, Col, Input } from 'antd';

import styles from './modal-content.less';

const { TextArea } = Input;

// 无货驳回弹出层内容 
export default class RejectContent extends PureComponent {
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
    const { onChange } = this.props;        
    const tempJson = {};
    tempJson[key] = text;
    onChange({
      ...tempJson,
    });
  }

  render() {
    const { data } = this.props;    
    console.log('无货驳回modal', data);
    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单编号：{data.son_order_sn}</Col>
          <Col span={12}>下单时间：{moment(data.add_time * 1000).format('YYYY-MM-DD h:mm')}</Col>
        </Row>
        <Row>
          <Col span={12}>客户公司名称：{data.guest_name}</Col>
        </Row>
        <Row>
          <Col span={12}>供应商公司名称：{data.supplier_name}</Col>
        </Row>
        <Row>
          <Col span={5}>说明：</Col>
          <Col span={12}>
            <TextArea
              defaultValue={data.desc}
              onChange={(e) => { this.handleTextChange('desc', e.target.value); }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
