import React, { Component } from 'react';
import { Form, Input, Row, Col, Upload, Icon, Modal, Button, Tabs, message } from 'antd';
import RichEditor from '../../components/RichEditor/RichEditor';
import { checkFile, getFileSuffix, replaceObjFromArr, removeObjFromArr } from '../../utils/tools';
import { QINIU_SERVER, FILE_SERVER } from '../../constant/config';
import styles from './product-info.less';

const FILE_CDN = FILE_SERVER;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;
const CAD_TYPES = ['doc', 'docx', 'pdf', 'dwt', 'dxf', 'dxb'];// 支持的CAD文件格式
const FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的图片文件类型
const mapImageType = {// 图片类型：正面、反面、侧面、包装图
  a: '1',
  b: '2',
  c: '3',
  d4: '4',
  d5: '5',
  d6: '6',
};

// 拼凑单个商品图片数据
function getPic(key, pics) {
  if (!Array.isArray(pics)) {
    throw new Error('传参必须是一个数组');
  }
  const pic = pics.filter(val => (val.img_type >> 0 === key >> 0));
  console.log('pic', key, pic);
  if (pic.length > 0) {
    return [{
      id: pic[0].id,
      uid: pic[0].id,
      name: pic[0].img_type,
      url: /\/\//.test(pic[0].img_url) ? pic[0].img_url : FILE_CDN + pic[0].img_url,
    }];
  } else {
    return [];
  }
}

