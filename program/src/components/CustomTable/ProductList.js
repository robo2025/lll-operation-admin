import React, { Fragment } from 'react';
import { Table } from 'antd';


class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 60,
      },
      {
        title: '产品ID编号',
        dataIndex: 'pno',
        key: 'pno',
        width: 120,
      },
      {
        title: '产品图片',
        dataIndex: 'pics',
        width: 150,
        render: val => val.map((item, idx) => {
          if (idx < 3) {
            return (
              <img
                alt="缩略图"
                width={20}
                height={20}
                style={{ display: 'inline', marginRight: 5 }}
                key={`key${idx}`}
                src={item.img_url}
              />
            );
          }
        }
        ),
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        key: 'product_name',
      },
      {
        title: '型号',
        dataIndex: 'partnumber',
        align: 'partnumber',
        render: val => `${val}`,
      },
      {
        title: '一级类目',
        dataIndex: 'category',
        key: 'menu1',
        width: 100,
        render: val => (val.category_name),
      },
      {
        title: '二级类目',
        dataIndex: 'category',
        key: 'menu2',
        width: 100,
        render: val => (val.children.category_name),
      },
      {
        title: '三级类目',
        dataIndex: 'category',
        key: 'menu3',
        width: 100,
        render: val => (val.children.children.category_name),
      },
      {
        title: '品牌',
        width: 60,
        dataIndex: 'brand_name',
      },
      {
        title: '操作',
        width: 60,
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.props.onAssociate(record.id); }}>关联</a>
          </Fragment>
        ),
      },
    ];
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { data, total, loading } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 8,
      pageSizeOptions: [8, 16, 24, 32, 40],
      total,
    };

    return (
      <div>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={data}
          rowKey={record => (`${record.pno}-${record.id}`)}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default ProductList;
