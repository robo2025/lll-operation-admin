import React from 'react';
import moment from 'moment';
import {Form, Table, Button} from 'antd';
export default class ContractCompanyTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
   
    render(){
        const {data,total} = this.props;
        const columns = [
            {
                title:"序号",
                key:"idx",
                render:(text,record,index) => index+1
            },
            {
                title:"账号",
                key:"username",
                dataIndex:'username'
            },
            {
                title:"企业名称",
                key:"company",
                render:record => record.profile.company
            },
            {
                title:"法人",
                key:"legal",
                render:record => record.profile.legal
            },
            {
                title:"手机",
                key:"mobile",
                dataIndex:'mobile'
            },
            {
                title:"邮箱",
                key:"email",
                dataIndex:'email'
            },
            {
                title:"注册日期",
                key:"created_time",
                dataIndex:'created_time',
                render:(val) => moment(val*1000).format("YYYY-MM-DD HH:mm:ss")
            },
            {
                title:"操作",
                key:"operation",
                render:()=><a href="javascript:;">选择</a>
            },
        ]
        return(
            <Table columns={columns} dataSource={data}
            />
        )
    }
}