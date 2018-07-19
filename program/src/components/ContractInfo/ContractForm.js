import React, { Fragment } from "react";
import UUID from "uuid";
import {
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  Upload,
  Icon,
  message,
  Divider
} from "antd";
import { QINIU_SERVER, FILE_SERVER } from "../../constant/config";
import { getFileSuffix } from "../../utils/tools";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@Form.create({
  mapPropsToFields(props) {
    console.log(props);
    const fields = {};
    if (props) {
      Object.keys(props).forEach(key => {
        fields[key] = Form.createFormField({
          value: props[key]
        });
      });
      return { ...fields };
    }
  },
  onValuesChange(props, values) {
    const { form } = props;
    props.onChange(form, values);
  }
  //   onFieldsChange(props, changedFields) {
  //       console.log(changedFields)
  //     props.onChange(changedFields);
  //   },
})
export default class ContractForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadToken: {},
      fileList: []
    };
  }
  beforeUpload = currFile => {
    const suffixArr = currFile.name.split(".");
    const suffix = suffixArr[suffixArr.length - 1].toLowerCase();
    if (suffix !== "pdf") {
      message.warning("文件格式不正确");
      return false;
    }
    const isLt2M = currFile.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.warning("图片大小必须小于5M!");
      return false;
    }
    const { upload_token } = this.props;
    let cadId = UUID().replace(/-/g, "");
    this.setState({
      uploadToken: {
        token: upload_token,
        key: `contract/cad/${cadId}.${getFileSuffix(currFile.name)}`
      }
    });
  };
  handleUploaderChange = info => {
    // let fileList = info.fileList;
    // let fileList = info.fileList.slice(-1).filter(file => {
    //   if(file.response){
    //     return file.status === "done";
    //   }
    //   return;
    // });
    console.log(info.file,1234565)
    // if(info.file.status === "done") {
    //     this.setState({
    //         fileList:[info.file]
    //     })
        return true;
    // }
    // return true;
    // console.log(fileList)
    // if(fileList.length) {
    //     this.setState({
    //         fileList
    //     })
    //     console.log(123456)
    //     return true;
    // }
    
    // console.log(fileList)
  };
  removePdf = () => {
    this.setState({
      fileList: []
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { uploadToken, fileList } = this.state;
    const formItemLayout = {
      labelCol: {
        md: { span: 7 },
        xs: { span: 7 }
      },
      wrapperCol: {
        md: { span: 11 },
        xs: { span: 11 }
      }
    };
    return (
      <Fragment>
        <Form>
          <Card bordered={false}>
            <FormItem label="企业信息" {...formItemLayout}>
              <Button type="primary" onClick={this.props.showModal}>
                选择企业
              </Button>
            </FormItem>
            <FormItem label="企业名称" {...formItemLayout}>
              {getFieldDecorator("company")(<Input disabled />)}
            </FormItem>
            <FormItem label="法人" {...formItemLayout}>
              {getFieldDecorator("legal")(<Input disabled />)}
            </FormItem>
            <FormItem label="账号" {...formItemLayout}>
              {getFieldDecorator("username")(<Input disabled />)}
            </FormItem>
            <FormItem label="手机" {...formItemLayout}>
              {getFieldDecorator("mobile")(<Input disabled />)}
            </FormItem>
            <FormItem label="联系邮箱" {...formItemLayout}>
              {getFieldDecorator("email")(<Input disabled />)}
            </FormItem>
          </Card>
          <Card bordered={false} style={{ marginTop: 30 }}>
            <FormItem label="合同类型" {...formItemLayout}>
              {getFieldDecorator("contract_type", {
                rules: [
                  { required: true, message: "请输入合同类型" },
                  {
                    max: 50,
                    message: "请确保输入长度小于50"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="合同编号" {...formItemLayout}>
              {getFieldDecorator("contract_no", {
                rules: [
                  { required: true, message: "请输入合同编号" },
                  {
                    max: 50,
                    message: "请确保输入长度小于50"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="合同有效期" {...formItemLayout}>
              {getFieldDecorator("create_time", {
                rules: [{ required: true, message: "请选择合同有效期" }]
              })(<RangePicker />)}
            </FormItem>
            <FormItem label="合同电子档" {...formItemLayout}>
              {getFieldDecorator("contract_urls", {
                rules: [
                  {
                    required: true,
                    message: "请上传合同电子档"
                  }
                ]
              })(
                <Fragment>
                  <div style={{ fontSize: "12px" }}>
                    （请上传合同扫描件的PDF文件，文件大小不大于5M）
                  </div>
                  <Upload
                    name="file"
                    action={QINIU_SERVER}
                    fileList={this.state.fileList}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleUploaderChange}
                    data={uploadToken}
                  >
                    <Button
                      icon="upload"
                      style={{
                        border: "1px solid #b3d8ff",
                        color: "#409eff",
                        background: "#ecf5ff"
                      }}
                    >
                      {fileList.length ? "重新上传" : "上传"}
                    </Button>
                  </Upload>
                </Fragment>
              )}
            </FormItem>
            <div style={{ textAlign: "center", margin: "20px 0 40px 0" }}>
              <Button type="primary" htmlType="submit">
                确认提交
              </Button>
            </div>
          </Card>
        </Form>
      </Fragment>
    );
  }
}
