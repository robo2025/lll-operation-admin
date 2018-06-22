import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Row, Input, Cascader, Select, Tabs, Upload, Button, Icon, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import RichEditorShow from '../../components/RichEditor/RichEidtorShow';
import { QINIU_SERVER } from '../../constant/config';
import { getFileSuffix, checkFile, handleServerMsgObj } from '../../utils/tools';
import { PIC_TYPES } from '../../constant/statusList';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ brand, product, upload, catalog, loading }) => ({
  brand,
  catalog,
  product,
  upload,
  loading,
}))
@Form.create()
export default class productModelNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      cadUrls: [],
      file: { uid: '', name: '' },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取upload_token
    dispatch({
      type: 'upload/fetch',
    });
    // 请求目录
    dispatch({
      type: 'catalog/fetchLevel',
    });
    // 请求品牌信息
    dispatch({
      type: 'brand/fetchAll',
    });
  }

  // 选择目录
  handleSelectCatelogChange = (value) => {
    const { selectedBrand } = this.state;
    this.setState({
      selectedCatalog: value,
    });
    if (selectedBrand) {
      this.dispatchQueryProductList({
        bno: selectedBrand.bno,
        category_id_1: value[0],
        category_id_2: value[1],
        category_id_3: value[2],
        category_id_4: value[3],
      });
    }
  }

  // 选择品牌
  handleSelectBrandChange = (value) => {
    const { selectedCatalog } = this.state;
    const { brand } = this.props;
    const { setFieldsValue } = this.props.form;
    const selectedBrand = brand.all.find(val => val.bno === value);
    this.setState({
      selectedBrand,
    });
    setFieldsValue({
      english_name: selectedBrand.english_name,
      registration_place: selectedBrand.registration_place,
    });
    if (selectedCatalog) {
      this.dispatchQueryProductList({
        bno: value,
        category_id_1: selectedCatalog[0],
        category_id_2: selectedCatalog[1],
        category_id_3: selectedCatalog[2],
        category_id_4: selectedCatalog[3],
      });
    }
  }

  // 选择产品
  handleSelectProductChange = (value) => {
    const { product } = this.props;
    const selectedProduct = product.all.find(val => val.pno === value);
    this.setState({
      selectedProduct,
      cadUrls: selectedProduct.cad_urls.map((val, idx) => ({
        uid: idx,
        name: val,
        status: 'done',
        url: val,
      })),
    });
  }

  // 向服务器请求产品列表
  dispatchQueryProductList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchByParams',
      params,
      success: (res) => {
        this.setState({ productList: res.data });
      },
    });
  }

  // 文件上传状态改变时处理
  handleChange = (key, { fileList }) => {
    this.setState({ [key]: fileList });
  }

  // 文件上传时处理
  beforeUpload = (file) => {
    this.setState({ file });
    const isRequiredPicType = checkFile(file.name, ['pdf', 'word']);
    if (!isRequiredPicType) {
      message.error('不支持当前文件格式');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('图像不能大于 1MB!');
    }
    return isRequiredPicType && isLt2M;
  }

  handleSubmitProductModel = () => {
    const { selectedProduct } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log('校验出错', err);
        return;
      }
      // 从fieldsValue中取出参数项
      const specs = [];
      const specKeys = Object.keys(fieldsValue).filter(val => /spec_/.test(val));
      specKeys.forEach((val) => {
        specs.push({
          spec_name: val.replace(/spec_/, ''), // 参数名称
          spec_value: fieldsValue[val], // 参数值
          sort: 0,
        });
      });

      // 
      this.dispatchAddProductModel({
        pno: selectedProduct.pno,
        partnumber: fieldsValue.partnumber, // 型号
        specs,
      });
    });
  }

  // 发起新增产品型号操作
  dispatchAddProductModel = (data) => {
    const { dispatch, history } = this.props;
    dispatch({
      type: 'productModel/add',
      data,
      success: () => { history.goBack(); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { catalog, brand, upload } = this.props;
    const {
      selectedBrand,
      selectedCatalog,
      productList,
      selectedProduct,
      cadUrls,
      file } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 15 },
    };
    const formItemLayout2 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 6 },
    };

    return (
      <PageHeaderLayout title="新建产品型号">
        <Card>
          <SectionHeader
            title="产品型号信息"
          />
          <div className={styles['product-info-wrap']} >
            <div style={{ float: 'left', width: '50%' }}>
              <Form layout="horizontal">
                <FormItem
                  label="所属类目"
                  {...formItemLayout}
                >
                  {getFieldDecorator('category', {
                    rules: [{
                      required: true,
                      message: '请选择分类！',
                    }],
                  })(
                    <Cascader
                      options={catalog.level}
                      placeholder="请您选择类目"
                      onChange={this.handleSelectCatelogChange}
                    />
                  )}
                </FormItem>
                <FormItem
                  label="品牌"
                  {...formItemLayout}
                >
                  {getFieldDecorator('bno', {
                    rules: [{
                      required: true,
                      message: '请选择产品品牌',
                    }],
                  })(
                    <Select
                      showSearch
                      placeholder="请选择一个品牌"
                      onChange={this.handleSelectBrandChange}
                    >
                      {
                        brand.all.map(val => (
                          <Option value={val.bno} key={val.bno}>{val.brand_name}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="英文名"
                  {...formItemLayout}
                >
                  {getFieldDecorator('english_name', {
                    rules: [{
                      required: false,
                      message: '请填写产品英文名',
                    }],
                  })(
                    <Input disabled />
                  )}
                </FormItem>
                <FormItem
                  label="产地"
                  {...formItemLayout}
                >
                  {getFieldDecorator('registration_place', {
                    rules: [{
                      required: false,
                      message: '请完善产品产地',
                    }],
                  })(
                    <Input disabled />
                  )}
                </FormItem>
                <FormItem
                  label="产品选择"
                  {...formItemLayout}
                >
                  {getFieldDecorator('product_name', {
                    rules: [{
                      required: true,
                      message: '请填写产品名称',
                    }],
                  })(
                    <Select
                      showSearch
                      placeholder="请选择一个品牌"
                      onChange={this.handleSelectProductChange}
                      disabled={!(selectedBrand && selectedCatalog)}
                    >
                      {
                        productList.map(val => (
                          <Option value={val.pno} key={val.pno}>{val.product_name}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="产品型号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('partnumber', {
                    rules: [{
                      required: true,
                      message: '请输入...',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Form>
            </div>
            <div style={{ float: 'left', maxWidth: 520, position: 'relative', top: -60 }}>
              <div style={{ marginBottom: 20 }}>
                <h3>产品图片</h3>
                <small>暂时支持格式：JPG/PNG/GIF/BMG/JPGE,文件大小请保持在100KB以内；</small>
              </div>
              <Row gutter={24} className={styles['pics-wrap']}>
                {
                  selectedProduct && selectedProduct.pics.map(val => (
                    <div className="pic-box" key={val.id}>
                      <img
                        src={val.img_url}
                        alt="图片"
                        width={120}
                        height={120}
                      />
                      <p className="upload-pic-desc">{PIC_TYPES[val.img_type]}</p>
                    </div>
                  ))
                }
              </Row>
            </div>
          </div>
          <div style={{ clear: 'both' }} />
          <SectionHeader
            title="规格参数"
          />
          <div className="spec-wrap" style={{ width: 800 }}>
            <Form>
              {
                selectedProduct && selectedProduct.specs.map(val => (
                  <FormItem
                    label={val.spec_name}
                    {...formItemLayout2}
                    key={val.id}
                  >
                    {getFieldDecorator(`spec_${val.spec_name}`, {
                      rules: [{
                        required: Boolean(val.is_require),
                        message: '该参数项必填',
                      }],
                    })(
                      <Input addonAfter={val.spec_unit} />
                    )}
                  </FormItem>
                ))
              }
            </Form>
          </div>
          <SectionHeader
            title="系列详情"
          />
          <div className="good-desc">
            <div className="cad-urls-wrap" style={{ width: 800 }}>
              <FormItem
                label="CAD图"
                {...formItemLayout2}
                extra="暂只支持PDF、WORD格式文档"
              >
                {getFieldDecorator('cad_urls', {
                  rules: [{
                    required: false,
                    message: '请上传CAD图',
                  }],
                })(
                  <Upload
                    name="file"
                    action={QINIU_SERVER}
                    listType="text"
                    fileList={cadUrls}
                    onPreview={this.handlePreview}
                    beforeUpload={this.beforeUpload}
                    onChange={({ ...rest }) => { this.handleChange('cadUrls', rest); }}
                    data={
                      {
                        token: upload.upload_token,
                        key: `product/attachment/cad/${file.uid}.${getFileSuffix(file.name)}`,
                      }
                    }
                  >
                    <Button>
                      <Icon type="upload" /> 上传
                    </Button>
                  </Upload>
                )}
              </FormItem>
            </div>
            <Tabs defaultActiveKey="1">
              <TabPane tab="*产品概述" key="1">
                <RichEditorShow content={selectedProduct && selectedProduct.summary} />
              </TabPane>
              <TabPane tab="*产品详情" key="2">
                <RichEditorShow content={selectedProduct && selectedProduct.description} />
              </TabPane>
              <TabPane tab="学堂" key="3" >
                <RichEditorShow content={selectedProduct && selectedProduct.course} />
              </TabPane>
              <TabPane tab="视频详解" key="4" >
                <RichEditorShow content={selectedProduct && selectedProduct.video} />
              </TabPane>
              <TabPane tab="常见问题FAQ" key="5" >
                <RichEditorShow content={selectedProduct && selectedProduct.faq} />
              </TabPane>
            </Tabs>
          </div>
          <div className={styles['submit-btn-wrap']} style={{ marginTop: 20 }}>
            <Button onClick={() => { history.goBack(); }}>取消</Button>
            <Button type="primary" onClick={this.handleSubmitProductModel}>提交</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
