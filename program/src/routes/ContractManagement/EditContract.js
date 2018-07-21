import React from "react";
import qs from "qs";
import moment from 'moment';
import UUID from "uuid";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import ContractForm from "../../components/ContractInfo/ContractForm";
import { Form, message, Spin, Card,Table } from "antd";
@connect(({ contract, upload, loading }) => ({
  contract,
  upload,
  loading: loading.effects["contract/fetchContractDetail"]
}))
@Form.create()
export default class EditContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contractId: qs.parse(props.location.search, { ignoreQueryPrefix: true })
        .id,
      visible: false,
      fields: {},
      isChooseCompany: false,
      operationRecords:[]
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { contractId } = this.state;
    // 获取upload_token
    dispatch({
      type: "upload/fetch"
    });
    dispatch({
      type: "contract/fetchContractDetail",// 获取合同详情
      id: contractId,
      success: res => {
        let values = { ...res.data.contract_info, ...res.data.supplier_info };
        let passValues = {};
        passValues.create_time = [
          moment(values.start_time),
          moment(values.end_time)
        ];
        passValues.contract_urls = {
          name: values.contract_urls.split("@")[0],
          url: values.contract_urls.split("@")[1],
          uid: UUID().replace(/-/g, "")
        };
        const {
          id,
          username,
          profile,
          mobile,
          email,
          contract_no,
          contract_type
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
          fields: { ...passValues },

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
    e.preventDefault();
    const { dispatch, history } = this.props;
    const { contractId } = this.state;
    form.validateFields({ first: true }, (err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      let values = {};
      values.start_time = fieldsValue.create_time[0].format("YYYY-MM-DD");
      values.end_time = fieldsValue.create_time[1].format("YYYY-MM-DD");
      values.contract_urls = `${fieldsValue.contract_urls.name}@${
        fieldsValue.contract_urls.url
      }`;
      const { contract_type, contract_no, contract_urls } = fieldsValue;
      values = { contract_type, contract_no, contract_urls, ...values };
      dispatch({// 更新合同
        type: "contract/fetchEditContract",
        id: contractId,
        params: values,
        success: res => {
          console.log(res);
          message.success(res.msg, 1);
          history.replace("/contractManagement/contractList");
        },
        error: error => {
          message.error(error.msg);
        }
      });
    });
  };
  onRecordPaginationChange = (pagination) => {
    
  }
  render() {
    const { fields, isChooseCompany, contractId,args } = this.state;
    const { upload, contract, loading } = this.props;
    const {contractDetail} = contract;
    const {operation_records} = contractDetail;
    const paginationOptions = {
        showSizeChanger:true,
        showQuickJumper:true,
        total:operation_records?operation_records.length:0
    }
    const columns = [
      {
        title: "序号",
        key: "order",
        render: (record, text, index) => index + 1
      },
    //   {
    //     title: "操作人",
    //     key: "operator",
    //     render: (record, text, index) => index + 1
    //   },
      {
        title: "操作描述",
        key: "change_message",
        dataIndex:'change_message'
      },
      {
        title: "执行结果",
        key: "action_flag",
        dataIndex:'action_flag',
      },
      {
        title: "备注",
        key: "remarks",
        dataIndex:"remarks",
        render:(val) => val || '--'
      },
      {
        title: "时间",
        key: "created_time",
        dataIndex:'created_time',
        render: (val) => moment(val*1000).format("YYYY-MM-DD HH:mm:ss")
      },
    ];
    return (
      <PageHeaderLayout title="编辑合同">
        <Spin spinning={loading}>
          <ContractForm
            showModal={this.showModal}
            {...fields}
            upload_token={upload.upload_token}
            onChange={this.handleFieldsChange}
            onFormSubmit={this.onFormSubmit}
            isChooseCompany={isChooseCompany}
            contractId={contractId}
          />
          <Card title="操作日志" style={{marginTop:"30px"}}>
            <Table 
            columns={columns}
            dataSource={operation_records}
            pagination={paginationOptions}
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
