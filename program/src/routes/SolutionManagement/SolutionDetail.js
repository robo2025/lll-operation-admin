import React from "react";
import { connect } from "dva";
import moment from "moment";
import { Row, Col, Spin, Card, Table,Button } from "antd";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import DescriptionList from "../../components/DescriptionList";
import SupplierOrder from "./SupplierOrder";
import CustomerOrder from "./CustomerOrder";
import solutionImg from "../../assets/solution.jpg";

const { Description } = DescriptionList;

const tabList = [
  {
    key: "customer",
    tab: "询价单详情"
  },
  {
    key: "supplier",
    tab: "报价详情"
  }
];
@connect(({ solution, loading }) => ({
  profile: solution.profile,
  operationLogList: solution.operationLogList,
  offerOperationList:solution.offerOperationList,
  loading: loading.models.solution
}))
class SolutionDetail extends React.Component {
  state = {
    key: "customer"
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "solution/fetchDetail",
      payload: location.href.split("=").pop()
    });
    dispatch({
      type: "solution/fetchOperationLog",
      sln_no: location.href.split("=").pop()
    });
    dispatch({
        type:"solution/fetchOfferOperation",
        sln_no: location.href.split("=").pop()
    })
  }
  onTabChange = key => {
    this.setState({ key });
  };
  render() {
    const { profile, loading, operationLogList,offerOperationList } = this.props;
    const { customer, supplier } = profile;
    if (!customer) {
      return <Spin />;
    }
    const { sln_basic_info, sln_user_info } = customer;
    const contentList = {
      customer: <CustomerOrder profile={profile} />,
      supplier: <SupplierOrder profile={profile} offerOperationList={offerOperationList}/>
    };
    const extra = (
      <Row style={{ marginRight: 20 }}>
        <Col xs={24} sm={12}>
          <div>报价金额</div>
          <div style={{ fontSize: 25, color: "green" }}>
            {supplier ? "￥" + supplier.sln_supplier_info.total_price : "-"}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div>状态</div>
          <div style={{ fontSize: 25, color: "green" }}>
            {supplier === "M" ? "已报价" : "未报价"}
          </div>
        </Col>
      </Row>
    );
    const headContent = (
      <DescriptionList size="small" col="2">
        <Description term="方案名称">{sln_basic_info.sln_name}</Description>
        <Description term="预算金额">
          <span style={{ color: "red", fontSize: 20 }}>
            ￥{sln_basic_info.customer_price}
          </span>
        </Description>
        <Description term="方案编号">{sln_basic_info.sln_no}</Description>
        <Description term="意向付款比例">
          <span>阶段一（首款）{sln_user_info.pay_ratio}%</span>
          <span> 阶段二（尾款）{100 - sln_user_info.pay_ratio}%</span>
        </Description>
        <Description term="创建时间">
          {moment.unix(sln_basic_info.sln_date).format("YYYY-MM-DD HH:mm")}
        </Description>
        <Description term="客户备注">
          {sln_user_info.sln_note === "" ? "无" : sln_user_info.sln_note}
        </Description>
      </DescriptionList>
    );
    const columns = [
      {
        title: "序号",
        key: "idx",
        render: (record, text, index) => index + 1
      },
      {
        title: "操作类型",
        key: "operation_type",
        dataIndex: "operation_type"
      },
      {
        title: "操作员",
        key: "operator",
        dataIndex: "operator"
      },
      {
        title: "操作内容",
        key: "content",
        dataIndex: "content"
      },
      {
        title: "备注",
        key: "remark",
        dataIndex: "remark",
        render: val => val || "--"
      },
      {
        title: "操作时间",
        key: "add_time",
        dataIndex: "add_time",
        render: val => moment(val * 1000).format("YYYY-MM-DD HH:mm:ss")
      }
    ];
    const paginationOptions = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: operationLogList ? operationLogList.length : 0
    };
    return (
      <PageHeaderLayout
        title={`单号：${sln_basic_info.sln_no}`}
        logo={<img alt="logo" src={solutionImg} />}
        content={headContent}
        extraContent={extra}
        tabList={tabList}
        activeTabKey={this.state.key}
        onTabChange={this.onTabChange}
      >
        <Spin spinning={loading}>{contentList[this.state.key]}</Spin>
        <Card title="操作日志" style={{ marginTop: 30 }}>
          <Table
            columns={columns}
            dataSource={operationLogList.map(item=>{return {...item,key:item.add_time}})}
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
      </PageHeaderLayout>
    );
  }
}

export default SolutionDetail;
