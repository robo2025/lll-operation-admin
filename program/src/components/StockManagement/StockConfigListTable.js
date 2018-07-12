import React from 'react';
import { Table, Badge, Divider, Icon } from 'antd';
import { PUBLISH_STATUS, AUDIT_STATUS } from "../../constant/statusList";
const AuditStatusMap = ['processing', 'success', 'error'];// 审核状态
const GoodsStatusMap = ['default', 'success', 'processing'];// 上下架状态

export default class StockConfigListTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data, total, loading,onstockTableChange } = this.props;
        data.map((ele, idx) => ele.idx = idx)
        const columns = [{
            title: "序号",
            dataIndex: "idx",
            key: 'idx'
        }, {
            title: "商品ID",
            dataIndex: "gno",
            key: "gno"
        }, {
            title: "产品名称",
            key: "product_name",
            dataIndex: 'product_name'
        }, {
            title: "产品型号",
            key: "partnumber",
            dataIndex: 'partnumber'
        }, {
            title: "供应商名称",
            key: "supplier_name",
            dataIndex: "supplier_name"
        }, {
            title: "品牌",
            key: "brand_name",
            dataIndex: 'brand_name'
        }, {
            title: "产地",
            key: "registration_place",
            dataIndex: 'registration_place'
        }, {
            title: '审核状态',
            dataIndex: 'audit_status',
            key: 'audit_status',
            render: (record) => (<Badge status={AuditStatusMap[record]} text={AUDIT_STATUS[record]} />)
        }, {
            title: '上下架状态',
            dataIndex: 'publish_status',
            key: 'publish_status',
            render: (record) => (
                (<Badge status={GoodsStatusMap[record]} text={PUBLISH_STATUS[record]} />)
            )
        }, {
            title: '库存数量',
            key: "stock",
            render: (val) => (<span>{`${val.stock}${val.sales_unit}`}</span>)
        }, {
            title: "操作",
            width: 200,
            fixed: "right",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" style={{ textDecoration: "none" }} disabled={record.audit_status !== 1}>设置限制</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" style={{ textDecoration: "none" }}>查看记录</a>
                </span>
            ),
        }];
        const paginationOptions = {
            total,
            showSizeChanger: true,
            showQuickJumper: true
        }
        return (
            <Table columns={columns} dataSource={data}
                rowKey={record => record.idx}
                scroll={{ x: 1300 }}
                loading={loading}
                pagination={paginationOptions}
                onchange={onstockTableChange}
            />
        )
    }
}