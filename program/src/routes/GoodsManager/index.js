import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Checkbox, Select, Icon, Button, Menu, DatePicker, Modal, message } from 'antd';
import GoodsTable from '../../components/StandardTable/GoodsTable';
import GoodCheckboxGroup from '../../components/Checkbox/GoodCheckboxGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class GoodsMananger extends Component {
  constructor(props) {
    super(props);
    this.showExportModal = this.showExportModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.state = {
      modalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      isShowExportModal: false,
    };
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  onDatepickerChange = (date, dateString) => {
    console.log(date, dateString);
  }

  // 显示导出数据Modal
  showExportModal() {
    this.setState({ isShowExportModal: true });
  }
  // 确定导出数据
  handleCancel() {
    this.setState({ isShowExportModal: false });
  }
  // 取消导出数据
  handleOk() {
    this.setState({ isShowExportModal: false });
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = (fields) => {
    console.log(111);
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="商品ID编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="1">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="上限架状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">下架中</Option>
                  <Option value="1">已上架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="价格">
              {getFieldDecorator('no')(
                <InputGroup>
                  <Input style={{ width: 80, textAlign: 'center' }} placeholder="最低价" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <Input style={{ width: 80, textAlign: 'center', borderLeft: 0 }} placeholder="最高价" />
                </InputGroup>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="佣金比率">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="商品ID编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="1">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="上限架状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">下架中</Option>
                  <Option value="1">已上架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="价格">
              {getFieldDecorator('no')(
                <InputGroup>
                  <Input style={{ width: 80, textAlign: 'center' }} placeholder="最低价" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <Input style={{ width: 80, textAlign: 'center', borderLeft: 0 }} placeholder="最高价" />
                </InputGroup>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="佣金比率">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="型号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="所属类目">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未知</Option>
                  <Option value="1">未知</Option>
                  <Option value="1">未知</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品提交日期">
              {getFieldDecorator('no')(
                <RangePicker onChange={this.onDatepickerChange} />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible, isShowExportModal } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button onClick={this.showExportModal}>导出数据</Button>
            </div>
            <Modal
              visible={isShowExportModal}
              width="600px"
              title={<h4>导出数据<Checkbox style={{ marginLeft: 20 }}>全选</Checkbox></h4>}
              onCancel={this.handleCancel}
              onOk={this.handleOk}
            >
              <GoodCheckboxGroup />
            </Modal>
            <GoodsTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
