import React, { Component } from 'react';
import { Card, Table } from 'antd';
import moment from 'moment';

export default class SubAccountList extends Component {
  render() {
    const { dataSource } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render: (text, record, index) => index + 1,
      },
      {
        title: '子帐号帐号',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'profile.realname',
        key: 'profile.realname',
      },
      {
        title: '联系方式',
        dataIndex: 'mobile',
        key: 'mobile',
        render: text => text || '-',
      },
      {
        title: '岗位',
        dataIndex: 'profile.position',
        key: 'profile.position',
        render: text => text || '-',
      },
      {
        title: '创建日期',
        dataIndex: 'created_time',
        key: 'created_time',
        render: text => moment.unix(text).format('YYYY-MM-DD HH:mm:ss'),
      },
    ];
    return (
      <Card title="子帐号信息" style={{ marginTop: 24 }}>
        <Table columns={columns} dataSource={dataSource} />
      </Card>
    );
  }
}
