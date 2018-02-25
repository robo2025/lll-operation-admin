/*
 * @Author: lll
 * @Date: 2018-02-01 11:30:59
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-25 23:21:13
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Modal, Row, Col, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NewProductForm from '../../components/Form/NewProductForm';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import AddAttrForm from '../../components/Form//AddAttrForm';
import styles from './newproduct.less';

const FormItem = Form.Item;

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
    this.onCancel = this.onCancel.bind(this);
    this.onOk = this.onOk.bind(this);
    this.state = {
      isShowModal: false,
      isShowAttrMOdal: false,
      fields: {
        pics: [],
        other_attrs: [],
      },
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
    this.setState({ isShowAttrMOdal: false });
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
   * 提交产品信息
   * 
   */
  handleSubmitProduct() {
    console.log('提交产品信息', this.state.fields);
    const { dispatch, history } = this.props;
    dispatch({
      type: 'product/add',
      data: this.state.fields,
      callback: history.push('/product/list'),
    });
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

    const buttonGrop = (
      <div style={{ display: 'inline-block', marginLeft: 20 }}>
        <Button type="primary" onClick={this.showModal}>关联参照数据</Button>
        <Button style={{ marginLeft: 20 }}>一键清除数据</Button>
      </div>);

    const { isShowModal, isShowAttrMOdal } = this.state;
    const { product, loading, catalog, upload } = this.props;

    console.log('newproduct state', this.state);

    return (
      <PageHeaderLayout title="新建产品信息">
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
            extra={buttonGrop}
          />
          <NewProductForm
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
