import React, { Component } from 'react';
import { Card, Form, Input, Upload, Modal, Icon, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


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
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

@Form.create()
export default class BrandNew extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })


  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <PageHeaderLayout title="查看品牌">
        <Card bordered={false} style={{ marginBottom: 25 }}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="品牌名称"
            >
              {
                getFieldDecorator('brand', {
                  rules: [{
                    required: true,
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
                getFieldDecorator('en_name', {
                  rules: [{
                    required: false,
                  }],
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
                getFieldDecorator('register', {
                  rules: [{
                    required: true,
                  }],
                })(
                  <Input placeholder="请填写品牌注册国家" />
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="LOGO"
            >
              <div className="pic-box">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="//jsonplaceholder.typicode.com/posts/"
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                  {uploadButton}
                  {/* {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton} */}
                </Upload>
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌证书"
            >
              <div className="pic-box">
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌介绍"
            >
              {
                getFieldDecorator('desc', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: `固高科技(香港)有限公司成立于1999年，总部位于香港科技大学。创立者为自动化和微电子领域的国际知名
                  专家、学者。具有多年在加利福尼亚大学(UC Berkeley)、麻省理工学院 (MIT)、贝尔实验
                  室(Bell Lab)等国际一流科研机构进行研发和管理经验，同年，固高科技（深圳）有限公司成立。`,
                })(
                  <TextArea
                    autosize={{ minRows: 8, maxRows: 16 }}
                  />
                )
              }
              <p />
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
