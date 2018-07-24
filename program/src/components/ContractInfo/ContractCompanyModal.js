import React, { Fragment } from "react";
import moment from "moment";
import { Form, Table, Button, Row, Col, Input, DatePicker, Modal } from "antd";
import { connect } from "dva";
import styles from "./contract.less";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@Form.create()
@connect(({ contract, loading }) => ({
  contract,
  loading: loading.effects["contract/fetchSupplierList"]
}))
export default class ContractCompanyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      args: {
        page: 1,
        pageSize: 6
      },
      searchValues: {}
    };
  }
  // 供应商列表页码改变
  onPaginationChange = pagination => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;
    this.setState({
      args: {
        page: pagination.current,
        pageSize: pagination.pageSize
      }
    });
    dispatch({
      type: "contract/fetchSupplierList",
      offset: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
      params: searchValues
    });
  };
  // 供应商列表页搜索
  handleSearch = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { args } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {};
      if (fieldsValue.create_time && fieldsValue.create_time.length > 0) {
        values.created_start = fieldsValue.create_time[0].format("YYYY-MM-DD");
        values.created_end = fieldsValue.create_time[1].format("YYYY-MM-DD");
      }
      delete fieldsValue.create_time;
      for (let key in fieldsValue) {
        if (fieldsValue[key]) {
          values[key] = fieldsValue[key].trim();
        }
      }
      this.setState({
        args: {
          page: 1,
          pageSize: args.pageSize
        },
        searchValues: values
      });
      dispatch({
        type: "contract/fetchSupplierList",
        limit: args.pageSize,
        params: values
      });
    });
  };
  // 重置搜索
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { args } = this.state;
    form.resetFields();
    this.setState({
      args: {
        page: 1,
        pageSize: args.pageSize
      },
      searchValues: {}
    });
    dispatch({
      type: "contract/fetchSupplierList",
      limit: args.pageSize,
      offset: 0
    });
  };
  renderSupplierSearch() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        layout="inline"
        className={styles.tableListForm}
        onSubmit={this.handleSearch}
      >
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={7} xs={12}>
            <FormItem label="账号">
              {getFieldDecorator("username")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} xs={12}>
            <FormItem label="企业名称">
              {getFieldDecorator("company")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={9} xs={12}>
            <FormItem label="法人">
              {getFieldDecorator("legal")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} xs={12}>
            <FormItem label="手机">
              {getFieldDecorator("mobile")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} xs={12}>
            <FormItem label="联系邮箱">
              {getFieldDecorator("email")(<Input placeholder="请输入" />)}
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
  //   关闭模态框
  onCancel = () => {
    const { onCancel, form } = this.props;
    form.resetFields();
    onCancel();
    this.setState({
      args: {
        page: 1,
        pageSize: 6
      },
      searchValues: {}
    });
  };
  onChooseCompany = record => {
    const { onChooseCompany } = this.props;
    onChooseCompany(record);
    this.onCancel();
  };
  render() {
    const { contract, loading, visible } = this.props;
    const { supplierList, supplierTotal } = contract;
    const { args } = this.state;
    const { page, pageSize } = args;
    const columns = [
      {
        title: "序号",
        key: "idx",
        render: (text, record, index) => index + 1
      },
      {
        title: "账号",
        key: "username",
        dataIndex: "username"
      },
      {
        title: "企业名称",
        key: "company",
        render: record => record.profile.company
      },
      {
        title: "法人",
        key: "legal",
        render: record => record.profile.legal
      },
      {
        title: "手机",
        key: "mobile",
        dataIndex: "mobile"
      },
      {
        title: "邮箱",
        key: "email",
        dataIndex: "email",
        render: val => <span>{val || "--"}</span>
      },
      {
        title: "注册日期",
        key: "created_time",
        dataIndex: "created_time",
        render: val => moment(val * 1000).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "操作",
        key: "operation",
        render: record => (
          <a
            href="javascript:;"
            style={{ textDecoration: "none" }}
            onClick={()=>this.onChooseCompany(record)}
          >
            选择
          </a>
        )
      }
    ];
    const paginationOptions = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: supplierTotal,
      pageSizeOptions: ["6", "10"],
      pageSize: pageSize >> 0,
      current: page >> 0
    };
    return (
      <Fragment>
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
          <Table
            columns={columns}
            dataSource={supplierList}
            rowKey={record => record.id}
            pagination={paginationOptions}
            onChange={this.onPaginationChange}
            loading={loading}
          />
        </Modal>
      </Fragment>
    );
  }
}
