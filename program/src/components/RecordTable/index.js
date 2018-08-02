import React, { Component } from 'react';
import { Card, Table } from 'antd';
import moment from 'moment';

const ACTION_FLAG_STATUS = {
    1: ' 添加',
    2: '修改',
    4: '审核',
    8: '发布',
    16: '删除',
};
export default class RecordTable extends Component {
    render() {
        const { dataSource, ...others } = this.props;
        const columns = [
            {
                title: '序号',
                key: 'id',
                render: (text, record, index) => index + 1,
              },
              {
                title: '操作人',
                dataIndex: 'creator_id',
                key: 'creator_id',
              },
              {
                title: '操作',
                dataIndex: 'action_flag',
                key: 'action_flag',
                render: text => ACTION_FLAG_STATUS[text],
              },
              {
                title: '执行描述',
                dataIndex: 'change_message',
                key: 'change_message',
              },
              {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
                render: text => text || '-',
              },
              {
                title: '时间',
                dataIndex: 'created_time',
                key: 'created_time',
                render: text => moment.unix(text).format('YYYY-MM-DD HH:mm:ss'),
              },
        ];
        return (
            <Card title="操作记录" style={{ marginTop: 24 }}>
            <Table columns={columns} dataSource={dataSource} {...others} />
            </Card>
        );
    }
}
