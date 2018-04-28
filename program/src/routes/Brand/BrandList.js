import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Row, Col, Form, Input, Button, Icon, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CustomizableTable from '../../components/CustomTable/CustomizableTable';

import styles from './style.less';

const FormItem = Form.Item;
const columns = [{
  title: '序号',
  dataIndex: 'idx',
  key: 'idx',
  width: 60,
  fixed: 'left',
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
  render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD hh:mm:ss')}</span>),
}, {
  title: '操作',
  dataIndex: 'actions',
  key: 'actions',
  render: (text, record) => (
    <Fragment>
      <a href={`#/brand/list/modify?bno=${record.bno}`}>编辑</a>
      <Divider type="vertical" />
      <a>
        删除
      </a>
      <Divider type="vertical" />
      <a href={`#/brand/list/detail?bno=${record.bno}`}>查看</a>
    </Fragment>
  ),
  width: 150,
  fixed: 'right',
}];

@connect(({ brand, loading }) => ({
  brand,
  loading,
}))
@Form.create()
export default class BrandList extends Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'brand/fetch',
    });
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('pno')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="英文名">
              {getFieldDecorator('product_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="注册地">
              {getFieldDecorator('partnumber')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('brand_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
              展开 <Icon type="down" />
            </a>
          </span>
        </div>
      </Form>
    );
  }


  render() {
    const { selectedRowKeys, selectedRows } = this.state;
    const { history, brand } = this.props;
    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    console.log('品牌信息', brand);

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
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量导出</Button>
                </span>
              )}
            </div>
            <CustomizableTable
              rowSelection={rowSelection}
              data={brand.list}
              columns={columns}
              scroll={{ x: 800 }}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
