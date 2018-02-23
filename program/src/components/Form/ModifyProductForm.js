import React, { Component } from 'react';
import { Form, Spin, Cascader, Input, Row, Col, Upload, Icon, Modal, Button, Tabs } from 'antd';
import RichEditor from '../../components/RichEditor/RichEditor';

import styles from './product-info.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;

function getStanrdCatalog(data) {
  data.forEach((val) => {
    val.value = val.id;
    val.label = val.category_name;
    if (val.children.length > 0) {
      getStanrdCatalog(val.children);
    }
  });
}

@Form.create({
  mapPropsToFields(props) {
    const { data } = props;
    const fields = {};
    Object.keys(data).forEach((key) => {
      fields[key] = Form.createFormField({
        value: data[key],
      });
    });
    return {
      ...fields,
    };
  },
  onValuesChange(props, values) {
    props.onChange(values);
  },
})
class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
    };
  }

  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange(key, value) {
    const tempJson = {};
    tempJson[key] = value;
    this.props.onAttrChange(tempJson);
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
    };

    const { getFieldDecorator } = this.props.form;
    const { data, catalog, loading } = this.props;
    const { category } = data;
    const slectedCatagory = category ? [
      category.id,
      category.children.id,
      category.children.children.id,
    ] : [];
    const { previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    let uploaders = [];
    if (data.pics) {
      uploaders = data.pics.map(val => (
        <Col span={8} key={val.id}>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            fileList={[{
              uid: -1,
              name: '测试',
              url: val.img_url,
            }]}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          />
          <p className="upload-pic-desc">{val.img_type}</p>
        </Col>
      ));
    } else {
      return <Spin spinning={loading || true} />;
    }

    getStanrdCatalog(catalog);// 将服务器目录结构转换成组件标准结构

    return (
      <div className={styles['product-info-wrap']} >
        {/* 产品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal">
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              <Cascader
                defaultValue={slectedCatagory}
                options={catalog}
                placeholder="请您选择类目"
                onChange={(values) => { console.log('您选择的是', values); }}
              />
            </FormItem>
            <FormItem
              label="产品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('product_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="产品ID"
              {...formItemLayout}
            >
              {getFieldDecorator('pno', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              {getFieldDecorator('partnumber', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              {getFieldDecorator('brand_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="英文名"
              {...formItemLayout}
            >
              {getFieldDecorator('english_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              {getFieldDecorator('prodution_place', {
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
        </div >
        {/* 产品图片 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal >
        <div style={{ float: 'left', width: 360 }}>
          <h3>产品图片</h3>
          <Row gutter={24}>
            {uploaders}
            {
              (data.pics && data.pics.length < 6) ?
                (
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
                )
                : null
            }
          </Row>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="商品概述" key="1">
              <RichEditor
                onChange={(html) => { this.handleChange('summary', html); }}
                defaultValue={data.summary}
              />
            </TabPane>
            <TabPane tab="商品详情" key="2">
              <RichEditor
                onChange={(html) => { this.handleChange('description', html); }}
                defaultValue={data.description}
              />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="3" >
              <RichEditor
                onChange={(html) => { this.handleChange('faq', html); }}
                defaultValue={data.faq}
              />
            </TabPane>
          </Tabs>
        </div>
      </div >
    );
  }
}

export default ProductForm;
