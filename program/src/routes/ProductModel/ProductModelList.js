import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import Cookies from 'js-cookie';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Upload, Button, Icon, DatePicker, Select, Divider, Modal, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CustomizableTable from '../../components/CustomTable/CustomizableTable';
import SupplyInformation from '../../components/SupplyInformation/SupplyInformation';
import ModelContent from './ModelContent';
import styles from './style.less';
import { PAGE_SIZE, SUCCESS_STATUS } from '../../constant/config';
import { handleServerMsgObj, checkFile } from '../../utils/tools';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ brand, good, product, productModel, loading }) => ({
  brand,
  good,
  product,
  productModel,
  loading,
}))
@Form.create()
export default class ProductModelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      currProductModel: {},
      expandForm: false,
      isShowModal: false,
      isImportModal: false,
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    };
    this.columns = [{
      title: '序号',
      dataIndex: 'idx',
      key: 'idx',
      width: 60,
      fixed: 'left',
      render: (text, record, idx) => (<span>{idx + 1}</span>),
    }, {
      title: '产品型号ID',
      dataIndex: 'mno',
      key: 'mno',
      width: 150,
      fixed: 'left',
    }, {
      title: '产品型号',
      dataIndex: 'partnumber',
      key: 'partnumber',
      width: 150,
      fixed: 'left',
    }, {
      title: '三级类目',
      dataIndex: 'product',
      key: 'menu3',
      width: 150,
      render: text => (<span>{!text || text.category.children.children.category_name}</span>),
    }, {
      title: '产品名称',
      dataIndex: 'product',
      key: 'product_name',
      render: text => (<span>{!text || text.product_name}</span>),
    }, {
      title: '产品图片',
      dataIndex: 'product',
      key: 'pics',
      width: 150,
      render: (text) => {
        return text.pics.map((item, idx) => {
          if (idx < 3) {
            return (
              <img
                className="product-thumb"
                alt={item.img_tyle}
                key={item.id}
                src={item.img_url}
              />);
          }
        });
      },
    }, {
      title: '品牌',
      dataIndex: 'product',
      key: 'brand_name',
      render: text => (<span>{text.brand && text.brand.brand_name}</span>),
    }, {
      title: '产地',
      dataIndex: 'product',
      key: 'registration_place',
      render: text => (<span>{text.brand && text.brand.registration_place}</span>),
    }, {
      title: '已有供应商数量',
      dataIndex: 'supplier_count',
      key: 'supplier_count',
    }, {
      title: '创建时间',
      dataIndex: 'created_time',
      key: 'created_time',
      render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD hh:mm:ss')}</span>),
    }, {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Fragment>
          <a href={`#/product/model/view?mno=${record.mno}`}>查看</a>
          <Divider type="vertical" />
          <a href={`#/product/model/edit?mno=${record.mno}`}>
            编辑
          </a>
          <Divider type="vertical" />
          <a onClick={() => { this.handleBtnClick(record); }}>供货消息</a>
        </Fragment>
      ),
      width: 180,
      fixed: 'right',
    }];
  }


  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 请求产品型号列表
    dispatch({
      type: 'productModel/fetch',
      offset: args.page ? (args.page - 1) * PAGE_SIZE : 0,
      limit: PAGE_SIZE,
    });
    // 请求产品列表
    this.dispatchProductList({ offset: 0, limit: 6 });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }

  onCancel = () => {
    this.setState({ isShowModal: false });
  }

  onOk = () => {
    this.setState({ isShowModal: false });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 请求产品列表
  dispatchProductList = ({ offset, limit, params = {} }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
      offset,
      limit,
      params,
    });
  }

  // bindState
  bindModelThis = ($this) => {
    this.$ModelThis = $this;
  }

  handleModelOk = () => {
    console.log('$ModelThis', this.$ModelThis, this.$ModelThis.state);
    const { modelList } = this.$ModelThis.state;
    const pnos = modelList.map(val => val.pno);
    if (pnos.length > 0) {
      this.setState({ isImportModal: false });
      window.open(`https://testapi.robo2025.com/scm-service/models/template?${qs.stringify({ pnos }, { indices: false })}`);
    } else {
      this.setState({ isImportModal: false });
    }
  }

  // 图片上传前处理：验证文件类型
  handleBeforeUpload = (file) => {
    if (!checkFile(file.name, ['xls', 'xlsx'])) {
      message.error(`${file.name}的文件格式暂不支持上传`);
      return false;
    }
  }

  // 处理下载模板产品列表改变
  handleModelTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    this.dispatchProductList({ offset: params.offset, limit: params.pageSize });
  }

  // 是否显示modal
  toggleModal = (key, visible) => {
    this.setState({ [key]: visible });
  }

  handleModelUploadChange = ({ file }) => {
    const DOWNLOAD_URL = 'https://testapi.robo2025.com/scm-service/download';
    if (file.status === 'done' && file.response) {
      const { data, msg, rescode } = file.response;
      if (rescode >> 0 === SUCCESS_STATUS) {
        message.success(msg);
      } else {
        Modal.error({
          title: '导入失败',
          content: <div><p>失败文件下载：</p><a href={`${DOWNLOAD_URL}?filename=${data.filename}`}>{data.filename}</a></div>,
        });
      }
    }
  }

  // 处理表格变化
  handleCustomizableTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, history } = this.props;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };

    // 分页：将页数提取到url上
    history.push({
      pathname: '/product/model',
      search: `?page=${params.currentPage}`,
    });

    dispatch({
      type: 'productModel/fetch',
      offset: params.offset,
      limit: params.pageSize,
    });
  }

  // 供货信息被点击
  handleBtnClick = (record) => {
    this.setState({ currProductModel: record, isShowModal: true });
    this.dispatchGoodsList(record.mno);
  }

  // 请求供货商品列表
  dispatchGoodsList = (mno) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'good/fetch',
      params: {
        mno,
      },
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const createTime = {};
      if (fieldsValue.create_time) {
        createTime.created_start = fieldsValue.create_time[0].format('YYYY-MM-DD');
        createTime.created_end = fieldsValue.create_time[1].format('YYYY-MM-DD');
      }
      const values = {
        ...fieldsValue,
        ...createTime,
      };

      this.setState({
        formValues: values,
      });
      const { pno, mno, partnumber, created_start, created_end } = values;
      dispatch({
        type: 'productModel/fetch',
        params: {
          pno,
          mno,
          partnumber,
          created_start,
          created_end,
        },
      });
    });
  }

  // 删除产品型号
  removeProductsModel = () => {
    const { dispatch } = this.props;
    const mnos = this.state.selectedRows.map(val => val.mno);
    if (mnos.length <= 0) {
      message.error('请先选择要删除的产品型号');
      return;
    }
    dispatch({
      type: 'productModel/remove',
      mnos,
      success: () => {
        message.success('删除成功');
        const args = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        dispatch({
          type: 'productModel/fetch',
          offset: args.page ? (args.page - 1) * PAGE_SIZE : 0,
          limit: PAGE_SIZE,
        });
        this.setState({ selectedRows: [], selectedRowKeys: [] });
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品型号ID">
              {getFieldDecorator('mno')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品型号">
              {getFieldDecorator('partnumber')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品ID">
              {getFieldDecorator('pno')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>

          <Col xll={4} md={6} sm={24}>
            <FormItem label="所属类目">
              {getFieldDecorator('catalog')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未知</Option>
                  <Option value="1">未知</Option>
                  <Option value="1">未知</Option>
                </Select>
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
            <FormItem label="产品型号ID">
              {getFieldDecorator('mno')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品型号">
              {getFieldDecorator('partnumber')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品ID">
              {getFieldDecorator('pno')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="所属类目">
              {getFieldDecorator('catalog')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未知</Option>
                  <Option value="1">未知</Option>
                  <Option value="1">未知</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('test1')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="产地">
              {getFieldDecorator('test2')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="创建人">
              {getFieldDecorator('test3')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col xll={4} md={6} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('create_time')(
                <RangePicker onChange={this.onChange} />
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
      </Form>);
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      selectedRowKeys, selectedRows,
      currProductModel, isShowModal, isImportModal, args,
    } = this.state;
    const { productModel, good, product, loading } = this.props;
    const rowSelection = {
      fixed: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <PageHeaderLayout title="产品型号列表">
        <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" icon="plus" href="#/product/model/add">新建</Button>
              <span>
                <Button
                  onClick={this.removeProductsModel}
                >
                  删除
                </Button>
              </span>
              <Button onClick={this.showExportModal}>导出数据</Button>
              <div style={{ display: 'inline-block', marginLeft: 32 }}>
                <Upload
                  className={styles.upload}
                  name="file"
                  action="https://testapi.robo2025.com/scm-service/models/template"
                  headers={{
                    Authorization: Cookies.get('access_token') || 'null',
                  }}
                  showUploadList={false}
                  beforeUpload={this.handleBeforeUpload}
                  onChange={this.handleModelUploadChange}
                >
                  <Button type="primary">
                    <Icon type="upload" />导入产品数据
                  </Button>
                </Upload>
                <Button onClick={() => { this.toggleModal('isImportModal', true); }}>下载数据模板</Button>
              </div>
            </div>
            <CustomizableTable
              loading={loading.models.productModel}
              rowSelection={rowSelection}
              data={productModel.list}
              columns={this.columns}
              scroll={{ x: 2000 }}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleCustomizableTableChange}
              defaultPage={args.page || 1}
              total={productModel.total}
            />
          </div>
          <Modal
            width="60%"
            visible={isShowModal}
            title="供货信息"
            okText=""
            cancelText=""
            onCancel={this.onCancel}
            onOk={this.onOk}
          >
            <SupplyInformation
              headerData={currProductModel}
              data={good.list}
              loading={loading.models.good}
            />
          </Modal>
          {/* 下载数据模板Modal */}
          <Modal
            width="60%"
            visible={isImportModal}
            title="下载模板选择"
            okText=""
            cancelText=""
            onCancel={() => { this.toggleModal('isImportModal', false); }}
            onOk={this.handleModelOk}
          >
            <ModelContent
              dataSource={product.list}
              total={product.total}
              loading={loading.models.product}
              onModelTableChange={this.handleModelTableChange}
              bindModelThis={this.bindModelThis}
              onSearch={this.dispatchProductList}
            />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
