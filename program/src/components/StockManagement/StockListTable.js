import React from 'react';
import { Table } from 'antd';

export default class StockListTabel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data, total } = this.props;
        const dataSource = [];
        const columns = [{
            title: '序号',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '商品ID',
            dataIndex: 'goods_id',
            key: 'goods_id',
        }, {
            title: '产品名称',
            dataIndex: 'goods_name',
            key: 'goods_name',
        }, {
            title: '产品型号',
            dataIndex: 'goods_model',
            key: 'goods_model',
        }, {
            title: '供应商名称',
            dataIndex: 'user_name',
            key: 'user_name',
        }, {
            title: '品牌',
            dataIndex: 'goods_brand_name',
            key: 'goods_brand_name',
        }, {
            title: '产地',
            dataIndex: 'goods_origin',
            key: 'goods_origin',
        }, {
            title: '审核状态',
            dataIndex: 'audit_status',
            key: 'audit_status',
        }, {
            title: '上下架状态',
            dataIndex: 'is_put',
            key: 'is_put',
        }, {
            title: '库存数量',
            dataIndex: 'goods_current_count',
            key: 'goods_current_count',
        }, {

        }
        ];
        return (
            <div>
                {/* <Table dataSource={} columns={columns} /> */}
            </div>
        )
    }
}