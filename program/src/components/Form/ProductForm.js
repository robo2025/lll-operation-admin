import React, { Component } from 'react';
import { Form, Input, Row, Col, Upload, Icon, Table, Button, Select, Tabs } from 'antd';

import styles from './product-info.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const InputGroup = Input.Group;
const { Option } = Select;

@Form.create()
class ProductForm extends Component {
  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { data } = this.props;
    for (const keyName in data) {
      if (data[keyName]) {
        const temp = {};
        temp[keyName] = data[keyName];
        setFieldsValue(temp);
      }
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
    };

    const columns = [{
      title: '采购量',
      dataIndex: 'num',
      key: 'num',
    }, {
      title: '销售单价(含税)',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '发货日',
      dataIndex: 'delivery',
      key: 'delivery',
    }];

    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    console.log(this.props);

    return (
      <div className={styles['product-info-wrap']}>
        {/* 产品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal">
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              {getFieldDecorator('cate', {
              })(
                <InputGroup compact >
                  <Select defaultValue="一级目录">
                    <Option value="Option1-1">电机</Option>
                    <Option value="Option1-2">电机</Option>
                  </Select>
                  <Select defaultValue="二级目录">
                    <Option value="Option2-1">传感器</Option>
                    <Option value="Option2-2">传感器</Option>
                  </Select>
                  <Select defaultValue="三级目录">
                    <Option value="Option2-1">轴</Option>
                    <Option value="Option2-2">轴</Option>
                  </Select>
                </InputGroup>
              )}
            </FormItem>
            <FormItem
              label="产品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="产品ID"
              {...formItemLayout}
            >
              {getFieldDecorator('product_id', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              {getFieldDecorator('type', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              {getFieldDecorator('band', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="英文名"
              {...formItemLayout}
            >
              {getFieldDecorator('en_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              {getFieldDecorator('place', {
              })(
                <Input />
              )}
            </FormItem>
          </Form>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem
                label="CAD图"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10 }}
              >
                <Upload>
                  <Button icon="upload">上传</Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem
                label=""
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10, offset: 9 }}
              >
                <span>商品设计图.cad</span>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                labelCol={{ span: 1 }}
                wrapperCol={{ span: 23 }}
              >
                <span>2017-12-29 12:36:45</span>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                labelCol={{ span: 1 }}
                wrapperCol={{ span: 12 }}
              >
                <div>
                  <a>删除</a>
                  <a>查看</a>
                </div>
              </FormItem>
            </Col>
          </Row>
        </div>
        {/* 商品图片和价格区间 */}
        <div style={{ float: 'left' }}>
          <h3>商品图片</h3>
          <Row gutter={24}>
            <Col span={8} >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {uploadButton}
              </Upload>
              <p className="upload-pic-desc">正面</p>                                                        
            </Col>
            <Col span={8} >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {uploadButton}
              </Upload>
              <p className="upload-pic-desc">反面</p>                                                        
            </Col>
            <Col span={8} >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {uploadButton}
              </Upload>
              <p className="upload-pic-desc">侧面</p>                                                        
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8} >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图</p>              
            </Col>
            <Col span={8} >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图</p>                           
            </Col>
            <Col span={8} >
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图</p>                           
            </Col>
          </Row>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="商品概述" key="1">
              <TextArea
                autosize={{
                  minRows: 20,
                }}
              />
            </TabPane>
            <TabPane tab="商品详情" key="2">
              <TextArea
                autosize={{
                  minRows: 20,
                }}
              />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="3" >
              <TextArea
                autosize={{
                  minRows: 20,
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default ProductForm;

