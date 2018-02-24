import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './product-table.less';

const AuditStatusMap = ['processing', 'success', 'error'];// 上下架状态
const GoodsStatusMap = ['default', 'success'];// 商品状态


class ProductTable extends React.Component {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data, loading } = this.props;

    const audit_status = ['待审核', '审核通过', '审核不通过'];
    const status = ['下架中', '已上架'];

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'ID编号',
        dataIndex: 'pno',
        key: 'pno',
      },
      {
        title: '产品图片',
        dataIndex: 'pics',
        render: val => val.map((item, idx) => (<img alt="缩略图" width={10} height={10} style={{ display: 'inline' }} key={`key${idx}`} src={item.img_url} />)),
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
        render: val => (val.category_name),
        key: 'menu-1',
      },
      {
        title: '二级类目',
        dataIndex: 'category',
        render: val => (val.children.category_name),
        key: 'menu-2',
      },
      {
        title: '三级类目',
        dataIndex: 'category',
        render: val => (val.children.children.category_name),
        key: 'menu-3',        
      },
      {
        title: '四级类目',
        dataIndex: 'category',
        render: val => (val.children.children.children.category_name),
        key: 'menu-4',        
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',

      },
      {
        title: '已有供应商条数',
        dataIndex: 'goods_count',

      },
      {
        title: '创建人',
        dataIndex: 'staff_name',

      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
        sorter: true,
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.props.editProduct(record.id); }}>修改</a>
            <Divider type="vertical" />
            <a>供货消息</a>
          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          className={styles['goods-table']}
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default ProductTable;
