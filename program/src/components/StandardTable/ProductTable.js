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
    const { data: { list, pagination }, loading } = this.props;

    const audit_status = ['待审核', '审核通过', '审核不通过'];
    const status = ['下架中', '已上架'];

    const columns = [
      {
        title: '序号',
        dataIndex: 'idx',
      },
      {
        title: '产品ID编号',
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
        title: '原产品ID',
        dataIndex: 'productId',

      },
      {
        title: '已有供应商条数',
        dataIndex: 'good_status',

      },
      {
        title: '创建人',
        dataIndex: 'create_man',

      },
      {
        title: '产品创建时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">修改</a>
            <Divider type="vertical" />
            <a href="">供货消息</a>
          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
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
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                服务调用总计 <span style={{ fontWeight: 600 }}>{totalCallNo}</span> 万
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          className={styles['goods-table']}
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default ProductTable;
