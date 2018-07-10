import React, { PureComponent } from 'react';
import { Checkbox, Row, Col } from 'antd';

import styles from './checkbox-group.less';
const plainOptions = ['mno', 'partnumber', 'brand_name', 'registration_place', 'pno','product_name','category',  'spec', 'creator', 'created_time', 'supplier_count'];

// 产品导出数据选择项目
export default class ProductModalExport extends PureComponent {
    state = {
        checkedList: [],
    }
    componentWillReceiveProps(nextProps) {
        console.log('接受参数', nextProps);
        this.setState({
            checkedList: nextProps.isCheckAll ? plainOptions : nextProps.checkedList,
        });
    }
    onChange = (checkedList) => {
        this.props.onChange(checkedList);
    }

    render() {
        return (
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} value={this.state.checkedList}>
                <Row className={styles['checkbox-row']}>
                    <Col span={6}><Checkbox value="mno">产品型号ID</Checkbox></Col>
                    <Col span={6}><Checkbox value="partnumber">产品型号</Checkbox></Col>
                    <Col span={6}><Checkbox value="brand_name">品牌</Checkbox></Col>
                    <Col span={6}><Checkbox value="registration_place">产地</Checkbox></Col>
                    <Col span={6}><Checkbox value="pno">产品ID</Checkbox></Col>
                    <Col span={6}><Checkbox value="product_name">产品名称</Checkbox></Col>
                    <Col span={6}><Checkbox value="category">所属类目</Checkbox></Col>
                    <Col span={6}><Checkbox value="spec">规格参数</Checkbox></Col>
                    <Col span={6}><Checkbox value="creator">创建人</Checkbox></Col>
                    <Col span={6}><Checkbox value="created_time">创建时间</Checkbox></Col>
                    <Col span={7}><Checkbox value="supplier_count">已有供应商信息</Checkbox></Col>
                </Row>
            </Checkbox.Group>
        );
    }
}
