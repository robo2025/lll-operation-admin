/*
 * @Author: lll
 * @Date: 2018-02-01 11:30:59
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-21 16:11:16
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Modal, Table, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NewProductForm from '../../components/Form/NewProductForm';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import AddAttrForm from '../../components/Form//AddAttrForm';
import { checkFile, handleServerMsg } from '../../utils/tools';
import styles from './newproduct.less';

const FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的文件类型

@connect(({ loading, product, catalog, upload }) => ({
  product,
  catalog,
  upload,
  loading: loading.models.catalog,
}))
export default class NewProduct extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.ShowAttrModal = this.ShowAttrModal.bind(this);
    this.handleAssociate = this.handleAssociate.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleProductAttr = this.handleProductAttr.bind(this);
    this.handleSubmitProduct = this.handleSubmitProduct.bind(this);
    this.handleAddProductOtherAttr = this.handleAddProductOtherAttr.bind(this);
    this.handleAddOtherAttrFiled = this.handleAddOtherAttrFiled.bind(this);
    this.handleDeleteOtherAttrFiled = this.handleDeleteOtherAttrFiled.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onOk = this.onOk.bind(this);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      fields: {
        pics: [],
        other_attrs: [],
      },
      newFiled: {}, // 用户自定义的其他属性
      otherAttrsFiled: [],
      otherAttrs: [],
      file: { uid: '', name: '' },
      isPicture: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
    });
    // 请求目录列表
    dispatch({
      type: 'catalog/fetchLevel',
    });
    // 获取upload_token
    dispatch({
      type: 'upload/fetch',
    });
  }

  onCancel() {
    this.setState({ isShowModal: false });
    this.setState({ isShowAttrMOdal: false });
  }

  onOk() {
    this.setState({ isShowModal: false });
    const { newFiled, otherAttrsFiled, otherAttrs } = this.state;
    const len = otherAttrsFiled.length - 100;
    if (newFiled.attr_name && newFiled.attr_value) {
      this.setState({ isShowAttrMOdal: false }); // 隐藏添加属性弹窗
      this.setState({
        otherAttrsFiled: [
          ...otherAttrsFiled,
          { id: len - 100, attr_name: newFiled.attr_name.value, attr_value: newFiled.attr_value.value },
        ],
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
   * 点击关联后事件
   * @param {string=} prdId 产品ID
   *
   * */
  handleAssociate(prdId) {
    const { history } = this.props;
    history.push(`/product/list/modify?origin_prdId=${prdId}`);
    this.setState({ isShowModal: false });
  }

  // 当表单被修改事件
  handleFormChange = (changedFields) => {
    console.log('handleFormChange', Object.keys(changedFields));
    if (Object.keys(changedFields)[0] === 'category') {
      const categoryIdsArr = changedFields.category;
      const [category_id_1, category_id_2, category_id_3, category_id_4] = categoryIdsArr;
      this.setState({
        fields: {
          ...this.state.fields,
          category_id_1,
          category_id_2,
          category_id_3,
          category_id_4,
        },
      });
    } else {
      this.setState({
        fields: { ...this.state.fields, ...changedFields },
      });
    }
  }

  /**
   * 当产品其他属性被修改事件[产品概述、详情、FAQ,其他属性，图片]
   * 
   * @param {object} obj json对象，产品属性key=>value
   * 
   */
  handleProductAttr(obj) {
    this.setState({
      fields: { ...this.state.fields, ...obj },
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
      newFiled: { id: newFiled.length - 100, ...newFiled, ...fileds },
    });
  }

  /**
   * 删除产品其他属性项目
   * 
   * @param {string} id 属性id
   * 
   */
  handleDeleteOtherAttrFiled(id) {
    const { otherAttrsFiled } = this.state;
    const newOtherAttrsFiled = otherAttrsFiled.filter((val, idx) => {
      return val.id !== id;
    });
    this.setState({
      otherAttrsFiled: newOtherAttrsFiled,
    });
    console.log('删除属性ID', id, newOtherAttrsFiled);    
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

  // 其他属性图片上传前处理：验证文件类型
  beforeUpload(key, file) {
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
  handleUploaderChange(key, fileList) {
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
   * 提交新产品信息
   * 
   */
  handleSubmitProduct() {
    const { fields, otherAttrs, otherAttrsFiled } = this.state;
    console.log('提交产品信息', { ...fields, other_attrs: otherAttrsFiled });
    const { dispatch, history } = this.props;
    dispatch({
      type: 'product/add',
      data: { ...fields, other_attrs: otherAttrsFiled, paf_url: [] },
      success: () => { history.push('/product/list'); },
      error: (res) => { message.error(handleServerMsg(res.msg)); },
    });
  }

  render() {
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
        defaultValue={text}      
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

    const buttonGrop = (
      <div style={{ display: 'inline-block', marginLeft: 20 }}>
        <Button type="primary" onClick={this.showModal}>关联产品数据模板</Button>
        <Button style={{ marginLeft: 20 }}>一键清除数据</Button>
      </div>);

    const { isShowModal, isShowAttrMOdal, otherAttrsFiled, file } = this.state;
    const { product, loading, catalog, upload } = this.props;

    console.log('新建产品state', this.state);

    return (
      <PageHeaderLayout title="新建产品信息">
        <Card bordered={false} loading={loading} className={styles['new-product-wrap']}>
          {/* 参照数据Modal */}
          <Modal
            width="80%"
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
          <NewProductForm
            data={this.state.fields}          
            onChange={this.handleFormChange}
            catalog={catalog.level}
            loading={loading}
            onAttrChange={this.handleProductAttr}
            uploadToken={upload.upload_token}
          />
          {/* 产品其他属性 */}
          <SectionHeader
            title="产品其他属性"
            extra={<Button style={{ marginLeft: 20 }} icon="plus" onClick={this.ShowAttrModal}>添加其他属性项</Button>}
          />
          <div style={{ width: 700, maxWidth: '70%' }}>
            <Table
              className="attr-table"
              bordered
              pagination={false}
              columns={attrClomns}
              dataSource={otherAttrsFiled}
              locale={{
                emptyText: '请点击上面按钮添加新属性',                
              }}
            />
          </div>
          <div className={styles['submit-btn-wrap']}>
            <Button>取消</Button>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
