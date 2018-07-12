import React from 'react';
import moment from 'moment';
import {Table} from 'antd';
import {STOCK_OPERATION_STATUS} from "../../constant/statusList"
export default class GoodStockRecordTable extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const {total,data,loading,onRecordTableChange,current} = this.props;
        data.map((ele,idx) => {
            ele.idx = idx+1;
        })
        const columns = [{
            title:"序号",
            dataIndex:"idx",
            key:'idx'
        },{
            title:"单号",
            dataIndex:'order_id',
            key:"order_id"
        },{
            title:"操作类型",
            dataIndex:"change_option",
            key:'change_option',
            render:(val) => <span>{STOCK_OPERATION_STATUS[val]}</span>
        },{
            title:"库存变动数量",
            dataIndex:"change_count",
            key:"change_count"
        },{
            title:"操作时间",
            dataIndex:"add_time",
            key:'add_time',
            render:(val)=><span>{moment(val*1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        }]
        const paginationOptions ={
            total,
            showQuickJumper:true,
            current
        }
        return(
            <Table columns={columns} dataSource={data}
            loading={loading}
            rowKey={record=>record.idx}
            pagination={paginationOptions}
            onChange={onRecordTableChange}
            />
        )
    }
}