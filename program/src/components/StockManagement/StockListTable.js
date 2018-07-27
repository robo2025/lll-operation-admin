import React from 'react';
import { Table, Badge } from 'antd';
import { AUDIT_STATUS, PUBLISH_STATUS } from '../../constant/statusList';

const AuditStatusMap = ['processing', 'success', 'error'];// 审核状态
const GoodsStatusMap = ['default', 'success', 'processing'];// 上下架状态
export default class StockListTabel extends React.Component {
    onStockTableChange=(pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    }
    viewStockRecord=(values) => {
        const { onViewRecord } = this.props;
        onViewRecord(values);
    }
    render() {
        const { data, total, loading, current, pageSize } = this.props;
        data.map((ele, idx) => {
            return { ...ele, idx: idx + 1 };
        });
        
        const columns = [{
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
        }, {
            title: '商品ID',
            dataIndex: 'gno',
            key: 'gno',
        }, {
            title: '产品名称',
            dataIndex: 'product_name',
            key: 'product_name',
        }, {
            title: '产品型号',
            dataIndex: 'partnumber',
            key: 'partnumber',
        }, {
            title: '供应商名称',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
        }, {
            title: '品牌',
            dataIndex: 'brand_name',
            key: 'brand_name',
        }, {
            title: '产地',
            dataIndex: 'registration_place',
            key: 'registration_place',
        }, {
            title: '审核状态',
            dataIndex: 'audit_status',
            key: 'audit_status',
            render: record => (<Badge status={AuditStatusMap[record]} text={AUDIT_STATUS[record]} />),
        }, {
            title: '上下架状态',
            dataIndex: 'publish_status',
            key: 'publish_status',
            render: record => (
                (<Badge status={GoodsStatusMap[record]} text={PUBLISH_STATUS[record]} />)
            ),
        }, {
            title: '库存数量',
            key: 'stock',
            render: val => <span>{`${val.stock}`}</span>,
        }, {
            title: '操作',
            key: 'view',
            fixed: 'right',
            width: 130,
            render: (text, record) => (
                <a href=" javascript:;" style={{ textDecoration: 'none' }} onClick={() => this.viewStockRecord(record)}>查看记录</a>
            ),
        },
        ];
        const paginationOptions = {
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            current,
            pageSize,
            
        };
        return (
            <div>
                <Table
dataSource={data}
columns={columns} 
                rowKey={record => record.idx}
                pagination={paginationOptions}
                onChange={this.onStockTableChange}
                loading={loading}
                scroll={{ x: 1500 }}
                />
            </div>
        );
    }
}
