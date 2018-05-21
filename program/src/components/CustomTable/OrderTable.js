import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Divider, Dropdown, Menu, Icon } from 'antd';
import styles from './order-table.less';
import OrderTableData from './orderTableData'; // 假数据

// 订单状态
const mapOrderStatus = ['待支付', '已取消', '待接单', '待发货', '已发货,配送中',
  '已完成', '', '申请延期中', '', '退款中',
  '退货中', '作废', '无货', '退款完成', '退货完成',
  '订单流转结束'];
// 支付状态
const mapPayStatus = ['全部', '未支付', '已支付'];

export default class OrderTable extends React.Component {
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
    const { data, defaultPage, loading, total } = this.props;

    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
      render: (text, record, idx) => (<span>{idx + 1}</span>),
    }, {
      title: '客户订单编号',
      dataIndex: 'son_order_sn',
      key: 'son_order_sn',
      width: 200,
      fixed: 'left',
    }, {
      title: '母订单编号',
      dataIndex: 'order_sn',
      key: 'order_sn',
      width: 200,
    }, {
      title: '供应商公司名称',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 150,
    }, {
      title: '客户公司名称',
      dataIndex: 'guest_name',
      align: 'guest_name',
      width: 150,
      render: val => `${val}`,
    }, {
      title: '最大发货日期',
      dataIndex: 'max_delivery_time',
      key: 'max_delivery_time',
      width: 150,
      render: text => (<span>{text}天</span>),
    }, {
      title: '交易总金额(元)',
      dataIndex: 'total_money',
      width: 150,
      key: 'total_money',
    }, {
      title: '支付状态',
      dataIndex: 'pay_status',
      key: 'pay_status',
      width: 150,
      render: text => (<span>{mapPayStatus[text]}</span>),
    }, {
      title: '佣金(元)',
      dataIndex: 'commission',
      width: 150,
      key: 'commission',
    }, {
      title: '下单时间',
      dataIndex: 'add_time',
      key: 'add_time',
      sorter: true,
      render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: '订单状态',
      dataIndex: 'order_status',
      key: 'order_status',
      width: 100,
      fixed: 'right',
      render: text => (<span>{mapOrderStatus[text - 1]}</span>),
    }, {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {/* <Dropdown 
            overlay={(
              <Menu onClick={(key) => { this.handleOrderClick(key); }}>
                <Menu.Item key={`1-${text.id}`}>催单</Menu.Item>
                <Menu.Item key={`2-${text.id}`}>订单取消</Menu.Item>
                <Menu.Item key={`3-${text.id}`}>收货延期</Menu.Item>
              </Menu>
            )}
            >
              <a className="ant-dropdown-link">
                订单处理<Icon type="down" />
              </a>
            </Dropdown> */}
          <a onClick={() => { this.handleOrderClick(`2-${text.id}`); }} disabled={![1, 3].includes(text.order_status)}>订单取消</a>
          <Divider type="vertical" />
          <a href={'#/orders/list/detail?orderId=' + record.id}>查看</a>
        </Fragment>
      ),
      width: 150,
      fixed: 'right',
    },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPage: defaultPage || 1,
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
