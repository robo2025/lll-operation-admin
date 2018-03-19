import React, { Component } from 'react';
import { Form, Cascader, message, Input, Row, Col, Upload, Icon, Modal, Button, Tabs } from 'antd';
import RichEditor from '../../components/RichEditor/RichEditor';
import { checkFile, getFileSuffix } from '../../utils/tools';
import styles from './product-info.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的文件类型

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
  onValuesChange(props, values) {
    props.onChange(values);
  },
})
class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.state = {
      previewVisible: false,
      previewImage: '',
      isPicture: true,
      isCad: true,
      file: { uid: '', name: '' },
      pics: [], // 产品图片集合
      cad_url: [], // 产品cad文件集合
      a: [],
      b: [],
      c: [],
      d4: [],
      d5: [],
      d6: [],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // 输入框有改变时
  handleChange(key, value) {
    const tempJson = {};
    tempJson[key] = value;
    this.props.onAttrChange(tempJson);
  }

  // 图片上传前处理：验证文件类型
  beforeUpload(key, file) {
    this.setState({ file });
    // console.log('before', file);
    if (checkFile(file.name, ['cad'])) {
      this.setState({ isCad: true });
    } else if (checkFile(file.name, FILE_TYPES)) {
      this.setState({ isPicture: true });
    }
    if (key === 'cad_url') {
      if (!checkFile(file.name, ['cad'])) {
        message.error(`${file.name} 暂不支持上传`);
        this.setState({ isCad: false });
        return false;
      } 
    } else if (!checkFile(file.name, FILE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      this.setState({ isPicture: false });
      return false;
    }
  }

  // cad和图片上传时处理
  handleUploaderChange(key, fileList) {
    console.log('文件上传', key, fileList);
    const { pics, cad_url } = this.state;
    const { onAttrChange } = this.props;
    // 如果上传的是cad文件
    if (key === 'cad_url' && this.state.isCad) {
      fileList.slice(-1).forEach((file) => {
        if (file.status === 'done') {
          this.setState({ cad_url: [...cad_url, file.response.key] });
          onAttrChange({ cad_url: [...cad_url, file.response.key] });
        }
      });
      return;
    }
    // 如果上传的是图片
    if (this.state.isPicture) {
      const tempJson = {};
      tempJson[key] = fileList;
      this.setState(tempJson);
      // console.log('状态改变', fileList);
      const that = this;
      // 上传成功，则将图片放入state里的pics数组内
      fileList.map((file) => {
        if (file.status === 'done') {
          message.success(`${file.name} 文件上传成功`);
          // that.setState({ file_url: file.response.key });
          if (key === 'a') {
            this.setState({ pics: [...pics, { id: pics.length - 100, img_type: '1', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '1', img_url: file.response.key }] });
          } else if (key === 'b') {
            this.setState({ pics: [...pics, { id: pics.length - 100, img_type: '2', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '2', img_url: file.response.key }] });
          } else if (key === 'c') {
            this.setState({ pics: [...pics, { id: pics.length - 100, img_type: '3', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '3', img_url: file.response.key }] });
          } else if (key.substr(0, 1) === 'd') {
            const idx = key.substr(1, 1);
            this.setState({ pics: [...pics, { id: pics.length - 100, img_type: idx, img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: idx, img_url: file.response.key }] });
          }
        } else if (file.status === 'error') {
          message.error(`${file.name} 文件上传失败`);
        }
        return file;
      });
    } else if (this.state.isCad) {
      console.log('cad fileList', fileList);
    }
  }

  render() {
    console.log('state:', this.state);
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    };

    const { getFieldDecorator } = this.props.form;
    const { catalog, uploadToken } = this.props;
    const UPLOAD_URL = '//up.qiniu.com'; // 文件上传地址
    const { previewVisible, previewImage, a, b, c, d4, d5, d6, file } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    getStanrdCatalog(catalog);// 将服务器目录结构转换成组件标准结构    
    // console.log('目录', uploadToken);

    return (
      <div className={styles['product-info-wrap']} >
        {/* 产品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal">
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              {getFieldDecorator('category', {
                rules: [{ required: true }],
              })(
                <Cascader
                  options={catalog}
                  placeholder="请您选择类目"
                />
              )}
            </FormItem>
            <FormItem
              label="产品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('product_name', {
                rules: [{ required: true }],                
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              {getFieldDecorator('partnumber', {
                rules: [{ required: true }],                
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              {getFieldDecorator('brand_name', {
                rules: [{ required: true }],                
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="英文名"
              {...formItemLayout}
            >
              {getFieldDecorator('english_name', {
                rules: [{ required: false }],                
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              {getFieldDecorator('prodution_place', {
                rules: [{ required: true }],                
              })(
                <Input />
              )}
            </FormItem>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem
                  label="CAD图"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Upload
                    name="file"
                    action={UPLOAD_URL}
                    defaultFileList={this.state.cad_url}
                    beforeUpload={(currFile) => { this.beforeUpload('cad_url', currFile); }}
                    onChange={({ fileList }) => { this.handleUploaderChange('cad_url', fileList); }}
                    data={
                      {
                        token: uploadToken,
                        key: `product/attachment/cad/${file.uid}.${getFileSuffix(file.name)}`,
                      }
                    }
                  >
                    <Button icon="upload">上传</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div >
        {/* 商品图片 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal >
        <div style={{ float: 'left', maxWidth: 360 }}>
          <h3>商品图片</h3>
          <Row gutter={24}>
            <Col span={8}>
              <Upload
                name="file"
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}
                onChange={({ fileList }) => { this.handleUploaderChange('a', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {a.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">正面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}
                onChange={({ fileList }) => { this.handleUploaderChange('b', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {b.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">反面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}
                onChange={({ fileList }) => { this.handleUploaderChange('c', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {c.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">侧面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}
                onChange={({ fileList }) => { this.handleUploaderChange('d4', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {d4.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图1</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}
                onChange={({ fileList }) => { this.handleUploaderChange('d5', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {d5.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图2</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={UPLOAD_URL}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}
                onChange={({ fileList }) => { this.handleUploaderChange('d6', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {d6.length >= 1 ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图3</p>
            </Col>
          </Row>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="*产品概述" key="1">
              <RichEditor
                onChange={(html) => { this.handleChange('summary', html); }}
                token={uploadToken}                                                
              />
            </TabPane>
            <TabPane tab="*产品详情" key="2">
              <RichEditor
                onChange={(html) => { this.handleChange('description', html); }}
                token={uploadToken}                                                
              />
            </TabPane>
            <TabPane tab="*常见问题FAQ" key="3" >
              <RichEditor
                onChange={(html) => { this.handleChange('faq', html); }}
                token={uploadToken}                
              />
            </TabPane>
          </Tabs>
        </div>
      </div >
    );
  }
}

export default ProductForm;

