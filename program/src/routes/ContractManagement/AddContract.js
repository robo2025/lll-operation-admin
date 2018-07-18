import React from "react";
import qs from "qs";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import ContractForm from "../../components/ContractInfo/ContractForm";
import ContractCompanyTable from "../../components/ContractInfo/ContractCompanyTable";
import { Modal, Button, Form, Input, Row, Col,DatePicker } from "antd";
import styles from "./contract.less";
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
@connect(({ contract, loading }) => ({ contract, loading }))
@Form.create()
export default class AddContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: props.location.search,
      visible: true
    };
  }
  componentDidMount(){
      const {dispatch} = this.props;
      dispatch({
          type:"contract/fetchSupplierList"
      })
  }
  onCancel = () => {
    this.setState({
      visible: false
    });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleSearch=()=>{

  }
  renderSupplierSearch() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" className={styles.tableListForm} onSubmit={this.handleSearch}>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={7} xs={12}>
            <FormItem label="账号">
              {getFieldDecorator("username")(<Input style={{ width: "100%" }} />)}
            </FormItem>
          </Col>
          <Col md={8} xs={12}>
            <FormItem label="企业名称">
              {getFieldDecorator("company")(<Input />)}
            </FormItem>
          </Col>
          <Col md={9} xs={12}>
            <FormItem label="法人">
              {getFieldDecorator("legal")(<Input />)}
            </FormItem>
          </Col>
          <Col md={7} xs={12}>
            <FormItem label="手机">
              {getFieldDecorator("mobile")(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} xs={12}>
            <FormItem label="联系邮箱">
              {getFieldDecorator("email")(<Input />)}
            </FormItem>
          </Col>
          <Col md={9} xs={12}>
            <FormItem label="注册时间">
              {getFieldDecorator("create_time")(<RangePicker />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: "hidden" }}>
          <span style={{ float: "right", marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }
  render() {
    const { visible } = this.state;
    const {contract} = this.props;
    const {supplierList, supplierTotal} = contract;
    return (
      <PageHeaderLayout title="新增合同">
        <ContractForm showModal={this.showModal} />
        <Modal
          title="企业信息"
          visible={visible}
          width={1200}
          onCancel={this.onCancel}
          footer={[
            <div style={{ textAlign: "center" }} key="cancel">
              <Button type="primary" onClick={this.onCancel}>
                返回
              </Button>
            </div>
          ]}
        >
          {this.renderSupplierSearch()}
          <ContractCompanyTable data={supplierList} total={supplierTotal}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
