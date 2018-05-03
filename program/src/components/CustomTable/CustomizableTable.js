import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Alert } from 'antd';
import styles from './order-table.less';


export default class CustomizableTable extends React.Component {
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { data, columns, loading, total, rowSelection, scroll } = this.props;
    const { selectedRowKeys } = rowSelection;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  清空
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => (record.id ? record.id : record.created_time)}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={scroll || { x: 1800 }}
        />
      </div>
    );
  }
}

CustomizableTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};
