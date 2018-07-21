import React from "react";
import qs from "qs";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { Card, Spin, message,Row,Col } from "antd";
import DescriptionList from "../../components/DescriptionList";
import styles from "./contract.less";
import { connect } from "dva";
import user from "../../models/user";
const { Description } = DescriptionList;
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
    const {
      contract_no,
      contract_type,
      contract_urls,
      end_time,
      start_time
    } = contract_info||{};
    const { profile, username, mobile, email } = supplier_info || {};
    const { company, legal } = profile || {};

    return (
      <PageHeaderLayout title="供应商合同详情">
        <Spin spinning={loading}>
          <Card title="企业信息" className={styles["search-wrap"]}>
            <Row className={styles.contractDetail}>
                <Col>
                    <Col span={3} offset={8}>企业名称 ：</Col>
                    <Col span={12}>{company}</Col>
                </Col>
                <Col>
                    <Col span={3} offset={8}>企业法人 ：</Col>
                    <Col span={12}>{legal}</Col>
                </Col>
                <Col>
                    <Col span={3} offset={8}>账号 ：</Col>
                    <Col span={11}>{username}</Col>
                </Col>
                <Col>
                    <Col span={3} offset={8}>手机 ：</Col>
                    <Col span={11}>{mobile}</Col>
                </Col>
                <Col>
                    <Col span={3} offset={8}>邮箱 ：</Col>
                    <Col span={11}>{email}</Col>
                </Col>
            </Row>
          </Card>
          <Card title="合同信息" className={styles["search-wrap"]}>
            <DescriptionList size="large" col="3">
              <Description term="合同类型">{contract_type}</Description>
              <Description term="合同编号">{contract_no}</Description>
              <Description term="合同有效期">{start_time+end_time}</Description>
              <Description term="合同电子档">789</Description>
            </DescriptionList>
          </Card>
          <Card title="查看日志" className={styles["search-wrap"]}>
            <DescriptionList size="large" col="3">
              <Description term="合同类型">123</Description>
              <Description term="合同编号">789</Description>
              <Description term="合同有效期">789</Description>
              <Description term="企业法人">456</Description>
              <Description term="合同电子档">789</Description>
            </DescriptionList>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
