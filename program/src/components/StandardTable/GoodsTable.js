/*
 * @Author: lll
 * @Date: 2018-01-26 14:08:45
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-06 11:51:17
 */
import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './goods-table.less';

const AuditStatusMap = ['processing', 'success', 'error'];// 审核状态
const auditStatus = ['待审核', '已通过', '未通过'];
const GoodsStatusMap = ['default', 'success'];// 上下架状态
const status = ['下架中', '已上架'];
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
    const { data, loading, onPublish } = this.props;

    const columns = [
      {
        title: '商品ID编号',
        dataIndex: 'gno',
        width: 120,
        fixed: 'left',
      },
      {
        title: '商品图片',
        dataIndex: 'product',
        render: (val) => {
          return val.pics ? (
            val.pics.map((item, idx) => {
              if (idx < 3) {
                return (
                  <img
                    className="goods-thumb"
                    alt={item.img_tyle}
                    key={idx}
                    src={item.img_url}
                  />);
              }
            })
          ) : null;
        },
        width: 150,
        fixed: 'left',
      },
      {
        title: '商品名称',
        dataIndex: 'product',
        render: val => (<span >{val.product_name}</span>),
        key: 'product_name',
        fixed: 'left',
      },
      {
        title: '型号',
        dataIndex: 'product',
        sorter: true,
        align: 'right',
        render: val => (<span >{val.partnumber}</span>),
        key: 'partnumber',
      },
      {
        title: '一级类目',
        dataIndex: 'product',
        render: val => (<span >{val.category ? val.category.category_name : ''}</span>),
        key: 'category_name_1',
      },
      {
        title: '二级类目',
        dataIndex: 'product',
        render: val => (<span >{val.category ? val.category.children.category_name : ''}</span>),
        key: 'category_name_2',
      },
      {
        title: '三级类目',
        dataIndex: 'product',
        render: val => (<span >{val.category ? val.category.children.children.category_name : ''}</span>),
        key: 'category_name_3',
      },
      {
        title: '品牌',
        dataIndex: 'product',
        render: val => (<span >{val.brand_name}</span>),
        key: 'brand_name',
      },
      {
        title: '价格（含税）',
        dataIndex: 'prices',
        render: val => (<span >{val[0].price}</span>),
        key: 'price',
      },
      {
        title: '审核状态',
        dataIndex: 'audit_status',
        filters: [
          {
            text: auditStatus[0],
            value: 0,
          },
          {
            text: auditStatus[1],
            value: 1,
          },
          {
            text: auditStatus[2],
            value: 2,
          },
        ],
        render: val => (<Badge status={AuditStatusMap[val]} text={auditStatus[val]} />),
      },
      {
        title: '上下架状态',
        dataIndex: 'is_publish',
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
        render: () => <span>0.5%</span>,
      },
      {
        title: '商品提交时间',
        dataIndex: 'created_time',
        sorter: true,
        render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a href={'#/goods/list/detail?goodId=' + record.id}>审核</a>
            <Divider type="vertical" />
            <a
              onClick={() => onPublish(record.id, 0)}
              disabled={(record.audit_status !== 1) || (record.is_published === 0)}
            >
              下架
            </a>
            <Divider type="vertical" />
            <a href={'#/goods/list/detail?goodId=' + record.id}>查看</a>
          </Fragment>
        ),
        width: 150,
        fixed: 'right',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      // ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    if (data.length < 1) {
      return (<div>没有数据</div>);
    } else {
      console.log('-------------', data, loading);
    }

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
          loading={loading}
          rowKey={record => record.gno}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 1800 }}
        />
      </div>
    );
  }
}

export default GoodsTable;
