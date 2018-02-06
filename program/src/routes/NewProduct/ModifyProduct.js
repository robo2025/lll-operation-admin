/*
 * @Author: lll
 * @Date: 2018-02-01 11:30:59
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-06 22:29:46
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

import data from './product.json';

const FormItem = Form.Item;

@connect(({ loading, product, catalog }) => ({
  product,
  catalog,
  loading: loading.models.product,
}))
export default class ModifyProduct extends Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.ShowAttrModal = this.ShowAttrModal.bind(this);
    this.handleAssociate = this.handleAssociate.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onOk = this.onOk.bind(this);
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
    dispatch({
      type: 'rule/fetch',
    });
    // 请求产品列表
    dispatch({
      type: 'product/fetch',
    });
    // 请求产品详情
    dispatch({
      type: 'product/fetchDetail',
      productId: args.prdId || args.origin_prdId,
      callback: (detail) => { this.setState({ fields: detail }); },
    });
    // 请求目录列表
    dispatch({
      type: 'catalog/fetchLevel',
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
   * 点击关联后时间
   * @param {string=} prdId 产品ID
   *
   * */
  handleAssociate(prdId) {
    const { history } = this.props;
    history.push(`/product/list/modify?origin_prdId=${prdId}`);
    this.setState({ isShowModal: false });
  }


  // 当表单输入框被修改事件
  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    const buttonGrop = (
      <div style={{ display: 'inline-block', marginLeft: 20 }}>
        <Button type="primary" onClick={this.showModal}>关联参照数据</Button>
        <Button style={{ marginLeft: 20 }}>一键清除数据</Button>
      </div>);

    const { isShowModal, isShowAttrMOdal } = this.state;
    const { product, loading, catalog } = this.props;


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
          />
          <SectionHeader
            title="产品其他属性"
            extra={<Button style={{ marginLeft: 20 }} icon="plus" onClick={this.ShowAttrModal}>添加其他属性项</Button>}
          />
          <Form style={{ width: 700, maxWidth: '70%' }}>
            <FormItem
              label="控制输出"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
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
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
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
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
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
        </Card>
      </PageHeaderLayout>
    );
  }
}
