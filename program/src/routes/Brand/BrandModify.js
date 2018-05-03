import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Icon, Upload, Modal, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { QINIU_SERVER } from '../../constant/config';
import { queryString, getFileSuffix, checkFile, handleServerMsgObj } from '../../utils/tools';

import styles from './style.less';

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
export default class BrandModify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: queryString.parse(window.location.href),
      previewVisible: false,
      previewImage: '',
      file: { uid: '', name: '' },
      logoUrl: [],
      certificateUrls: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取服务器品牌详情
    dispatch({
      type: 'brand/fetchDetail',
      bno: args.bno,
      success: (res) => {
        this.setState({
          logoUrl: [{
            uid: 1,
            name: 'logo',
            status: 'done',
            url: res.data.logo_url,
          }],
          certificateUrls: res.data.certificate_urls.map((val, idx) => {
            return {
              uid: idx,
              name: '证书',
              status: 'done',
              url: val,
            };
          }),
        });
      },
    });
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

  // 文件上传状态改变时处理
  handleChange = (key, { fileList }) => {
    this.setState({ [key]: fileList });
  }

  // 提交品牌修改信息
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { logoUrl, certificateUrls } = this.state;
        // logourl
        const logoUrlArr = logoUrl.map(val => // logo的url数组
          (val.response ? val.response.key : val.url)
        );
        const certificateUrlArr = certificateUrls.map(val => // 证书的url数组
          (val.response ? val.response.key : val.url)
        );
        const data = {
          ...values,
          logo_url: logoUrlArr[0],
          certificate_urls: certificateUrlArr,
        };
        this.dispatchModifyBrand(data);
      } else {
        console.log('校验出错', err);
      }
    });
  }

  // 发起修改品牌调用接口操作
  dispatchModifyBrand = (data) => {
    const { dispatch, history } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'brand/modify',
      bno: args.bno,
      data,
      success: () => { message.success('品牌添加成功'); history.goBack(); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, file, certificateUrls, logoUrl } = this.state;
    const { brand, upload, history } = this.props;
    const { detail } = brand;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    console.log(this.state);

    return (
      <PageHeaderLayout title="修改品牌">
        <Card bordered={false} style={{ marginBottom: 25 }}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="品牌ID"
            >
              {
                getFieldDecorator('bno', {
                  initialValue: detail.bno,
                })(
                  <span>{detail.bno}</span>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌"
            >
              {
                getFieldDecorator('brand_name', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: detail.brand_name,
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
                  initialValue: detail.english_name,
                })(
                  <Input />
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
                  }],
                  initialValue: detail.registration_place,
                })(
                  <Input />
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
                      action={QINIU_SERVER}
                      fileList={logoUrl}                   
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
                  rules: [{
                    required: false,
                  }],
                })(
                  <div className="pic-box">
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      listType="picture-card"
                      fileList={certificateUrls}
                      beforeUpload={this.beforeUpload}
                      onRemove={(file1) => { console.log('移除文件', file1); }}
                      onPreview={this.handlePreview}
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
                  initialValue: detail.summary,
                })(
                  <TextArea
                    autosize={{ minRows: 8, maxRows: 16 }}
                  />
                )
              }
              <p />
            </FormItem>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            <div className={styles['submit-box']}>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={() => { history.goBack(); }}>取消</Button>
            </div>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
