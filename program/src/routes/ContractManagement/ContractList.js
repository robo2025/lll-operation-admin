import React from "react";
import qs from "qs";
import moment from "moment";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import {
  Form,
  Row,
  Col,
  Button,
  Icon,
  Badge,
  Select,
  Input,
  InputNumber,
  Card,
  Divider,
  Table
} from "antd";
import styles from "./contract.less";
import { connect } from "dva";
const FormItem = Form.Item;
const Option = Select.Option;
@Form.create()
@connect(({ contract, loading }) => ({ contract, loading }))
export default class ContractList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, {
        ignoreQueryPrefix: true
      })
    };
  }
  componentDidMount() {
    const { args } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: "contract/fetch",
      offset: (args.page - 1) * args.pageSize,
      limit: args.pageSize
    });
  }
  // 搜索条件
  handleSearch = () => {};
  renderForm() {
    const { form } = this.props;
    const { expandForm } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles.tableListForm} onSubmit={this.handleSearch}>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="企业名称">
              {getFieldDecorator("company")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="法人">
              {getFieldDecorator("legal")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col xll={4} md={8} sm={24}>
            <FormItem label="手机">
              {getFieldDecorator("mobile")(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {expandForm ? (
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="合同编号">
                  {getFieldDecorator("contract_no")(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="合同类型">
                  {getFieldDecorator("contract_type")(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="合同状态">
                  {getFieldDecorator("contract_status")(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="创建时间">
                  {getFieldDecorator("create_time")(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
            </Row>
          ) : null}
        </Row>
        <div style={{ overflow: "hidden" }}>
          <span style={{ float: "right", marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <span
              style={{ marginLeft: 8 }}
              onClick={this.toggleForm}
              className={styles.unfold}
            >
              {expandForm ? (
                <a
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    this.setState({ expandForm: false });
                  }}
                >
                  收起<Icon type="up" />
                </a>
              ) : (
                <a
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    this.setState({ expandForm: true });
                  }}
                >
                  展开<Icon type="down" />
                </a>
              )}
            </span>
          </span>
        </div>
      </Form>
    );
  }
  render() {
    const { contract } = this.props;
    const { contractList, contractTotal } = contract;
    const columns = [
      {
        title: "序号",
        key: "idx",
        dataIndex: "idx",
        render: (text, record, index) => index + 1
      },
      {
        title: "合同编号",
        dataIndex: "contract_no",
        key: "contract_no"
      },
      {
        title: "合同类型",
        dataIndex: "contract_type",
        key: "contract_type"
      },
      {
        title: "企业名称",
        key: "company",
        render: record => record.supplier_info.profile.company
      },
      {
        title: "法人",
        key: "legal",
        render: record => record.supplier_info.profile.legal
      },
      {
        title: "手机",
        key: "mobile",
        render: record => record.supplier_info.mobile
      },
      {
        title: "合同有效期",
        key: "startAndEnd",
        render: record => `${record.start_time} ~ ${record.end_time}`
      },
      {
        title: "合同状态",
        dataIndex: "contract_status",
        key: "contract_status"
      },
      {
        title: "创建时间",
        key: "created_time",
        dataIndex: "created_time",
        render: val => moment(val * 1000).format("YYYY-MM-DD HH:mm:ss")
      },
      {
        title: "操作",
        key: "operation",
        width: 160,
        fixed: "right",
        render: record => {
          return (
            <div className={styles.text_decoration}>
              <a href={`#/contractManagement/contractList/edit?id=${record.id}`}>编辑</a>
              <Divider type="vertical" />
              <a href={`#/contractManagement/contractList/add`}>查看</a>
              <Divider type="vertical" />
              <a href="javascript:;">删除</a>
            </div>
          );
        }
      }
    ];
    const paginationOptions = {
      total: contractTotal,
      showSizeChanger: true,
      showQuickJumper: true
    };
    return (
      <PageHeaderLayout title="供应商合同列表">
        <Card title="搜索条件"  className={styles['search-wrap']}>
        <div className={styles.tableListForm}>
        {this.renderForm()}
        </div>
        
        </Card>
        <Card>
            <div className={styles.addInfo}>
                <Button type="primary">
                    <a href={"#/contractManagement/contractList/add"}>
                    <Icon type="plus" /> 新增合同
                    </a>
                </Button>
            </div>
          <Table
            columns={columns}
            dataSource={contractList}
            rowKey={record => record.id}
            scroll={{ x: 1300 }}
            pagination={paginationOptions}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
