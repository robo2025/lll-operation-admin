import React, { Component, Fragment } from 'react';
import { Card, Row, Col, Form, Input, Button, Icon, Divider, Dropdown } from 'antd';
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
  dataIndex: 'brand',
  key: 'brand',
  width: 120,
  fixed: 'left',
}, {
  title: '英文名',
  dataIndex: 'en_name',
  key: 'en_name',
  width: 120,
  fixed: 'left',
}, {
  title: '注册地',
  dataIndex: 'register',
  key: 'register',
}, {
  title: 'LOGO',
  dataIndex: 'logo',
  key: 'logo',
}, {
  title: '已关联产品数',
  dataIndex: 'assc',
  key: 'assc',
}, {
  title: '创建日期',
  dataIndex: 'create_time',
  key: 'create_time',
}, {
  title: '操作',
  dataIndex: 'actions',
  key: 'actions',
  render: (text, record) => (
    <Fragment>
      <a href={`#/goods/list/detail?goodId=${record.id}&audit=1`}>编辑</a>
      <Divider type="vertical" />
      <a >
        删除
      </a>
      <Divider type="vertical" />
      <a href={'#/goods/list/detail?goodId=' + record.id}>查看</a>
    </Fragment>
  ),
  width: 150,
  fixed: 'right',
}];
const fakeData = [];
for (let i = 0; i < 10; i++) {
  fakeData.push({
    idx: i,
    brand: `固高${i}`,
    en_name: 'gugao',
    register: '美国',
    logo: 'LOGO',
    assc: Math.random() * 100 * i >> 0,
    create_time: '2018-4-25',
  });
}


@Form.create()
export default class BrandList extends Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
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
    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

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
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
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
              data={fakeData}
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
