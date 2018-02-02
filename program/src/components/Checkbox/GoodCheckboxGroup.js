import React, { PureComponent } from 'react';
import { Checkbox, Row, Col, Select } from 'antd';

import styles from './checkbox-group.less';

const { Option } = Select;

function onChange(checkedValues) {
  console.log('checked = ', checkedValues);
}

// 产品导出数据选择项目
export default class GoodCheckboxGroup extends PureComponent {
  render() {
    return (
      <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
        <Row className={styles['tips-row']}>
          <Col span={24} className="tips">请选择导出字段项：</Col>
        </Row>
        <Row className={styles['checkbox-row']}>
          <Col span={6}><Checkbox value="good_id">商品ID</Checkbox></Col>
          <Col span={6}><Checkbox value="good_name">商品名称</Checkbox></Col>
          <Col span={6}><Checkbox value="band">品牌</Checkbox></Col>
          <Col span={6}><Checkbox value="band_en">品牌英文名</Checkbox></Col>
          <Col span={6}><Checkbox value="type">型号</Checkbox></Col>
          <Col span={6}><Checkbox value="place">产地</Checkbox></Col>
          <Col span={6}><Checkbox value="menu">类目</Checkbox></Col>
          <Col span={6}><Checkbox value="price">价格</Checkbox></Col>
          <Col span={6}><Checkbox value="provider ">供应商名称</Checkbox></Col>
          <Col span={6}><Checkbox value="commission">佣金比率</Checkbox></Col>
          <Col span={6}><Checkbox value="commit_time">商品提交时间</Checkbox></Col>
          <Col span={6}><Checkbox value="check_man">审核人</Checkbox></Col>
          <Col span={6}><Checkbox value="check_time">审核时间</Checkbox></Col>
          <Col span={6}><Checkbox value="stock">库存数量</Checkbox></Col>
          <Col span={6}><Checkbox value="stock">价格</Checkbox></Col>
          <Col span={6}><Checkbox value="deliver">发货日</Checkbox></Col>
          <Col span={12}><Checkbox value="min_buy_num">起购数量</Checkbox></Col>
          <Col span={12}>
            <Checkbox value="min_buy_num">运费</Checkbox>
            <Select defaultValue="全部">
              <Option value="all">全部</Option>
              <Option value="by">包邮</Option>
              <Option value="df">到付</Option>
            </Select>
          </Col>
          <Col span={12}>
            <Checkbox value="min_buy_num">审核状态</Checkbox>
            <Select defaultValue="全部">
              <Option value="all">全部</Option>
              <Option value="wait">待审核</Option>
              <Option value="pass">审核通过</Option>
              <Option value="fail">审核未通过</Option>
            </Select>
          </Col>
          <Col span={12}>
            <Checkbox value="min_buy_num">上下架状态</Checkbox>
            <Select defaultValue="全部">
              <Option value="all">全部</Option>
              <Option value="wait">下架中</Option>
              <Option value="pass">已上架</Option>
            </Select>
          </Col>
        </Row>
      </Checkbox.Group>
    );
  }
}
