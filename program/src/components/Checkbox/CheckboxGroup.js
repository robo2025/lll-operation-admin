import React, { PureComponent } from 'react';
import { Checkbox, Row, Col } from 'antd';

import styles from './checkbox-group.less';

function onChange(checkedValues) {
  console.log('checked = ', checkedValues);
}

// 产品导出数据选择项目
export default class CheckboxGroup extends PureComponent {
  render() {
    return (
      <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
        <Row className={styles['tips-row']}>
          <Col span={24} className="tips">请选择导出项目：</Col>
        </Row>
        <Row className={styles['checkbox-row']}>
          <Col span={6}><Checkbox value="product_id">产品ID</Checkbox></Col>
          <Col span={6}><Checkbox value="product_name">产品名称</Checkbox></Col>
          <Col span={6}><Checkbox value="band">品牌</Checkbox></Col>
          <Col span={6}><Checkbox value="band_en">品牌英文名</Checkbox></Col>
          <Col span={6}><Checkbox value="type">型号</Checkbox></Col>
          <Col span={6}><Checkbox value="place">产地</Checkbox></Col>
          <Col span={6}><Checkbox value="menu">类目</Checkbox></Col>
          <Col span={6}><Checkbox value="origin_id">源产品ID</Checkbox></Col>
          <Col span={6}><Checkbox value="create_num">已有供应商信息</Checkbox></Col>
          <Col span={6}><Checkbox value="create_man">创建人</Checkbox></Col>
          <Col span={6}><Checkbox value="create_time">产品创建时间</Checkbox></Col>
        </Row>
      </Checkbox.Group>
    );
  }
}
