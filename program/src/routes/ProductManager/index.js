import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Menu, DatePicker, message, Modal, Checkbox } from 'antd';
import ProductTable from '../../components/StandardTable/ProductTable';
import CheckboxGroup from '../../components/Checkbox/CheckboxGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { handleServerMsg } from '../../utils/tools';
import styles from './product-manager.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const plainOptions = ['pno', 'product_name', 'brand_name', 'english_name', 'partnumber', 'prodution_place', 'category', 'staff_name', 'supply', 'created_time'];


@connect(({ loading, product }) => ({
  product,
  loading: loading.models.product,
}))
@Form.create()
export default class ProductManager extends Component {
  constructor(props) {
    super(props);
    this.jumpToPage = this.jumpToPage.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.showExportModal = this.showExportModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.removeProducts = this.removeProducts.bind(this);
    this.querySupplyInfo = this.querySupplyInfo.bind(this);
    this.state = {
      modalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      isShowExportModal: false,
      exportFields: [], // 导出产品字段
      isCheckAll: false,
    };
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
    });
  }

  onChange = (date, dateString) => {
    console.log(date, dateString);
  }

  // 全选按钮改变
  onCheckAllChange = (e) => {
    this.setState({
      isCheckAll: e.target.checked,
      exportFields: e.target.checked ? plainOptions : [],
    });
  }

  // 导出数据复选框改变
  onExportFieldsChange = (fields) => {
    this.setState({ 
      exportFields: fields,
      isCheckAll: fields.length === plainOptions.length,
     });
  } 

  // 显示导出数据框
  showExportModal() {
    this.setState({ isShowExportModal: true });
  }

  // 取消导出数据
  handleCancel() {
    this.setState({ isShowExportModal: false });
  }

  // 确定导出数据
  handleOk() {
    this.setState({ isShowExportModal: false });
    console.log('要导出的数据项目', this.state.exportFields);
    const { dispatch } = this.props;
    dispatch({
      type: 'product/queryExport',
      fields: this.state.exportFields,
      success: (res) => { 
        console.log('http://139.199.96.235:9005/api/product_reports?filename=' + res.filename);
        window.open('http://139.199.96.235:9005/api/product_reports?filename=' + res.filename);
       },
    });
  }
  

  // 修改产品
  editProduct(productId) {
    const { history } = this.props;
    history.push(`/product/list/modify?prdId=${productId}`);
  }

  // 删除产品
  removeProducts() {
    const { dispatch } = this.props;
    const ids = this.state.selectedRows.map(val => val.id);
    dispatch({
      type: 'product/remove',
      ids,
      error: (res) => { message.error(handleServerMsg(res.msg)); },      
    });
  }

  // 获取供货信息
  querySupplyInfo(productId) {
    console.log('productId', productId);
    const { dispatch } = this.props;
    dispatch({
      type: 'product/querySupplyInfo',
      productId,
    });
  }
  

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    console.log('产品table改变--：', pagination, filtersArg, sorter);
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    dispatch({
      type: 'product/fetch',
      offset: params.offset,
      limit: params.pageSize,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
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

  jumpToPage(url) {
    const { history } = this.props;
    history.push(url);
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品ID编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="上限架状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">下架中</Option>
                  <Option value="2">已上架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="供应商名称">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
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

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
         <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品ID编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">待审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="上限架状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">下架中</Option>
                  <Option value="2">已上架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="供应商名称">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
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
         </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="型号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
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
          <Col xll={4} md={8} sm={24}>
            <FormItem label="产品提交日期">
              {getFieldDecorator('no')(
                <RangePicker onChange={this.onChange} />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="源产品ID">
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
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
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
    const { loading, product } = this.props;
    const { selectedRows, modalVisible, isShowExportModal } = this.state;
    const data = product.list;
    const { total } = product;

    // 导出数据modal标题
    const exportCom = (
        <h4>
          导出数据
          <Checkbox 
          style={{ marginLeft: 20 }} 
          onChange={this.onCheckAllChange} 
          checked={this.state.isCheckAll}
          >
          全选
          </Checkbox>
        </h4>
    );

    console.log('product', this.state);

    return (
      <PageHeaderLayout title="产品管理">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
                {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
           
            <div className={styles.tableListOperator}>
              <Button type="primary" icon="plus" onClick={this.jumpToPage.bind(this, 'list/new')}>新建</Button>
              {
                selectedRows.length > 0 ? (
                  <span>
                    <Button
                      onClick={this.removeProducts}
                    >删除
                    </Button>
                  </span>
                ) : null
              }
              <Button onClick={this.showExportModal}>导出数据</Button>
            </div>
            <Modal
              visible={isShowExportModal}
              width="600px"
              title={exportCom}
              onCancel={this.handleCancel}
              onOk={this.handleOk}
            >
              <CheckboxGroup
                onChange={this.onExportFieldsChange}
                isCheckAll={this.state.isCheckAll}
                checkedList={this.state.exportFields}
              />
            </Modal>
            <ProductTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              total={total}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              editProduct={this.editProduct}
              querySupplyInfo={this.querySupplyInfo}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
