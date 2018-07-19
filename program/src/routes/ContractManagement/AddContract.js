import React from "react";
import qs from "qs";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import ContractForm from "../../components/ContractInfo/ContractForm";
import ContractCompanyModal from "../../components/ContractInfo/ContractCompanyModal";
import { Modal, Button, Form, Input, Row, Col, DatePicker } from "antd";
import styles from "./contract.less";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ contract,upload }) => ({
  contract,upload
}))
@Form.create()
export default class AddContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: props.location.search,
      visible: false,
      fields: {}
    };
  }
  componentDidMount(){
      const {dispatch} = this.props;
      // 获取upload_token
    dispatch({
        type: 'upload/fetch',
      });
  }
  onCancel = () => {
    this.setState({
      visible: false
    });
  };
  onFormSubmit=(form)=>{
     
  }
  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "contract/fetchSupplierList",
      offset: 0,
      limit: 6
    });
    this.setState({
      visible: true
    });
  };
  onChooseCompany = record => {
    this.setState({
        fields:{...record,...record.profile},
        visible: false
    })
  };
  handleFieldsChange = (form,changeFields) => {
    console.log(form,changeFields)
    const {fields} = this.state;
    this.setState({
        fields:{...fields,...changeFields}
    })
  }
  render() {
    const { visible, fields } = this.state;
    const {upload} = this.props;
    console.log(fields);
    return (
      <PageHeaderLayout title="新增合同">
        <ContractForm 
        showModal={this.showModal} 
        {...fields} 
        upload_token={upload.upload_token}
        onChange = {this.handleFieldsChange}
        ></ContractForm>
        <ContractCompanyModal
          visible={visible}
          onCancel={this.onCancel}
          onChooseCompany={this.onChooseCompany}
          onSubmit={this.onFormSubmit}
        />
      </PageHeaderLayout>
    );
  }
}
