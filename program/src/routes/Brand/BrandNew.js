import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Upload, Modal, Icon, message, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { QINIU_SERVER } from '../../constant/config';
import { getFileSuffix, checkFile, handleServerMsgObj } from '../../utils/tools';

import styles from './BrandNew.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};


@connect(({ brand, upload, loading }) => ({
  brand,
  upload,
  loading,
}))
@Form.create()
export default class BrandNew extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    file: { uid: '', name: '' },
    logoUrl: [],
    certificateUrls: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取upload_token
    dispatch({
      type: 'upload/fetch',
    });
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // 文件上传状态改变时处理
  handleChange = (key, { fileList }) => {
    this.setState({ [key]: fileList });
  }

  // 文件上传时处理
  beforeUpload = (file) => {
    console.log('上传文件', file);
    this.setState({ file });
    const isRequiredPicType = checkFile(file.name, ['png', 'jpg']);
    if (!isRequiredPicType) {
      message.error('不支持非png或jpg格式图片文件');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('图像不能大于 1MB!');
    }
    return isRequiredPicType && isLt2M;
  }

  // 提交品牌信息
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const { logoUrl, certificateUrls } = this.state;
        // logourl
        const logoUrlArr = logoUrl.map(val => (val.response.key)); // logo的url数组
        const certificateUrlArr = certificateUrls.map(val => val.response.key); // 证书的url数组
        const data = {
          ...values,
          logo_url: logoUrlArr[0],
          certificate_urls: certificateUrlArr,
        };
        this.dispatchAddBrand(data);
      } else {
        console.log('校验出错', err);
      }
    });
  }

  // 发起新增品牌调用接口操作
  dispatchAddBrand = (data) => {
    const { dispatch, history } = this.props;
    dispatch({
      type: 'brand/add',
      data,
      success: () => { message.success('品牌添加成功'); history.goBack(); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, file, certificateUrls, logoUrl } = this.state;
    const { upload, history } = this.props;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <PageHeaderLayout title="新增品牌">
        <Card bordered={false} style={{ marginBottom: 25 }}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="品牌名称"
            >
              {
                getFieldDecorator('brand_name', {
                  rules: [{
                    required: true,
                    message: '品牌名称必须填写',
                  }],
                })(
                  <Input placeholder="请输入品牌名称" />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="英文名(选填)"
            >
              {
                getFieldDecorator('english_name', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <Input placeholder="选填" />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="注册地"
            >
              {
                getFieldDecorator('registration_place', {
                  rules: [{
                    required: true,
                    message: '注册地必须填写',
                  }],
                })(
                  <Input placeholder="请填写品牌注册国家" />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="LOGO"
              extra="图片尺寸不大于__px*__px,大小不超过1M，格式PNG/JPG"
            >
              {
                getFieldDecorator('logo_url', {
                  rules: [{
                    required: true,
                    message: '您必须上传品牌LOGO',
                  }],
                })(
                  <div className="pic-box">
                    <Upload
                      name="file"
                      listType="picture-card"
                      className="avatar-uploader"
                      fileList={logoUrl}
                      action={QINIU_SERVER}
                      onPreview={this.handlePreview}
                      beforeUpload={this.beforeUpload}
                      onChange={({ ...rest }) => { this.handleChange('logoUrl', rest); }}
                      data={
                        {
                          token: upload.upload_token,
                          key: `product/images/brand/${file.uid}.${getFileSuffix(file.name)}`,
                        }
                      }
                    >
                      {logoUrl.length < 1 ? uploadButton : null}

                    </Upload>
                  </div>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌证书"
            >
              {
                getFieldDecorator('certificate_urls', {

                })(
                  <div className="pic-box">
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      listType="picture-card"
                      fileList={certificateUrls}
                      onPreview={this.handlePreview}
                      beforeUpload={this.beforeUpload}                      
                      onChange={({ ...rest }) => { this.handleChange('certificateUrls', rest); }}
                      data={
                        {
                          token: upload.upload_token,
                          key: `product/images/brand/${file.uid}.${getFileSuffix(file.name)}`,
                        }
                      }
                    >
                      {certificateUrls.length >= 3 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </div>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌介绍"
            >
              {
                getFieldDecorator('summary', {
                  rules: [{
                    required: false,
                  }],
                  initialValue: '',
                })(
                  <TextArea
                    autosize={{ minRows: 8, maxRows: 16 }}
                  />
                )
              }
              <p />
            </FormItem>
            <div className={styles['submit-box']}>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={() => { history.goBack(); }}>取消</Button>
            </div>
          </Form>
        </Card>
      </PageHeaderLayout >
    );
  }
}
