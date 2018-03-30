/*
 * @Author: lll
 * @Date: 2018-02-01 11:30:59
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-30 13:38:13
 */
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Button, Form, Input, Modal, Row, Col, Upload, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModifyProductForm from '../../components/Form/ModifyProductForm';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import AddAttrForm from '../../components/Form//AddAttrForm';
import { queryString, checkFile, handleServerMsg } from '../../utils/tools';

import styles from './modify-product.less';

const UPLOAD_URL = '//up.qiniu.com'; // 文件上传地址
const FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的文件类型
const actionFlag = ['新增', '修改', '删除']; // 操作类型 (1:新增 2:修改 3:删除)
const operationTabList = [{
  key: 'tab1',
  tab: '操作日志一',
}];
// 操作记录列
const columns = [{
  title: '操作类型',
  dataIndex: 'action_flag',
  key: 'action_flag',
  render: val => <span>{actionFlag[val - 1]}</span>,
}, {
  title: '操作员',
  dataIndex: 'username',
  key: 'username',
}, {
  title: '执行结果',
  dataIndex: 'status',
  key: 'status',
  render: () => (<span>成功</span>),
}, {
  title: '操作时间',
  dataIndex: 'action_time',
  key: 'action_time',
  render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
}, {
  title: '说明',
  dataIndex: 'change_message',
  key: 'change_message',
}];

