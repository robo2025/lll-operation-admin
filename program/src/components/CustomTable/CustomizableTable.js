import React from 'react';
import { Table } from 'antd';
import styles from './order-table.less';


export default class CustomizableTable extends React.Component {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
    isShowModal: false,
  };

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

  // 订单处理点击：催货、订单取消、收货延期
  handleOrderClick = (key) => {
    const [modalKey, orderKey] = key.split('-');
    this.props.onHandleOrderClick(modalKey, orderKey);
  }

  render() {
    const { selectedRowKeys, totalCallNo, isShowModal } = this.state;
    const { data, columns, loading, total } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
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
        <Table
          loading={loading}
          rowKey={record => record.id}
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
