/*
 * @Author: lll
 * @Date: 2018-02-01 11:30:59
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-06 21:23:04
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Modal, Row, Col, Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NewProductForm from '../../components/Form/NewProductForm';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductList from '../../components/CustomTable/ProductList';
import AddAttrForm from '../../components/Form//AddAttrForm';

import data from './product.json';

const FormItem = Form.Item;

@connect(({ rule, loading, product }) => ({
  product,
  loading: loading.models.product,
}))
export default class NewProduct extends Component {
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
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
    dispatch({
      type: 'product/fetch',
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
    const { product, loading } = this.props;
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
            data={data}
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
