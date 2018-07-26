import React from "react";
import qs from "qs";
import moment from "moment";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { Card, Spin, message, Form, Table, Button } from "antd";
import DescriptionList from "../../components/DescriptionList";
import styles from "./contract.less";
import { ACTION_FLAG } from "../../constant/statusList";
const { Description } = DescriptionList;
const FormItem = Form.Item;
@connect(({ contract, loading }) => ({
  contract,
  loading: loading.effects["contract/fetchContractDetail"]
}))
export default class ContractDeatil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contractId: qs.parse(props.location.search, { ignoreQueryPrefix: true })
        .id
    };
  }
  componentDidMount() {
    const { contractId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: "contract/fetchContractDetail",
      id: contractId,
      success: res => {},
      error: res => {
        message.error(res.msg);
      }
    });
  }
  render() {
    const { loading, contract } = this.props;
    const { contractDetail } = contract;
    const { contract_info, operation_records, supplier_info } = contractDetail;
    const { contract_no, contract_type, contract_urls, end_time, start_time } =
      contract_info || {};
    const { profile, username, mobile, email } = supplier_info || {};
    const { company, legal } = profile || {};
    const formItemLayout = {
      labelCol: { span: 11 },
      wrapperCol: { span: 12 }
    };
    const paginationOptions = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: operation_records ? operation_records.length : 0
    };
    const columns = [
      {
        title: "序号",
        key: "order",
        render: (record, text, index) => index + 1
      },
      {
        title: "操作描述",
        width: "400px",
        key: "change_message",
        dataIndex: "change_message"
      },
      {
        title: "执行结果",
        key: "action_flag",
        dataIndex: "action_flag",
        render: val => ACTION_FLAG[val]
      },
      {
        title: "备注",
        key: "remarks",
        dataIndex: "remarks",
        render: val => val || "--"
      },
      {
        title: "时间",
        key: "created_time",
        dataIndex: "created_time",
        render: val => moment(val * 1000).format("YYYY-MM-DD HH:mm:ss")
      }
    ];
    return (
      <PageHeaderLayout title="供应商合同详情">
        <Spin spinning={loading}>
          <Card title="企业信息" className={styles["search-wrap"]}>
            <Form>
              <FormItem label="企业名称" {...formItemLayout}>
                <span>{company || "--"}</span>
              </FormItem>
              <FormItem label="企业法人" {...formItemLayout}>
                <span>{legal || "--"}</span>
              </FormItem>
              <FormItem label="帐号" {...formItemLayout}>
                <span>{username || "--"}</span>
              </FormItem>
              <FormItem label="手机" {...formItemLayout}>
                <span>{mobile || "--"}</span>
              </FormItem>
              <FormItem label="邮箱" {...formItemLayout}>
                <span>{email || "--"}</span>
              </FormItem>
            </Form>
          </Card>
          <Card title="合同信息" className={styles["search-wrap"]}>
            <Form>
              <FormItem label="合同类型" {...formItemLayout}>
                <span>{contract_type}</span>
              </FormItem>
              <FormItem label="合同编号" {...formItemLayout}>
                <span>{contract_no}</span>
              </FormItem>
              <FormItem label="合同有效期" {...formItemLayout}>
                <span>{`${start_time} ~ ${end_time}`}</span>
              </FormItem>
              <FormItem label="合同电子档" {...formItemLayout}>
                {contract_urls ? (
                  <a href={contract_urls.split("@")[1]} target="_blank">
                    {contract_urls.split("@")[0]}
                  </a>
                ) : null}
              </FormItem>
            </Form>
          </Card>
          <Card title="操作日志" style={{ marginTop: "30px" }}>
            <Table
              columns={columns}
              dataSource={
                operation_records
                  ? operation_records.map(item => {
                      return { ...item, key: item.created_time };
                    })
                  : []
              }
              pagination={paginationOptions}
            />
          </Card>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Button
              type="primary"
              size="large"
              style={{ width: 120 }}
              onClick={() => history.go(-1)}
            >
              返回
            </Button>
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
