import React from "react";
import qs from "qs";
import UUID from 'uuid';
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import ContractForm from "../../components/ContractInfo/ContractForm";
import moment from "moment";
import { Form, message } from "antd";
@connect(({ contract, upload }) => ({
  contract,
  upload
}))
@Form.create()
export default class EditContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: qs.parse(props.location.search, { ignoreQueryPrefix: true }).id,
      visible: false,
      fields: {},
      isChooseCompany: false
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.state;
    // 获取upload_token
    dispatch({
      type: "upload/fetch"
    });
    dispatch({
      type: "contract/fetchContractDetail",
      id,
      success: res => {
        console.log(res);
        let values = { ...res.data.contract_info, ...res.data.supplier_info };
        let passValues = {};
        passValues.create_time = [
          moment(values.start_time),
          moment(values.end_time)
        ];
        passValues.contract_urls = {name:values.contract_urls.split('@')[0],url:values.contract_urls.split("@")[1],uid:UUID().replace(/-/g, "")}
        const {
          id,
          username,
          profile,
          mobile,
          email,
          contract_no,
          contract_type,
        } = values;
        const { company } = profile;
        passValues = {
          id,
          username,
          mobile,
          email,
          contract_no,
          contract_type,
          company,
          ...passValues 
        };

        this.setState({
          fields: { ...passValues }
        });
      }
    });
  }
  handleFieldsChange = changeFields => {
    //表单数据改变
    const { fields } = this.state;
    this.setState({
      fields: { ...fields, ...changeFields }
    });
  };
  onFormSubmit = (form, e) => {
    const { dispatch, history } = this.props;
    const { fields } = this.state;
    form.validateFields({ first: true, force: true }, (err, fieldsValue) => {
        console.log(fieldsValue)
      if (err) return;
      let values = {};
      values.start_time = fieldsValue.create_time[0].format("YYYY-MM-DD");
      values.end_time = fieldsValue.create_time[1].format("YYYY-MM-DD");
      const { id, company, contract_type, contract_no,contract_urls } = fieldsValue;
      values = { id, company, contract_type, contract_no, ...values };
    //   dispatch({
    //     type: "contract/fetchAddContract",
    //     params: values,
    //     success: res => {
    //       console.log(res);
    //       message.success(res.msg, 1);
    //       history.replace("/contractManagement/contractList");
    //     },
    //     error: error => {
    //       message.error(error.msg);
    //     }
    //   });
    });
  };
  render() {
    const { fields, isChooseCompany, id } = this.state;
    const { upload, contract } = this.props;
    return (
      <PageHeaderLayout title="编辑合同">
        <ContractForm
          showModal={this.showModal}
          {...fields}
          upload_token={upload.upload_token}
          onChange={this.handleFieldsChange}
          onFormSubmit={this.onFormSubmit}
          isChooseCompany={isChooseCompany}
          id={id}
        />
      </PageHeaderLayout>
    );
  }
}
