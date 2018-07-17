import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import SupplierOrder from './SupplierOrder';
import CustomerOrder from './CustomerOrder';
import solutionImg from '../../assets/solution.jpg';

const { Description } = DescriptionList;

const tabList = [
  {
    key: 'customer',
    tab: '询价单详情',
  },
  {
    key: 'supplier',
    tab: '报价详情',
  },
];
@connect(({ solution, loading }) => ({
  profile: solution.profile,
  loading: loading.models.solution,
}))
class SolutionDetail extends React.Component {
  state = {
    key: 'customer',
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'solution/fetchDetail',
      payload: location.href.split('=').pop(),
    });
  }
  onTabChange = (key) => {
    this.setState({ key });
  };
  render() {
    const { profile, loading } = this.props;
    const { customer, supplier } = profile;
    if (!customer) {
      return <Spin />;
    }
    const { sln_basic_info, sln_user_info } = customer;
    const contentList = {
      customer: <CustomerOrder profile={profile} />,
      supplier: <SupplierOrder profile={profile} />,
    };
    const extra = (
      <Row style={{ marginRight: 20 }}>
        <Col xs={24} sm={12}>
          <div>报价金额</div>
          <div style={{ fontSize: 25, color: 'green' }}>
            {supplier ? '￥' + supplier.sln_supplier_info.total_price : '-'}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div>状态</div>
          <div style={{ fontSize: 25, color: 'green' }}>
            {supplier === "M"? '已报价' : '未报价'}
          </div>
        </Col>
      </Row>
    );
    const headContent = (
      <DescriptionList size="small" col="2">
        <Description term="方案名称">{sln_basic_info.sln_name}</Description>
        <Description term="预算金额">
          <span style={{ color: 'red', fontSize: 20 }}>
            ￥{sln_basic_info.customer_price}
          </span>
        </Description>
        <Description term="方案编号">{sln_basic_info.sln_no}</Description>
        <Description term="意向付款比例">
          <span>阶段一（首款）{sln_user_info.pay_ratio}%</span>
          <span> 阶段二（尾款）{100 - sln_user_info.pay_ratio}%</span>
        </Description>
        <Description term="创建时间">
          {moment.unix(sln_basic_info.sln_date).format('YYYY-MM-DD HH:mm')}
        </Description>
        <Description term="客户备注">
          {sln_user_info.sln_note === '' ? '无' : sln_user_info.sln_note}
        </Description>
      </DescriptionList>
    );
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
      </PageHeaderLayout>
    );
  }
}

export default SolutionDetail;
