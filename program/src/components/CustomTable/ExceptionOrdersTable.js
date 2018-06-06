import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Divider, Dropdown, Menu, Icon, Badge } from 'antd';
import styles from './order-table.less';

const PROGRESS_STATUS = ['error', 'success'];
// 订单状态
const mapOrderStatus = ['待支付', '已取消', '待接单', '待发货', '已发货,配送中',
  '已完成', '', '申请延期中', '', '退款中',
  '退货中', '作废', '无货', '退款完成', '退货完成',
  '订单流转结束'];
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
  handleOrderClick = ({ modalKey, orderId, data }) => {
    this.props.onHandleOrderClick(modalKey, orderId, data);
  }

  render() {
    const { selectedRowKeys, totalCallNo, isShowModal } = this.state;
    const { data, loading, total } = this.props;

    const Actions = ({ code, text, onClick }) => {
      if (code === 13) { // 无货
        return (
          <Dropdown
            disabled={text.is_deal}
            overlay={(
              <Menu
                onClick={({ key }) => { onClick({ modalKey: key, orderId: text.id, data: text }); }}
              >
                {/* <Menu.Item key={`1-${text.id}`}>修改并推送</Menu.Item> */}
                <Menu.Item key="2">同意并退款</Menu.Item>
                <Menu.Item key="3">无货驳回</Menu.Item>
              </Menu>
            )}
          >
            <a className="ant-dropdown-link">
              处理<Icon type="down" />
            </a>
          </Dropdown>
        );
      } else if (code === 8) { // 申请延期
        return (
          <Dropdown
            disabled={text.is_deal}
            overlay={(
              <Menu
                onClick={({ key }) => { onClick({ modalKey: key, orderId: text.id, data: text }); }}
              >
                {/* <Menu.Item key={`1-${text.id}`}>修改并推送</Menu.Item> */}
                <Menu.Item key="4">同意延期</Menu.Item>
                <Menu.Item key="5">取消订单</Menu.Item>
              </Menu>
            )}
          >
            <a className="ant-dropdown-link">
              处理<Icon type="down" />
            </a>
          </Dropdown>
        );
      } else {
        return (<span style={{ display: 'inline-block', width: 40 }} />);
      }
    };

    const columns = [{
      title: '序号',
      dataIndex: 'idx',
      key: 'idx',
      width: 60,
      fixed: 'left',
      render: (text, record, idx) => (<span>{idx + 1}</span>),
    }, {
      title: '商品订单号',
      dataIndex: 'son_order_sn',
      key: 'son_order_sn',
      width: 200,
      fixed: 'left',
    }, {
      title: '订单号',
      dataIndex: 'order_sn',
      key: 'sorder_sn',
      width: 200,
    }, {
      title: '供应商公司名称',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 130,
    }, {
      title: '客户公司名称',
      dataIndex: 'guest_name',
      align: 'guest_name',
      width: 130,
      render: val => `${val}`,
    }, {
      title: '最大发货日期',
      dataIndex: 'max_delivery_time',
      key: 'max_delivery_time-1',
      render: text => (<span>{text}天</span>),
    }, {
      title: '交易总金额(元)',
      dataIndex: 'total_money',
      key: 'total_money',
    }, {
      title: '下单时间',
      dataIndex: 'add_time',
      key: 'add_time',
      width: 180,
      render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: '佣金(元)',
      dataIndex: 'commission',
      key: 'commission',
    }, {
      title: '是否接单',
      dataIndex: 'is_taking',
      key: 'is_taking',
      render: text => (<span>{text ? '是' : '否'}</span>),
    }, {
      title: '是否发货',
      dataIndex: 'is_delivery',
      key: 'is_delivery',
      render: text => (<span>{text ? '是' : '否'}</span>),
    }, {
      title: '责任方',
      dataIndex: 'responsible_party',
      key: 'responsible_party',
      render: text => (<span>{mapOrderResponsible[text - 1]}</span>),
    }, {
      title: '订单状态',
      dataIndex: 'order_status',
      key: 'order_status',
      width: 150,
      render: text => (<span>{mapOrderStatus[text - 1]}</span>),
    }, {
      title: '异常提交时间',
      dataIndex: 'abnormal_add_time',
      key: 'abnormal_add_time',
      width: 180,
      sorter: true,
      render: val => <span>{moment(Math.floor(val * 1000)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: '异常状态标签',
      dataIndex: 'abnormal_tag',
      key: 'abnormal_tag',
      fixed: 'right',
      render: text => (<span>{mapExceptionStatus[text - 1]}</span>),
    }, {
      title: '处理状态',
      dataIndex: 'is_deal',
      key: 'is_deal',
      fixed: 'right',
      render: text => (
        <span>
          <Badge status={PROGRESS_STATUS[text]} />
          {mapDealStatus[text]}
        </span>
      ),
    }, {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {
            Actions({ code: text.order_status, text, onClick: this.handleOrderClick })
          }

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
    }];

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
          rowKey="id"
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 2200 }}
        />
      </div>
    );
  }
}
