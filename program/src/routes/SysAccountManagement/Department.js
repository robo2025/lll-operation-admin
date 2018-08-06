import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Tree, Card, Row, Col, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditPosition from './EditPostiton';

const TreeNode = Tree.TreeNode;
@Form.create()
@connect(({ sysAccount }) => ({
  sysAccount,
}))
export default class Department extends React.Component {
  state = {
    expandKeys: ['1'],
    formObj: {}, // 接收子组件传过来的form
  };
  componentDidMount() {
      console.log(this);
    this.onGetDepartmentList();
  }
  onGetDepartmentList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchDepartmentList',
    });
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
      }
    });
  };
  onfilterData = (data, id) => {
    // 遍历获取与ID相同的数据项
    const findData = (arr, id1) => {
      const result = arr.map((item) => {
        if (item.id === id1) {
          return item;
        } else if (item.children && item.children.length > 0) {
          return findData(item.children, id);
        }
      });
      return _.flattenDepth(result).filter(item => item !== undefined)[0];
    };
    return findData(data, id);
  };
  onSelect = (selectedKeys, e) => {
      const { formObj } = this.state;
    // 当选择某一项树节点时执行
    const { sysAccount, dispatch } = this.props;
    const { departmentList } = sysAccount;
    if (e.selected) {
      const filterArr = this.onfilterData(departmentList, selectedKeys[0] >> 0);// 得到当前需在右侧展示的数据
      this.setState({
        expandKeys: selectedKeys,
      });
      dispatch({
          type: 'sysAccount/saveFilterList',
        payload: filterArr.children,
      });
    }
    formObj.resetFields();
  };
  onSubmit = (values, form) => { // 点击保存按钮
    const { dispatch } = this.props;
    const { keys, ...others } = values;
    console.log(values);
    let result = [];
    Object.keys(others).forEach((id) => {
      result = [
        ...result,
        {
          id,
          name: others[id],
        },
      ];
    });
    form.resetFields();
  };
  renderTreeNodes = (data) => { // 根据数据渲染树节点
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={item.label} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          title={
            <div>
              <span>{item.label}</span>
              <span
                style={{
                  color: '#008dff',
                  position: 'absolute',
                  top: 0,
                  right: '-50%',
                }}
              >
                删除
              </span>
            </div>
          }
          isLeaf
        />
      );
    });
  };
  render() {
    const { sysAccount, form } = this.props;
    const { departmentList, filterDataList } = sysAccount;
    const { expandKeys } = this.state;
    console.log(filterDataList);
    return (
      <PageHeaderLayout title="部门组织">
        <Card>
          <Row>
            <Col xll={4} md={6} sm={8}>
              <Tree
                loadData={this.onLoadData}
                expandedKeys={expandKeys}
                onSelect={this.onSelect}
              >
                {this.renderTreeNodes(departmentList)}
              </Tree>
            </Col>
            <Col xll={20} md={18} sm={16}>
              <EditPosition
                initData={filterDataList}
                onSubmit={this.onSubmit}
                onRemove={this.onRemove}
                form={form}
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