// 修改产品信息
@connect(({ loading, product, catalog, upload }) => ({
  product,
  catalog,
  upload,
  loading: loading.models.product,
}))
export default class ModifyProduct extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.ShowAttrModal = this.ShowAttrModal.bind(this);
    this.handleAssociate = this.handleAssociate.bind(this);
    this.handleProductAttr = this.handleProductAttr.bind(this);
    this.handleAddOtherAttrFiled = this.handleAddOtherAttrFiled.bind(this);
    this.handleAddProductOtherAttr = this.handleAddProductOtherAttr.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onOk = this.onOk.bind(this);
    this.handleSubmitProduct = this.handleSubmitProduct.bind(this);
    this.handleClearData = this.handleClearData.bind(this);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      args: queryString.parse(this.props.location.search),
      fields: { ...this.props.product.detail, pdf_url: [] },
      otherAttrs: [],
      operationkey: 'tab1',
      newFiled: {}, // 用户自定义的其他属性   
      file: { uid: '', name: '' },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 请求产品列表
    dispatch({
      type: 'product/fetch',
    });
    // 请求产品详情
    dispatch({
      type: 'product/fetchDetail',
      productId: args.prdId || args.origin_prdId,
      success: (detail) => {
        this.setState({
          fields: {
            ...detail,
            category_id_1: detail.category.id, // 一级目录
            category_id_2: detail.category.children.id, // 二级目录
            category_id_3: detail.category.children.children.id, // 三级目录
            category_id_4: detail.category.children.children.children.id, // 四级目录
          },
          otherAttrs: detail.other_attrs,
        });
      },
    });
    // 请求目录列表
    dispatch({
      type: 'catalog/fetchLevel',
    });
    // 获取upload_token
    dispatch({
      type: 'upload/fetch',
    });
    // 获取操作日志
    dispatch({
      type: 'product/queryLogs',
      module: 'product',
      productId: args.prdId,
    });
    console.log('参数', args);
  }

  onOperationTabChange = (key) => {
    console.log(key);
    this.setState({ operationkey: key });
  }

  onCancel() {
    this.setState({ isShowModal: false });
    this.setState({ isShowAttrMOdal: false });
  }

  onOk() {
    this.setState({ isShowModal: false });
    this.setState({ isShowModal: false });
    const { newFiled, otherAttrs } = this.state;
    const len = otherAttrs.length;
    if (newFiled.attr_name && newFiled.attr_value) {
      this.setState({ isShowAttrMOdal: false }); // 隐藏添加属性弹窗
      this.setState({
        otherAttrs: [
          ...otherAttrs,
          {
            id: len - 100,
            attr_name: newFiled.attr_name.value,
            attr_value: newFiled.attr_value.value,
          },
        ],
      });
      console.log('提交新属性', newFiled);
    }
  }

  showModal() {
    this.setState({ isShowModal: true });
  }
  ShowAttrModal() {
    this.setState({ isShowAttrMOdal: true });
  }

  /**
   * 点击关联按钮后事件
   * @param {string=} prdId 产品ID
   *
   * */
  handleAssociate(prdId) {
    const { history } = this.props;
    history.push(`/product/list/modify?origin_prdId=${prdId}`);
    this.setState({ isShowModal: false });
  }

  /**
 * 当产品其他属性被修改事件[产品概述、详情、FAQ,其他属性，图片]
 * 
 * @param {object} obj json对象，产品属性key=>value
 * 
 */
  handleProductAttr(obj) {
    const { fields } = this.state;
    if (obj.selectedCatalog) {
      this.setState({
        fields: {
          ...fields,
          category_id_1: obj.selectedCatalog[0], // 一级目录
          category_id_2: obj.selectedCatalog[1], // 二级目录
          category_id_3: obj.selectedCatalog[2], // 三级目录
          category_id_4: obj.selectedCatalog[3], // 四级目录
        },
      });
      return;
    }
    this.setState({
      fields: { ...this.state.fields, ...obj },
    });
    console.log('产品信息', { ...this.state.fields, ...obj });
  }

  // 当表单输入框被修改事件
  handleFormChange = (changedFields) => {
    const { fields } = this.state;
    if (changedFields.selectedCatalog) {
      this.setState({
        fields: {
          ...fields,
          category_id_1: changedFields.selectedCatalog[0], // 一级目录
          category_id_2: changedFields.selectedCatalog[1], // 二级目录
          category_id_3: changedFields.selectedCatalog[2], // 三级目录
          category_id_4: changedFields.selectedCatalog[3], // 四级目录
        },
      });
      return;
    }
    this.setState({
      fields: { ...fields, ...changedFields },
    });
  }

  /**
   * 添加产品其他属性项目
   * 
   * @param {string} key 属性key
   * @param {string} value 属性value
   * 
   */
  handleAddOtherAttrFiled(fileds) {
    const { newFiled } = this.state;
    this.setState({
      newFiled: { ...newFiled, ...fileds },
    });
  }


  /**
  * 添加产品其他属性内容
  * 
  * @param {string} id 其他属性的唯一id
  * @param {object} obj 其他属性的内容，如{attr_name:'形状'}
  * 
  */
  handleAddProductOtherAttr(id, obj) {
    const { otherAttrs } = this.state;
    let isExist = false;
    const newOtherAttrs = otherAttrs.map((val) => {
      if (val.id === id) {
        isExist = true;
        const newVal = { ...val, ...obj };
        return newVal;
      } else {
        return val;
      }
    });
    if (!isExist) {
      console.log('不存在', id, otherAttrs);
      this.setState({ otherAttrs: [...otherAttrs, { id, ...obj }] });
    } else {
      this.setState({ otherAttrs: newOtherAttrs });
      console.log('存在', id, newOtherAttrs);
    }
  }

  // 一键清除数据
  handleClearData() {
    const { fields } = this.state;
    this.setState({
      fields: {
        ...fields,
        category: '',
        product_name: '',
        partnumber: '',
        brand_name: '',
        english_name: '',
        prodution_place: '',
      },
    });
  }

  // 其他属性图片上传前处理：验证文件类型
  beforeUpload = (key, file) => {
    this.setState({ file });
    // console.log('before', file);
    if (checkFile(file.name, FILE_TYPES)) {
      this.setState({ isPicture: true });
    }
    if (!checkFile(file.name, FILE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      this.setState({ isPicture: false });
      return false;
    }
  }

  // 其他属性图片上传时处理
  handleUploaderChange = (key, fileList) => {
    console.log('文件上传', key, fileList);
    const { isPicture } = this.state;
    if (!isPicture) { return; }
    // 上传成功，则将图片放入state里的pics数组内
    fileList.map((file) => {
      if (file.status === 'done') {
        message.success(`${file.name} 文件上传成功`);
        this.handleAddProductOtherAttr(key, { img_url: file.response.key });
      } else if (file.status === 'error') {
        message.error(`${file.name} 文件上传失败`);
      }
      return file;
    });
  }

  /**
 * 删除产品其他属性项目
 * 
 * @param {string} id 属性id
 * 
 */
  handleDeleteOtherAttrFiled(id) {
    const { otherAttrs } = this.state;
    const newOtherAttrsFiled = otherAttrs.filter((val, idx) => {
      return val.id !== id;
    });
    this.setState({
      otherAttrs: newOtherAttrsFiled,
    });
    console.log('删除属性ID', id, newOtherAttrsFiled);
  }


  /**
   * 提交产品信息
   * 
   */
  handleSubmitProduct() {
    const argsKey = Object.keys(this.state.args);
    const {
      args,
      fields,
      otherAttrs,
    } = this.state;
    console.log('产品信息', { ...fields, other_attrs: otherAttrs }, Object.keys(args));
    const { dispatch } = this.props;

    if (argsKey.includes('prdId')) { // 如果是修改产品
      dispatch({
        type: 'product/modifyInfo',
        prdId: this.state.args.prdId,
        data: {
          ...fields,
          other_attrs: otherAttrs,
          pdf_url: ['没有'],
        },
        success: () => { this.props.history.push('/product/list'); },
        error: (res) => { message.error(handleServerMsg(res.msg)); },
      });
    } else if (argsKey.includes('origin_prdId')) { // 如果是添加新产品
      dispatch({
        type: 'product/add',
        data: { ...fields, other_attrs: otherAttrs, pdf_url: ['没有'] },
        success: () => { this.props.history.push('/product/list'); },
        error: (res) => { message.error(handleServerMsg(res.msg)); },
      });
    }
  }

  render() {
    const { isShowModal, isShowAttrMOdal, otherAttrs, file } = this.state;
    const argsKey = Object.keys(this.state.args);    
    const { product, loading, catalog, upload } = this.props;
    const buttonGrop = (
      <div style={{ display: 'inline-block', marginLeft: 20 }}>
        <Button type="primary" onClick={this.showModal}>关联产品数据模板</Button>
        <Button style={{ marginLeft: 20 }} onClick={this.handleClearData}>一键清除数据</Button>
      </div>);
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    const contentList = {
      tab1: <Table
        pagination={{
          defaultPageSize: 6,
          pageSize: 6,
        }}
        loading={loading}
        dataSource={product.logs}
        columns={columns}
      />,
    };

    // 其他属性列
    const attrClomns = [{
      title: '属性名',
      dataIndex: 'attr_name',
      key: 'attr_name',
    }, {
      title: '属性值',
      dataIndex: 'attr_value',
      key: 'attr_value',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => {
            this.handleAddProductOtherAttr(record.id,
              { attr_name: record.attr_name, attr_value: e.target.value }
            );
          }}
        />
      ),
    }, {
      title: '操作',
      render: (text, record) =>
        (<a onClick={() => { this.handleDeleteOtherAttrFiled(record.id); }}>删除</a>),
    }];


    console.log('产品修改页面state：', otherAttrs);
    return (
      <PageHeaderLayout title={argsKey.includes('prdId') ? '修改产品信息' : '新建产品信息'}>
        <Card bordered={false} loading={loading} className={styles['modify-product']}>
          {/* 参照数据Modal */}
          <Modal
            width="60%"
            visible={isShowModal}
            title="关联参照数据"
            okText=""
            cancelText=""
            onCancel={this.onCancel}
            onOk={this.onOk}
          >
            <ProductList
              data={product.list}
              onAssociate={this.handleAssociate}
            />
          </Modal>
          {/* 添加其它属性Modal */}
          <Modal
            width="650px"
            visible={isShowAttrMOdal}
            title="添加属性项"
            onCancel={this.onCancel}
            onOk={this.onOk}
          >
            <AddAttrForm
              onFieldsChange={this.handleAddOtherAttrFiled}
            />
          </Modal>
          <SectionHeader
            title="产品基础信息"
            extra={buttonGrop}
          />
          <ModifyProductForm
            data={this.state.fields}
            onChange={this.handleFormChange}
            catalog={catalog.level}
            loading={loading}
            onAttrChange={this.handleProductAttr}
            uploadToken={upload.upload_token}
          />
          <SectionHeader
            title="产品其他属性"
            extra={<Button style={{ marginLeft: 20 }} icon="plus" onClick={this.ShowAttrModal}>添加其他属性项</Button>}
          />
          <div style={{ width: 700, maxWidth: '70%' }}>
            <Table
              bordered
              className="attr-table"
              pagination={false}
              columns={attrClomns}
              dataSource={otherAttrs}
            />
          </div>
          <div className={styles['section-header']}>
            <h2>操作日志</h2>
          </div>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            onTabChange={this.onOperationTabChange}
          >
            {contentList[this.state.operationkey]}
          </Card>

          <div className={styles['submit-btn-wrap']}>
            <Button onClick={() => { this.props.history.push('/product/list'); }}>取消</Button>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
