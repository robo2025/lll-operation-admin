/*
 * @Author: lll
 * @Date: 2018-02-01 11:30:59
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-26 00:33:23
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Modal, Row, Col, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModifyProductForm from '../../components/Form/ModifyProductForm';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import AddAttrForm from '../../components/Form//AddAttrForm';
import { queryString } from '../../utils/tools';
import styles from './modify-product.less';

const FormItem = Form.Item;

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
    this.onCancel = this.onCancel.bind(this);
    this.onOk = this.onOk.bind(this);
    this.handleSubmitProduct = this.handleSubmitProduct.bind(this);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      args: queryString.parse(this.props.location.search),
      fields: this.props.product.detail,
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
      callback: (detail) => { 
        this.setState({ 
          fields: { 
            ...detail,
            category_id_1: detail.category.id, // 一级目录
            category_id_2: detail.category.children.id, // 二级目录
            category_id_3: detail.category.children.children.id, // 三级目录
            category_id_4: detail.category.children.children.children.id, // 四级目录
           },
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
  }

  onCancel() {
    this.setState({ isShowModal: false });
    this.setState({ isShowAttrMOdal: false });
  }

  onOk() {
    this.setState({ isShowModal: false });
    this.setState({ isShowAttrMOdal: false });
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
    this.setState({
      fields: { ...this.state.fields, ...obj },
    });
    console.log('产品信息', { ...this.state.fields, ...obj });
  }

  // 当表单输入框被修改事件
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  }

  
  /**
   * 提交产品信息
   * 
   */
  handleSubmitProduct() {
    const argsKey = Object.keys(this.state.args);
    console.log('产品信息', this.state.fields, Object.keys(this.state.args));
    const { dispatch } = this.props;
    
    if (argsKey.includes('prdId')) { // 如果是修改产品
      dispatch({
        type: 'product/modifyInfo',
        prdId: this.state.args.prdId,
        data: this.state.fields,
      });
    } else if (argsKey.includes('origin_prdId')) { // 如果是添加新产品
      dispatch({
        type: 'product/add',
        data: this.state.fields,
      });
    }
  }

  render() {
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

    const { isShowModal, isShowAttrMOdal } = this.state;
    const { product, loading, catalog, upload } = this.props;

    return (
      <PageHeaderLayout title="修改产品信息">
        <Card bordered={false} loading={loading}>
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
            <AddAttrForm />
          </Modal>
          <SectionHeader
            title="产品基础信息"
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
          <Form style={{ width: 700, maxWidth: '70%' }}>
            <FormItem
              label="控制输出"
              {...formItemLayout}
            >
              <Row gutter={12}>
                <Col span={6}>
                  <Input />
                </Col>
                <Col span={4}>
                  <Upload>
                    <Button icon="upload">上传</Button>
                  </Upload>
                </Col>
                <Col span={6}>
                  <span>图片：099884.jpg</span>
                </Col>
                <Col span={5}>
                  <span>
                    <a>删除</a>|
                    <a>查看</a>
                  </span>
                </Col>
              </Row>
            </FormItem>
            <FormItem
              label="检测物体"
              {...formItemLayout}
            >
              <Row gutter={12}>
                <Col span={6}>
                  <Input />
                </Col>
                <Col span={4}>
                  <Upload>
                    <Button icon="upload">上传</Button>
                  </Upload>
                </Col>
                <Col span={6}>
                  <span>图片：099884.jpg</span>
                </Col>
                <Col span={5}>
                  <span>
                    <a>删除</a>|
                    <a>查看</a>
                  </span>
                </Col>
              </Row>
            </FormItem>
            <FormItem
              label="形状"
              {...formItemLayout}
            >
              <Row gutter={12}>
                <Col span={6}>
                  <Input />
                </Col>
                <Col span={4}>
                  <Upload>
                    <Button icon="upload">上传</Button>
                  </Upload>
                </Col>
                <Col span={6}>
                  <span>图片：099884.jpg</span>
                </Col>
                <Col span={5}>
                  <span>
                    <a>删除</a>|
                    <a>查看</a>
                  </span>
                </Col>
              </Row>
            </FormItem>
          </Form>
          <div className={styles['submit-btn-wrap']}>
            <Button>取消</Button>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
