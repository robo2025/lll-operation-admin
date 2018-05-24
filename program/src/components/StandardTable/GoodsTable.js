/*
 * @Author: lll
 * @Date: 2018-01-26 14:08:45
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-24 16:02:36
 */
import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import { AUDIT_STATUS, PUBLISH_STATUS } from '../../constant/statusList';
import styles from './goods-table.less';

const AuditStatusMap = ['processing', 'success', 'error'];// 审核状态
const GoodsStatusMap = ['default', 'success', 'processing'];// 上下架状态

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
    const { data, loading, onPublish, defaultPage, total } = this.props;

    const columns = [{
      title: '商品ID',
      dataIndex: 'gno',
      width: 180,
      fixed: 'left',
    }, {
      title: '型号',
      dataIndex: 'partnumber',
      key: 'partnumber',
    }, {
      title: '商品名称',
      dataIndex: 'product',
      render: val => (<span >{val.product_name}</span>),
      key: 'product_name',
    }, {
      title: '三级类目',
      dataIndex: 'product',
      render: val => (<span >{val.category ? val.category.children.children.category_name : ''}</span>),
      key: 'category_name_3',
    }, {
      title: '品牌',
      dataIndex: 'product',
      render: val => (<span >{val.brand.brand_name}</span>),
      key: 'brand_name',
    }, {
      title: '单价（含税）',
      dataIndex: 'prices',
      key: 'price',
      render: val => (<span >{val.length > 0 ? `${val.slice(0)[0].price}-${val.slice(-1)[0].price}` : '无'}</span>),
    }, {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    }, {
      title: '审核状态',
      dataIndex: 'audit_status',
      key: 'audit_status',
      render: val => (<Badge status={AuditStatusMap[val]} text={AUDIT_STATUS[val]} />),
    }, {
      title: '上下架状态',
      dataIndex: 'publish_status',
      key: 'publish_status',
      render(val) {
        return <Badge status={GoodsStatusMap[val]} text={PUBLISH_STATUS[val]} />;
      },
    }, {
      title: '供应商公司名称',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
    }, {
      title: '商品提交时间',
      dataIndex: 'created_time',
      sorter: true,
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a href={`#/goods/list/detail?gno=${record.gno}&audit=1`}>审核</a>
          <Divider type="vertical" />
          <a
            onClick={() => onPublish(record.gno, 0)}
            disabled={(record.audit_status !== 1) || (record.publish_status === 0)}
          >
            下架
          </a>
          <Divider type="vertical" />
          <a href={'#/goods/list/detail?gno=' + record.gno}>查看</a>
        </Fragment>
      ),
      width: 150,
      fixed: 'right',
    }];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultCurrent: defaultPage >> 0 ? defaultPage >> 0 : 1,
      total,
      // ...pagination,
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
          loading={loading}
          rowKey={record => (record.gno ? record.gno : record.idx)}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 2000 }}
        />
      </div>
    );
  }
}

export default GoodsTable;
