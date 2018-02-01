import React, { Fragment } from 'react';
import moment from 'moment';
import { Table } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'idx',
  },
  {
    title: '产品ID',
    dataIndex: 'no',
  },
  {
    title: '产品图片',
    dataIndex: 'pictures',
    render: val => val.map((item, idx) => (<img alt="缩略图" width={10} height={10} style={{ display: 'inline' }} key={`key${idx}`} src={item} />)),
  },
  {
    title: '产品名称',
    dataIndex: 'title',
  },
  {
    title: '型号',
    dataIndex: 'type',
    align: 'right',
    render: val => `${val}`,
  },
  {
    title: '一级类目',
    dataIndex: 'menu1',

  },
  {
    title: '二级类目',
    dataIndex: 'menu2',

  },
  {
    title: '三级类目',
    dataIndex: 'menu3',

  },
  {
    title: '品牌',
    dataIndex: 'band',

  },
  {
    title: '操作',
    render: () => (
      <Fragment>
        <a href="">关联</a>
      </Fragment>
    ),
  },
];

class ProductList extends React.Component {
  render() {
    const dataSource = this.props.data;
    return (
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    );
  }
}

export default ProductList;
