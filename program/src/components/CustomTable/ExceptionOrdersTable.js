import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Divider, Dropdown, Menu, Icon, Badge } from 'antd';
import styles from './order-table.less';
import OrderTableData from './orderTableData'; // 假数据

const PROGRESS_STATUS = ['error', 'success'];
const PROGRESS_TEXT = ['未处理', '已处理'];
// 订单状态
const mapOrderStatus = ['全部', '待支付', '已取消', '已接单', '待发货', '已发货', '已确认收货', '已完成', '申请延期', '确认延期', '退款', '退货', '作废', '无货'];
// 责任方
const mapOrderResponsible = ['客户', '供应商', '平台'];
const mapExceptionStatus = ['无货', '延期发货'];// 异常状态标签
const mapDealStatus = ['未处理', '已处理'];

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
        width: 200,
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
        render: text => (<span>{text}天</span>),
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
        width: 180,
        render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD h:mm:ss')}</span>,        
      },
      {
        title: '佣金(元)',
        dataIndex: 'commission',
        key: 'commission',
      },
      {
        title: '是否接单',
        dataIndex: 'is_taking',
        key: 'is_taking',
        render: text => (<span>{text ? '是' : '否'}</span>),
      },
      {
        title: '是否发货',
        dataIndex: 'is_delivery',
        key: 'is_delivery',
        render: text => (<span>{text ? '是' : '否'}</span>),
      },
      {
        title: '订单状态',
        dataIndex: 'order_status',
        key: 'order_status',
        width: 150,        
        render: text => (<span>{mapOrderStatus[text]}</span>),
      },
      {
        title: '责任方',
        dataIndex: 'responsible_party',
        key: 'responsible_party',
        render: text => (<span>{mapOrderResponsible[text + 1]}</span>),
      },
      {
        title: '异常状态标签',
        dataIndex: 'abnormal_tag',
        key: 'abnormal_tag',
        render: text => (<span>{mapExceptionStatus[text - 1]}</span>),
      },
      {
        title: '处理状态',
        dataIndex: 'is_deal',
        key: 'is_deal',
        render: text => (
          <span>
            <Badge status={PROGRESS_STATUS[text]} />
            {mapDealStatus[text]}
          </span>
        ),
      },
      {
        title: '异常提交时间',
        dataIndex: 'abnormal_add_time',
        key: 'abnormal_add_time',
        width: 180,
        sorter: true,
        render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD h:mm:ss')}</span>,
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
            {record.abnormal_tag === 1
            ?
            (<a href={'#/orders/exception-list/sold-out-order?orderId=' + record.id}>查看</a>)
            :
            (<a href={'#/orders/exception-list/delay-order?orderId=' + record.id}>查看</a>)
            }
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
          rowKey="id"
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
