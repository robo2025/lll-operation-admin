import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  Tree,
  Card,
  Row,
  Col,
  message,
  Breadcrumb,
  Modal,
  Form,
  Input,
  Spin,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditPosition from './EditPostiton';
import styles from './index.less';

const { DirectoryTree, TreeNode } = Tree;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const EditModal = Form.create()((props) => {
  const { form, visible, editInfo, editCancel, editOk, changeNameLoading } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    wrapperCol: {
      md: 16,
    },
    labelCol: {
      md: 6,
    },
  };
  const onOk = () => {
    console.log(editInfo);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      editOk(editInfo.id, fieldsValue.name);
    });
  };
  return (
    <Modal
      title="编辑部门"
      visible={visible}
      onCancel={() => editCancel(form)}
      onOk={onOk}
      destroyOnClose
    >
    <Spin spinning={changeNameLoading || false}>
      <Form>
        <FormItem label="部门名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入部门名称', whitespace: true },
              { max: 50, message: '最大长度不能超过50' },
            ],
            initialValue: editInfo.name,
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Form>
    </Spin>
    </Modal>
  );
});

@connect(({ sysAccount, loading }) => ({
  sysAccount,
  loading: loading.effects['sysAccount/fetchDepartmentList'],
  editLoading: loading.effects['sysAccount/fetchEditDepartment'],
  deleteLoading: loading.effects['sysAccount/fetchDeleteDepartment'],
  changeNameLoading: loading.effects['sysAccount/fetchEditDepartmentName'],
}))
export default class Department extends React.Component {
  state = {
    expandData: [], // 提交保存时的数据
    breadCrumbData: [],
    editModalVisible: false, // 编辑模态框是否可见
    editInfo: {}, // 需要编辑的部门信息
    selectedKeys: 0,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchDepartmentList',
      success: (res) => {
        this.onChangeData(res.data, 0);
        this.setState({
          expandData: res.data,
        });
        dispatch({
          type: 'sysAccount/saveFilterList',
          payload: res.data,
        });
      },
    });
  }

  onEditOk() {
    // 新增或编辑会修改名称成功执行
    const { dispatch } = this.props;
    const { selectedKeys } = this.state;
    dispatch({
      type: 'sysAccount/fetchDepartmentList',
      success: (res) => {
        this.onChangeData(res.data, 0);
        const filterArr =
          selectedKeys[0] >> 0 === 0
            ? res.data
            : this.onfilterData(res.data, selectedKeys[0] >> 0); // 得到当前需在右侧展示的数据
        const breadCrumb =
          selectedKeys[0] >> 0 === 0
            ? []
            : this.onFilterBreadData(filterArr, []); // 面包屑需要选择的数据
        this.setState({
          expandData: filterArr,
          breadCrumbData: breadCrumb,
        });
        dispatch({
          type: 'sysAccount/saveFilterList',
          payload: filterArr.children ? filterArr.children : filterArr,
        });
        this.$formObj.setFieldsValue({
          // 新增或者编辑的时候重新设置值
          keys: filterArr.children ? filterArr.children : filterArr,
        });
      },
    });
  }
  onDeleteOk() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchDepartmentList',
      success: (res) => {
        this.onChangeData(res.data, 0);
        this.setState({
          expandData: res.data,
          breadCrumbData: [],
          selectedKeys: 0,
        });
        dispatch({
          type: 'sysAccount/saveFilterList',
          payload: res.data,
        });
        this.$formObj.resetFields();
      },
    });
  }
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
  onChangeData = (data, level) => {
    level++;
    data.map((item) => {
      item.level = level;
      if (item.children && item.children.length > 0) {
        this.onChangeData(item.children, level);
      }
    });
  };
  onSelect = (selectedKeys, e) => {
    const { sysAccount, dispatch } = this.props;
    const { departmentList } = sysAccount;
    if (e.node.props.dataEdit && e.selected) {
      const filterArr = this.onfilterData(departmentList, selectedKeys[0] >> 0); // 得到当前需在右侧展示的数据
      const breadCrumbData = this.onFilterBreadData(filterArr, []); // 面包屑需要选择的数据
      this.setState({
        expandData: filterArr,
        breadCrumbData,
        selectedKeys,
      });
      dispatch({
        type: 'sysAccount/saveFilterList',
        payload: filterArr.children,
      });
      this.$formObj.resetFields();
    }
  };
  onFilterBreadData = (data, arr) => {
    // 获取面包屑导航的数据
    const { sysAccount } = this.props;
    const { departmentList } = sysAccount;
    if (data.pid === 0) {
      arr.unshift({ name: data.name, id: data.id });
      return arr;
    } else {
      arr.unshift({ name: data.name, id: data.id });
      const result = this.onfilterData(departmentList, data.pid);
      return this.onFilterBreadData(result, arr);
    }
  };
  onSubmit = (values) => {
    // 点击保存按钮
    const { dispatch } = this.props;
    const { expandData } = this.state;
    const { keys, ...others } = values;
    console.log(expandData);
    let pid = 0;
    if (expandData instanceof Array || expandData.length === 0) {
      // 数组为初始化,pid为0
      pid = 0;
    } else {
      // 对象为选择之后的数据，此时选取id值为pid
      pid = expandData.id;
    }
    console.log(pid, 'pid');
    let result = [];
    Object.keys(others).forEach((id) => {
      result = [
        ...result,
        {
          id,
          name: others[id],
          pid,
        },
      ];
    });
    dispatch({
      type: 'sysAccount/fetchEditDepartment',
      params: result,
      success: (res) => {
        message.success(res.msg);
        this.onEditOk();
      },
      error: (res) => {
        message.error(res.msg);
      },
    });
  };
  onDelete = (e, item) => {
    // 删除
    const { dispatch } = this.props;
    const _this = this;
    confirm({
      title: `您确定删除${item.name}吗？`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'sysAccount/fetchDeleteDepartment',
            id: item.id,
            success: (res) => {
              message.success(res.msg);
              _this.onDeleteOk();
              resolve();
            },
            error: (res) => {
              message.error(res.msg);
              reject();
            },
          });
        });
      },
      onCancel() {},
    });
  };
  onEdit = (e, item) => {
    e.stopPropagation();
    this.setState({
      editModalVisible: true,
      editInfo: item,
    });
  };
  editCancel = (form) => {
    // 取消修改名称
    this.setState({
      editModalVisible: false,
    });
    form.resetFields();
  };
  editOk = (id, name) => {
    // 修改名称OK
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchEditDepartmentName',
      id,
      name,
      success: (data) => {
        message.success(data.msg);
        this.onEditOk();
        this.setState({
          editModalVisible: false,
        });
      },
      error: (error) => {
        message.error(error.msg);
      },
    });
  };
  bindForm = (form) => {
    this.$formObj = form;
  };
  renderBreadCrumb = () => {
    // 面包屑导航
    const { breadCrumbData } = this.state;
    return (
      <Breadcrumb separator=">">
        <Breadcrumb.Item>部门名称</Breadcrumb.Item>
        {breadCrumbData.map(ele => (
          <Breadcrumb.Item key={ele.id}>{ele.name}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };
  renderTreeNodes = (data) => {
    // 根据数据渲染树节点
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode
            dataEdit
            title={
              <span>
                <span>{item.label}</span>
                <span
                  style={{
                    color: '#008dff',
                    marginLeft: 8,
                  }}
                  onClick={e => this.onEdit(e, item)}
                >
                  编辑
                </span>
              </span>
            }
            key={item.id}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.id}
          dataEdit={item.level < 3}
          title={
            <span>
              {item.level < 3 ? (
                <span>{item.label}</span>
              ) : (
                <span style={{ cursor: 'default' }}>{item.label}</span>
              )}

              <span
                style={{
                  color: '#008dff',
                  marginLeft: 8,
                }}
                onClick={e => this.onEdit(e, item)}
              >
                编辑
              </span>
              <span
                onClick={e => this.onDelete(e, item)}
                style={{
                  color: '#008dff',
                  marginLeft: 8,
                }}
              >
                删除
              </span>
            </span>
          }
          isLeaf
        />
      );
    });
  };
  render() {
    const { editModalVisible, editInfo } = this.state;
    const { sysAccount, loading, changeNameLoading, editLoading } = this.props;
    const { departmentList, filterDataList } = sysAccount;
    return (
      <PageHeaderLayout title="部门组织">
        <Card>
          <Spin spinning={loading || editLoading || false}>
            <Row>
              <Col md={8} sm={8} className={styles.treeSelect}>
                <Card title="部门组织结构">
                  <DirectoryTree onSelect={this.onSelect}>
                    {this.renderTreeNodes(departmentList)}
                  </DirectoryTree>
                </Card>
              </Col>
              <Col md={15} sm={15} offset={1}>
                <Card title={this.renderBreadCrumb()}>
                  <EditPosition
                    initData={filterDataList}
                    onSubmit={this.onSubmit}
                    onRemove={this.onRemove}
                    bindForm={this.bindForm}
                    hideDeleteIcon
                  />
                </Card>
              </Col>
            </Row>
            <EditModal
              visible={editModalVisible}
              editInfo={editInfo}
              editCancel={this.editCancel}
              editOk={this.editOk}
              changeNameLoading={changeNameLoading}
            />
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
