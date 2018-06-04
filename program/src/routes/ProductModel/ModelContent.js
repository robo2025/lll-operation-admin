import React, { Component } from 'react';
import { Table } from 'antd';

const dataSource = [{
  key: '1',
  pno: 'P2313213',
  product_name: '测试产品',
  category: '一级类目-二级类目-三级类目',
  brand: '固高',
}, {
  key: '2',
  pno: 'P23132313',
  product_name: '测试产品',
  category: '一级类目-二级类目-三级类目',
  brand: '固高',
}];


export default class ModelContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelList: [],
    };
  }

  // 添加产品到模板
  addProductToModel = (record) => {
    const { modelList } = this.state;
    record.selected = true;
    this.setState({ modelList: [...modelList, record] });
  }

  // 从模板删除产品
  deleteProductFromModel = (record) => {
    const { modelList } = this.state;
    record.selected = false;    
    this.setState({ modelList: modelList.filter(val => val.key !== record.key) });
  }

  render() {
    const { modelList } = this.state;
    console.log(dataSource);
    const columns = [{
      title: '产品ID',
      dataIndex: 'pno',
      key: 'pno',
    }, {
      title: '产品名称',
      dataIndex: 'product_name',
      key: 'product_name',
    }, {
      title: '所属类目',
      dataIndex: 'category',
      key: 'category',
    }, {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand_name',
    }, {
      title: '产地',
      dataIndex: 'brand',
      key: 'registration_place',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <a onClick={() => { this.addProductToModel(record); }} disabled={record.selected}>选择</a>
      ),
    }];
    const columns2 = [{
      title: '产品ID',
      dataIndex: 'pno',
      key: 'pno',
    }, {
      title: '产品名称',
      dataIndex: 'product_name',
      key: 'product_name',
    }, {
      title: '所属类目',
      dataIndex: 'category',
      key: 'category',
    }, {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand_name',
    }, {
      title: '产地',
      dataIndex: 'brand',
      key: 'registration_place',
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <a onClick={() => { this.deleteProductFromModel(record); }}>取消</a>
      ),
    }];


    return (
      <div>
        <h3>可选产品列表</h3>
        <Table
          dataSource={dataSource}
          columns={columns}
        />
        <h3>已选产品列表</h3>
        <Table
          dataSource={modelList}
          columns={columns2}
        />
      </div>
    );
  }
}
