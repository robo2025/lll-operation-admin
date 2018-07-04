import React, { Component, Fragment } from 'react';
import moment from 'moment';
import qs from 'qs';
import { connect } from 'dva';
import { Card, Row, Col, Form, Input, Button, Icon, Divider, Popconfirm, message,DatePicker } from 'antd';
import { PAGE_SIZE } from '../../constant/config';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CustomizableTable from '../../components/CustomTable/CustomizableTable';

import styles from './style.less';
import { handleServerMsgObj } from '../../utils/tools';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ brand, loading }) => ({
  brand,
  loading,
}))
@Form.create()
export default class BrandList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      args: qs.parse(props.location.search || {page:1,pageSize:10}, { ignoreQueryPrefix: true }),
      searchValues:{}
    };
    this.columns = [{
      title: '序号',
      dataIndex: 'idx',
      key: 'idx',
      width: 60,
      fixed: 'left',
      render: (text, record, idx) => (<span>{idx + 1}</span>),
    }, {
      title: '品牌',
      dataIndex: 'brand_name',
      key: 'brand_name',
      width: 120,
      fixed: 'left',
    }, {
      title: '英文名',
      dataIndex: 'english_name',
      key: 'english_name',
      width: 120,
      fixed: 'left',
    }, {
      title: '注册地',
      dataIndex: 'registration_place',
      key: 'registration_place',
    }, {
      title: 'LOGO',
      dataIndex: 'logo_url',
      key: 'logo_url',
      render: text => (<img src={text} alt="logo" width={50} height={50} />),
    }, {
      title: '已关联产品数',
      dataIndex: 'product_count',
      key: 'product_count',
    }, {
      title: '创建日期',
      dataIndex: 'created_time',
      key: 'created_time',
      render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>),
    }, {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Fragment>
          <a href={`#/brand/list/modify?bno=${record.bno}`}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => { this.removeBrand(record.bno); }}
          >
            <a disabled={record.product_count > 0}>
              删除
            </a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href={`#/brand/list/detail?bno=${record.bno}`}>查看</a>
        </Fragment>
      ),
      width: 150,
      fixed: 'right',
    }];
  }


  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;

    dispatch({
      type: 'brand/fetch',
      offset: (args.page - 1) * args.pageSize,
      limit: args.pageSize,
    });
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 处理表格变化
  handleCustomizableTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, history } = this.props;
    const {searchValues} =  this.state;
    const params = {
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };

    // 分页：将页数提取到url上
    history.replace({
      search: `?page=${pagination.current}&pageSize=${pagination.pageSize}`,
    });
    this.setState({
        args:{
            page:pagination.current,
            pageSize:pagination.pageSize
        }
    })
    dispatch({
      type: 'brand/fetch',
      offset: params.offset,
      limit: params.pageSize,
      params:searchValues
    });
  }

  removeBrand = (bno) => {
    const { dispatch,history } = this.props;
    const {args,searchValues} = this.state;
    dispatch({
      type: 'brand/remove',
      bno,
      success: () => { 
          message.success('删除成功');
          history.replace({
            search: `?page=1&pageSize=${args.pageSize}`,
          });
          this.setState({
              args:{
                  page:1,
                  pageSize:args.pageSize
              }
          })
          dispatch({
            type: 'brand/fetch',
            offset: 0,
            limit: args.pageSize,
            params:searchValues
          });
         },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    const {form,history,dispatch} = this.props;
    const {args} = this.state;
    form.validateFields((err,fieldsValue) => {
        const createTime = {};
        if(fieldsValue.create_time && fieldsValue.create_time.length > 0 ) {
            createTime.created_start = fieldsValue.create_time[0].format('YYYY-MM-DD');
            createTime.created_end = fieldsValue.create_time[1].format('YYYY-MM-DD');
        }
        const values = {...fieldsValue,...createTime};
        delete values.create_time;
        this.setState({
            searchValues:values,
            args:{
                page:1,
                pageSize:args.pageSize
            }
        })
        history.replace({search:`?page=1&pageSize=${args.pageSize}`})
        dispatch({
            type: 'brand/fetch',
            offset: 0,
            limit: args.pageSize,
            params:values
          });
    })
  }
  handleFormReset=()=>{
      const {form,history,dispatch} = this.props;
      const {args} = this.state;
      form.resetFields();
      this.setState({
          searchValues:{},
          args:{
              page:1,
              pageSize:args.pageSize
          }
      })
      dispatch({
          type:"brand/fetch",
          limit:args.pageSize,
          offset:0,
          params:{}
      })
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xxl={5} md={12} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('brand_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <FormItem label="英文名">
              {getFieldDecorator('english_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xxl={6} md={12} sm={24}>
            <FormItem label="注册地">
              {getFieldDecorator('registration_place')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xxl={7} md={12} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('create_time')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    const { selectedRowKeys, selectedRows,args } = this.state;
    const { history, brand } = this.props;
    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const page = args.page >> 0;
    const pageSize = args.pageSize >> 0;

    return (
      <PageHeaderLayout title="品牌列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderSimpleForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => { history.push('/brand/list/new'); }}>
                新建品牌
              </Button>
              {selectedRowKeys.length > 0 && (
                <span>
                  <Button>批量导出</Button>
                </span>
              )}
            </div>
            <CustomizableTable
              rowSelection={rowSelection}
              data={brand.list}
              columns={this.columns}
              scroll={{ x: 800 }}
              onChange={this.handleCustomizableTableChange}
              onSelectRow={this.handleSelectRows}
              total={brand.total}
              current={page}
              pageSize={pageSize}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
