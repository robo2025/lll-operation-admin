import React from 'react';
import {Table} from 'antd';

export default class GoodStockRecordTable extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const {total,data,loading,onRecordTableChange,current,columns} = this.props;
        data.map((ele,idx) => {
            ele.idx = idx+1;
        })
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