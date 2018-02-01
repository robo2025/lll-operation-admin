/*
 * @Author: lll 
 * @Date: 2018-01-26 14:08:45 
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-01 17:58:28
 */
import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './goods-table.less';

const AuditStatusMap = ['processing', 'success', 'error'];// 上下架状态
const GoodsStatusMap = ['default', 'success'];// 商品状态
class GoodsTable extends PureComponent {
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
        title: '商品ID编号',
        dataIndex: 'no',
      },
      {
        title: '商品图片',
        dataIndex: 'pictures',
        render: val => val.map((item, idx) => (<img width={10} height={10} style={{ display: 'inline' }} key={idx} src={item} />)),
      },
      {
        title: '商品名称',
        dataIndex: 'title',
      },
      {
        title: '型号',
        dataIndex: 'type',
        sorter: true,
        align: 'right',
        render: val => `${val} 万`,
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
        title: '价格（含税）',
        dataIndex: 'price',

      },
      {
        title: '审核状态',
        dataIndex: 'audit_status',
        filters: [
          {
            text: audit_status[0],
            value: 0,
          },
          {
            text: audit_status[1],
            value: 1,
          },
          {
            text: audit_status[2],
            value: 2,
          },
        ],
        render(val) {
          return <Badge status={AuditStatusMap[val]} text={audit_status[val]} />;
        },
      },
      {
        title: '上下架状态',
        dataIndex: 'good_status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
        ],
        render(val) {
          return <Badge status={GoodsStatusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '佣金比率',
        dataIndex: 'commission',
        render: val => <span>{`${val}%`}</span>,
      },
      {
        title: '商品提交时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: () => (
          <Fragment>
            <a>审核</a>
            <Divider type="vertical" />
            <a>下架</a>
            <Divider type="vertical" />
            <a href="#/goods/list/detail">查看</a>
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

export default GoodsTable;
