import React, { Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Divider, Modal } from 'antd';
import SupplyInformation from '../../components/SupplyInformation/SupplyInformation';
import styles from './product-table.less';

class ProductTable extends React.Component {
  state = {
    selectedRowKeys: [],
    isShowModal: false,
    productId: '',
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }


  // 关闭供货信息弹窗
  onCancel = () => {
    this.setState({ isShowModal: false });
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  // 点击供货信息
  handleSupplyInfoBtnClick = (productId) => {
    this.setState({ isShowModal: true, productId });
    this.props.querySupplyInfo(productId);
  }

  render() {
    const { selectedRowKeys, isShowModal } = this.state;
    const { data, loading, total, isShowAlert, defaultPage,current,pageSize } = this.props;

    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
      render: (record, text, idx) => (<span>{idx + 1}</span>),
    }, {
      title: '产品ID',
      dataIndex: 'pno',
      key: 'pno',
      width: 110,
      fixed: 'left',
    }, {
      title: '产品图片',
      dataIndex: 'pics',
      render: val => val.map((item, idx) => {
        if (idx < 3) {
          return (
            <img
              className="product-thumb"
              alt={item.img_tyle}
              key={idx}
              src={item.img_url}
            />);
        }
      }),
      width: 150,
      fixed: 'left',
    }, {
      title: '产品名称',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 400,
    }, {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand_name',
      width: 100,
      render: text => (<span>{text ? text.brand_name : '' }</span>),
    }, {
      title: '产地',
      dataIndex: 'brand',
      key: 'registration_place',
      width: 100,
      render: text => (<span>{text ? text.registration_place : ''}</span>),
    }, {
      title: '一级类目',
      dataIndex: 'category',
      render: val => (val.category_name),
      width: 100,
      key: 'menu-1',
    }, {
      title: '二级类目',
      dataIndex: 'category',
      render: val => (val.children.category_name),
      width: 120,
      key: 'menu-2',
    }, {
      title: '三级类目',
      dataIndex: 'category',
      render: val => (val.children.children.category_name),
      width: 150,
      key: 'menu-3',
    }, {
      title: '已有产品型号数',
      dataIndex: 'model_count',
      width: 130,
    }, {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      render: (text, record) => (<span>{text}({record.creator_id})</span>),
    }, {
      title: '创建时间',
      dataIndex: 'created_time',
      sorter: true,
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a href={'#/product/list/detail?pno=' + record.pno}>查看</a>
          <Divider type="vertical" />
          <a href={'#/product/list/modify?pno=' + record.pno}>修改</a>
        </Fragment>
      ),
      width: 120,
      fixed: 'right',
    }];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultCurrent: defaultPage - 0 || 1,
      total,
      current,
      pageSize,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.model_count >= 1,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          {
            isShowAlert ?
              (
                <Alert
                  message={(
                    <div>
                      已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
                    </div>
                  )}
                  type="info"
                  showIcon
                />
              )
              :
              null
          }
        </div>
        <Table
          loading={loading}
          rowKey={record => record.pno}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 2000 }}
        />
        {/* 供货信息 */}
        <Modal
          width="60%"
          visible={isShowModal}
          title="供货信息"
          okText=""
          cancelText=""
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <SupplyInformation productId={this.state.productId} />
        </Modal>
      </div>
    );
  }
}

export default ProductTable;