// 将服务器数据拼凑成upload组件接受格式
function getCAD(cads) {
  console.log('传参cds', cads);
  if (cads) {
    return cads.map((val, idx) => ({
      key: idx,
      uid: idx,
      name: 'CAD图',
      status: 'complete',
      url: val,
    }));
  } else {
    return [];
  }
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
})
class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.pics = props.data.pics ? props.data.pics : [];
    this.state = {
      previewVisible: false,
      previewImage: '',
      file: { uid: '', name: '' },
      pics: [], // 产品图片集合
      cadUrl: [], // 产品cad文件集合
      a: [],
      b: [],
      c: [],
      d4: [],
      d5: [],
      d6: [],
      cad_urls: [],
    };
  }

  componentDidMount() {
    const { bindFormObj } = this.props;
    if (bindFormObj) {
      bindFormObj(this.props.form);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('will reiceve', nextProps);
    const { pics, cad_urls } = nextProps.data;
    if (pics) {
      this.setState({
        pics,
        cad_urls: cad_urls || [],
        a: getPic('1', pics),
        b: getPic('2', pics),
        c: getPic('3', pics),
        d4: getPic('4', pics),
        d5: getPic('5', pics),
        d6: getPic('6', pics),

      });
    }
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


  // 处理目录改变
  handleMenuChange = (values) => {
    console.log('目录改变了:', values);
    this.props.onAttrChange({ selectedCatalog: values });
  }

  // 图片上传前处理：验证文件类型
  beforeUpload(key, file) {
    this.setState({ file });
    // console.log('before', file);
    if (key === 'cadUrl') {
      if (!checkFile(file.name, CAD_TYPES)) {
        message.error(`${file.name} 暂不支持上传`);
        return false;
      }
    } else if (!checkFile(file.name, FILE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      return false;
    }
  }

  // cad和图片上传时处理
  handleUploaderChange = (key, fileList) => {
    console.log('文件上传列表：', key, fileList);
    const { pics } = this.state;
    const { onAttrChange } = this.props;
    // 如果上传的是cad文件
    if (key === 'cadUrl') {
      // const tempJson = {};
      // tempJson[key] = fileList;
      // this.setState(tempJson);
      // fileList.slice(-1).forEach((file) => {
      //   if (file.status === 'done' || file.status === 'complete') {
      //     cadStrUrls.push(file.response ? file.response.key : file.url);
      //     onAttrChange({ cad_urls: [...cad_urls, file.response ? file.response.key : file.url] });
      //   } else if (!file.status || file.status === 'error') {
      //     message.error('上传cad文件出错');
      //   }
      // });
      console.log('传给服务器的cad_urls', fileList);
      return;
    }
    // 如果上传的是图片
    if (key !== 'cadUrl') {
      console.log('图片状态改变-----------', key, fileList);
      const tempJson = {};
      tempJson[key] = fileList;
      this.setState(tempJson);
      // 上传成功，则将图片放入state里的pics数组内
      if (fileList.length === 0) {
        this.setState({ pics: removeObjFromArr({ img_type: mapImageType[key] }, pics, 'img_type') });
        onAttrChange({ pics: removeObjFromArr({ img_type: mapImageType[key] }, pics, 'img_type') });
      }
      fileList.map((file) => {
        if (file.status === 'done') {
          message.success(`${file.name} 文件上传成功`);
          // that.setState({ file_url: file.response.key });
          if (key === 'a') {
            this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '1', img_url: file.response.key }, pics, 'img_type') });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '1', img_url: file.response.key }] });
          } else if (key === 'b') {
            this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '2', img_url: file.response.key }, pics, 'img_type') });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '2', img_url: file.response.key }] });
          } else if (key === 'c') {
            this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '3', img_url: file.response.key }, pics, 'img_type') });
            onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '3', img_url: file.response.key }] });
          } else if (key.substr(0, 1) === 'd') {
            const idx = key.substr(1, 1);
            this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: idx, img_url: file.response.key }, pics, 'img_type') });
            onAttrChange({
              pics: [...pics, { id: pics.length - 100, img_type: idx, img_url: file.response.key }],
            });
          }
        } else if (file.status === 'error') {
          message.error(`${file.name} 文件上传失败`);
        }
        return file;
      });
    } else if (key === 'cad_urls') {
      console.log('cad fileList', fileList);
    }
  }

  removeCAD = (file) => {
    console.log('移除文件', file);
  }

  render() {
    const formItemLayout = {
      labelCol: { md: { span: 4 }, xxl: { span: 3 } },
      wrapperCol: { md: { span: 16 }, xxl: { span: 12 } },
    };
    const { getFieldDecorator } = this.props.form;
    const { data, catalog, loading, uploadToken } = this.props;
    const { previewVisible, previewImage, a, b, c, d4, d5, d6, file, cad_urls, cadUrl } = this.state;
    const { category } = data;
    const slectedCatagory = category ? [
      category.category_name,
      category.children.category_name,
      category.children.children.category_name,
      category.children.children.children.category_name,
    ] : [];
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <div className={styles['product-info-wrap']} >
        {/* 产品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal">
            <FormItem
              label="所属类目"
              {...formItemLayout}
            >
              <span>{slectedCatagory.join('-')}</span>
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              <span>{data.brand ? data.brand.brand_name : ''}</span>
            </FormItem>
            <FormItem
              label="品牌英文名"
              {...formItemLayout}
            >
              <span>{data.brand ? data.brand.english_name : ''}</span>
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              <span>{data.brand ? data.brand.registration_place : ''}</span>
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
              label="产品ID"
              {...formItemLayout}
              style={{ display: 'none' }}
            >
              {getFieldDecorator('pno', {
                rules: [{ required: true }],
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="CAD图"
              {...formItemLayout}
            >
              {getFieldDecorator('cad_urls', {
                rules: [{ required: false }],
                initialValue: getCAD(data.cad_urls),
              })(
                <Upload
                  name="file"
                  action={QINIU_SERVER}
                  defaultFileList={getCAD(data.cad_urls)}
                  // fileList={cadUrl}
                  beforeUpload={currFile => (this.beforeUpload('cadUrl', currFile))}
                  // onChange={({ fileList }) => { this.handleUploaderChange('cadUrl', fileList); }}
                  onRemove={(currFile) => { this.removeCAD(currFile); }}
                  data={
                    {
                      token: uploadToken,
                      key: `product/attachment/cad/${file.uid}.${getFileSuffix(file.name)}`,
                    }
                  }
                >
                  <Button icon="upload">上传</Button>
                </Upload>
              )}
            </FormItem>
          </Form>
        </div >
        {/* 产品图片 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal >
        <div style={{ float: 'left', width: 360, position: 'relative', top: -60 }}>
          <div style={{ marginBottom: 20 }}>
            <h3>产品图片</h3>
            <small>暂时支持格式：JPG/PNG/GIF/BMG/JPGE,文件大小请保持在100KB以内；</small>
          </div>
          <Row gutter={24}>
            <Col span={8}>
              <Upload
                name="file"
                action={QINIU_SERVER}
                listType="picture-card"
                fileList={a}
                onPreview={this.handlePreview}
                beforeUpload={currFile => (this.beforeUpload('a', currFile))}
                onChange={({ fileList }) => { this.handleUploaderChange('a', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {(a.length >= 1) ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">正面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={QINIU_SERVER}
                listType="picture-card"
                fileList={b}
                onPreview={this.handlePreview}
                beforeUpload={currFile => (this.beforeUpload('b', currFile))}
                onChange={({ fileList }) => { this.handleUploaderChange('b', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {(b.length >= 1) ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">反面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={QINIU_SERVER}
                listType="picture-card"
                fileList={c}
                beforeUpload={currFile => (this.beforeUpload('c', currFile))}
                onPreview={this.handlePreview}
                onChange={({ fileList }) => { this.handleUploaderChange('c', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {(c.length >= 1) ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">侧面</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={QINIU_SERVER}
                listType="picture-card"
                fileList={d4}
                onPreview={this.handlePreview}
                beforeUpload={currFile => (this.beforeUpload('d4', currFile))}
                onChange={({ fileList }) => { this.handleUploaderChange('d4', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {(d4.length >= 1) ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图一</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={QINIU_SERVER}
                listType="picture-card"
                fileList={d5}
                onPreview={this.handlePreview}
                beforeUpload={currFile => (this.beforeUpload('a', currFile))}
                onChange={({ fileList }) => { this.handleUploaderChange('d5', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {(d5.length >= 1) ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图二</p>
            </Col>
            <Col span={8}>
              <Upload
                name="file"
                action={QINIU_SERVER}
                listType="picture-card"
                fileList={d6}
                onPreview={this.handlePreview}
                beforeUpload={currFile => (this.beforeUpload('a', currFile))}
                onChange={({ fileList }) => { this.handleUploaderChange('d6', fileList); }}
                data={
                  {
                    token: uploadToken,
                    key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                  }
                }
              >
                {(d6.length >= 1) ? null : uploadButton}
              </Upload>
              <p className="upload-pic-desc">包装图三</p>
            </Col>
          </Row>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="*产品概述" key="1">
              {/* <RichEditor
                onChange={(html) => { this.handleChange('summary', html); }}
                token={uploadToken}
                defaultValue={data.summary}
              /> */}
              <TextArea
                style={{ height: 500 }}
                defaultValue={data.summary}
                onChange={(e) => { this.handleChange('summary', e.target.value); }}
              />
            </TabPane>
            <TabPane tab="*产品详情" key="2">
              <RichEditor
                onChange={(html) => { this.handleChange('description', html); }}
                token={uploadToken}
                defaultValue={data.description}
              />
            </TabPane>
            <TabPane tab="学堂" key="3">
              <RichEditor
                onChange={(html) => { this.handleChange('description', html); }}
                token={uploadToken}
              />
            </TabPane>
            <TabPane tab="视频详解" key="4">
              <RichEditor
                onChange={(html) => { this.handleChange('description', html); }}
                token={uploadToken}
              />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="5" >
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

