import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Divider, Dropdown, Menu, Icon } from 'antd';
import styles from './order-table.less';
import OrderTableData from './orderTableData'; // 假数据

export default class ExceptionOrdersTable extends React.Component {
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
handleOrderClick = ({ key }) => {
  const [modalKey, orderKey] = key.split('-');
  this.props.onHandleOrderClick(modalKey, orderKey);
}

  render() {
    const { selectedRowKeys, totalCallNo, isShowModal } = this.state;
    const { data, loading } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 60,
        fixed: 'left',
      },
      {
        title: '客户订单编号',
        dataIndex: 'order_sn',
        key: 'order_sn',
        width: 120,
        fixed: 'left',
      },
      {
        title: '供应商公司名称',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        width: 130,
        fixed: 'left',
      },
      {
        title: '客户公司名称',
        dataIndex: 'guest_name',
        align: 'guest_name',
        width: 130,
        fixed: 'left',
        render: val => `${val}`,
      },
      {
        title: '最大发货日期',
        dataIndex: 'max_delivery_time',
        key: 'max_delivery_time-1',
      },
      {
        title: '交易总金额(元)',
        dataIndex: 'total_money',
        key: 'total_money',
      },
      {
        title: '下单时间',
        dataIndex: 'add_time',
        key: 'add_time',
        render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>,        
      },
      {
        title: '佣金(元)',
        dataIndex: 'commission',
        key: 'commission',
      },
      {
        title: '是否接单',
        dataIndex: 'sfjd',
        key: 'sfjd',
      },
      {
        title: '是否发货',
        dataIndex: 'sffh',
        key: 'sffh',
      },
      {
        title: '订单状态',
        dataIndex: 'order_status',
        key: 'order_status',
      },
      {
        title: '责任方',
        dataIndex: 'commission',
        key: 'commission',
      },
      {
        title: '异常状态标签',
        dataIndex: 'commission',
        key: 'commission',
      },
      {
        title: '处理状态',
        dataIndex: 'commission',
        key: 'commission',
      },
      {
        title: '异常提交时间',
        dataIndex: 'add_time',
        key: 'add_time',
        sorter: true,
        render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <Dropdown 
            overlay={(
              <Menu onClick={(key) => { this.handleOrderClick(key); }}>
                <Menu.Item key={`1-${text.id}`}>修改并推送</Menu.Item>
                <Menu.Item key={`2-${text.id}`}>同意并退款</Menu.Item>
                <Menu.Item key={`3-${text.id}`}>无货驳回</Menu.Item>
              </Menu>
            )}
            >
              <a className="ant-dropdown-link">
                处理<Icon type="down" />
              </a>
            </Dropdown>
            <Divider type="vertical" />
            <a href={'#/orders/detail?orderId=' + record.id}>查看</a>
          </Fragment>
        ),
        width: 150,
        fixed: 'right',
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
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={OrderTableData}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 1800 }}
        />
      </div>
    );
  }
}
