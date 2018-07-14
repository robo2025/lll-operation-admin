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
        const { data, total, loading, onstockTableChange, current, pageSize, onSetRestrict, onviewRecord } = this.props;
        data.map((ele, idx) => ele.idx = idx + 1)
        const columns = [{
            title: "序号",
            dataIndex: "idx",
            key: 'idx',
            width: 60
        }, {
            title: "商品ID",
            dataIndex: "gno",
            key: "gno",
            width: 160
        }, {
            title: "产品名称",
            key: "product_name",
            dataIndex: 'product_name',
            width: 170
        }, {
            title: "产品型号",
            key: "partnumber",
            dataIndex: 'partnumber',
            width:100
        }, {
            title: "供应商名称",
            key: "supplier_name",
            dataIndex: "supplier_name",
            width:120
        }, {
            title: "品牌",
            key: "brand_name",
            dataIndex: 'brand_name',
            width:90
        }, {
            title: "产地",
            key: "registration_place",
            dataIndex: 'registration_place',
            width:100
        }, {
            title: '审核状态',
            dataIndex: 'audit_status',
            key: 'audit_status',
            render: (record) => (<Badge status={AuditStatusMap[record]} text={AUDIT_STATUS[record]} />),
            width:120
        }, {
            title: '上下架状态',
            dataIndex: 'publish_status',
            key: 'publish_status',
            width:120,
            render: (record) => (
                (<Badge status={GoodsStatusMap[record]} text={PUBLISH_STATUS[record]} />)
            )
        }, {
            title: '库存数量',
            key: "stock",
            width:120,
            render: (val) => (<span>{`${val.stock}`}</span>)
        }, {
            title: '最大入库限制',
            dataIndex: "goods_max_in",
            width:120,
            key: "goods_max_in",
        }, {
            title: '最大调拨限制',
            width:120,
            dataIndex: "goods_max_out",
            key: "goods_max_out",
        }, {
            title: "操作",
            width: 200,
            fixed: "right",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" style={{ textDecoration: "none" }}
                        disabled={record.audit_status !== 1}
                        onClick={() => onSetRestrict(record)}
                    >设置限制</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={() => onviewRecord(record)} style={{ textDecoration: "none" }}>查看记录</a>
                </span>
            ),
        }];
        const paginationOptions = {
            total,
            current,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true
        }
        return (
            <Table columns={columns} dataSource={data}
                rowKey={record => record.idx}
                scroll={{ x: 1600 }}
                loading={loading}
                pagination={paginationOptions}
                onChange={onstockTableChange}
            />
        )
    }
}