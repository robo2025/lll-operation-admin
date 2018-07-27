import React from 'react';
import { connect } from 'dva';
import {
    Form,
    message,
    Spin,
  } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ContractForm from '../../components/ContractInfo/ContractForm';
import ContractCompanyModal from '../../components/ContractInfo/ContractCompanyModal';

@connect(({ contract, upload, loading }) => ({
  contract,
  upload,
  loading: loading.effects['contract/fetchAddContract'],
}))
@Form.create()
export default class AddContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contractId: props.location.search,
      visible: false,
      fields: {},
      isChooseCompany: false,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取upload_token
    dispatch({
      type: 'upload/fetch',
    });
  }
  onCancel = () => {
    this.setState({
      visible: false,
    });
  };
 
  onChooseCompany = (record) => {
    // 选择企业进行绑定
    const { fields } = this.state;
    this.setState({
      fields: { ...fields, ...record, ...record.profile },
      isChooseCompany: true,
    });
  };
 
  onFormSubmit = (form, e) => {
    const { dispatch, history } = this.props;
    const { fields } = this.state;
    e.preventDefault();
    if (!fields.id) {
      message.warning('请选择企业');
      return;
    }
    form.validateFields({ first: true, force: true }, (err, fieldsValue) => {
      if (err) return;
      let values = {};
    //   console.log(fieldsValue);
      if (!fieldsValue.contract_urls) {
        message.warning('请上传合同电子档');
        return;
      }
      values.start_time = fieldsValue.create_time[0].format('YYYY-MM-DD');
      values.end_time = fieldsValue.create_time[1].format('YYYY-MM-DD');
      values.contract_urls = `${fieldsValue.contract_urls.name}@${
        fieldsValue.contract_urls.url
      }`;
      const { id, company, contract_type, contract_no } = fieldsValue;
      values = { id, company, contract_type, contract_no, ...values };
      dispatch({
        type: 'contract/fetchAddContract',
        params: values,
        success: (res) => {
        //   console.log(res);
          message.success(res.msg, 1);
          history.replace('/contractManagement/contractList');
        },
        error: (error) => {
          message.error(error.msg);
        },
      });
    });
  };
  showModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/fetchSupplierList',
      offset: 0,
      limit: 6,
    });
    this.setState({
      visible: true,
    });
  };
  handleFieldsChange = (changeFields) => {
    // 表单数据改变
    const { fields } = this.state;
    this.setState({
      fields: { ...fields, ...changeFields },
    });
  };
  render() {
    const { visible, fields, isChooseCompany, contractId } = this.state;
    const { upload, loading } = this.props;
    return (
      <PageHeaderLayout title="新增合同">
      <Spin spinning={loading || false}>
        <ContractForm
          showModal={this.showModal}
          {...fields}
          upload_token={upload.upload_token}
          onChange={this.handleFieldsChange}
          onFormSubmit={this.onFormSubmit}
          isChooseCompany={isChooseCompany}
          contractId={contractId}
        />
        <ContractCompanyModal
          visible={visible}
          onCancel={this.onCancel}
          onChooseCompany={this.onChooseCompany}
          onSubmit={this.onFormSubmit}
        />
      </Spin>
      </PageHeaderLayout>
    );
  }
}
