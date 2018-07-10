import React, { PureComponent } from 'react';
import { Checkbox, Row, Col, Select } from 'antd';

import styles from './checkbox-group.less';

const { Option } = Select;
const plainOptions = ['gno', 'product_name', 'brand_name', 'english_name', 'partnumber', 'registration_place', 'category',  'price', 'supplier_name', 'created_time','auditor','audit_time','stock','min_buy', 'audit_status', 'publish_status'];// 所有选项
// 产品导出数据选择项目
export default class GoodCheckboxGroup extends PureComponent {
  state = {
    checkedList: [],
  }
  componentWillReceiveProps(nextProps) {
    // console.log('接受参数', nextProps);
    this.setState({
      checkedList: nextProps.isCheckAll ? plainOptions : nextProps.checkedList,
    });
  }
  onChange = (checkedList) => {
   /*  this.setState({
      checkedList,
    }); */
    // console.log('checkbox', checkedList);
    this.props.onChange(checkedList);
  }
 
  
  render() {
    // console.log('改变', this.state.checkedList);
    return (
      <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} value={this.state.checkedList}>
        <Row className={styles['tips-row']}>
          <Col span={24} className="tips">请选择导出字段项：</Col>
        </Row>
        <Row className={styles['checkbox-row']}>
          <Col span={6}><Checkbox value="gno">商品ID</Checkbox></Col>
          <Col span={6}><Checkbox value="product_name">商品名称</Checkbox></Col>
          <Col span={6}><Checkbox value="brand_name">品牌</Checkbox></Col>
          <Col span={6}><Checkbox value="english_name">品牌英文名</Checkbox></Col>
          <Col span={6}><Checkbox value="partnumber">型号</Checkbox></Col>
          <Col span={6}><Checkbox value="registration_place">产地</Checkbox></Col>
          <Col span={6}><Checkbox value="category">所属类目</Checkbox></Col>
          <Col span={6}><Checkbox value="price">价格</Checkbox></Col>
          <Col span={6}><Checkbox value="supplier_name">供应商名称</Checkbox></Col>
          <Col span={6}><Checkbox value="created_time">商品提交时间</Checkbox></Col>
          <Col span={6}><Checkbox value="auditor">审核人</Checkbox></Col>
          <Col span={6}><Checkbox value="audit_time">审核时间</Checkbox></Col>
          <Col span={6}><Checkbox value="stock">库存数量</Checkbox></Col>
          <Col span={6}><Checkbox value="min_buy">起购数量</Checkbox></Col>
          <Col span={6}>
            <Checkbox value="audit_status">审核状态</Checkbox>
          </Col>
          <Col span={6}>
            <Checkbox value="publish_status">上下架状态</Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
    );
  }
}
