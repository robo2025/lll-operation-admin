import React, { Component } from 'react';
import { Input, Table, Checkbox } from 'antd';

const { Search } = Input;
const columns = [{
  title: 'ID',
  dataIndex: 'id',
  key: 'id',
  align: 'center',
}, {
  title: '参数项名称',
  dataIndex: 'name',
  key: 'name',
  align: 'center',
}, {
  title: '单位',
  dataIndex: 'unit',
  key: 'unit',
  align: 'center',
}, {
  title: '参数值',
  dataIndex: 'value',
  key: 'value',
  align: 'center',
}, {
  title: '已有产品使用条数',
  dataIndex: 'association',
  align: 'center',
  key: 'association',
},
{
  title: '是否为筛选条件项',
  dataIndex: 'flag',
  key: 'flag',
  align: 'center',
  render: text => (<span><Checkbox defaultChecked={text} /></span>),
}];
const fakeData = [{
  id: 'C123456',
  name: '电压',
  unit: 'A',
  value: '0.5,1.2',
  association: 9,
  flag: true,
}];

export default class FilterContent extends Component {
  render() {
    return (
      <div className="filter-wrap">
        <div style={{ marginBottom: 20 }}>
          参数项目名称：
          <Search
            placeholder="请输入你要搜索的参数"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
        </div>
        <Table
          dataSource={fakeData}
          columns={columns}
        />
      </div>
    );
  }
}
