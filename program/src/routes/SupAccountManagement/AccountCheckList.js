import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Pagination,
  Divider,
  Cascader,
  Badge,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';
import options, { getAreaBycode } from '../../utils/cascader-address-options';

const company_type_status = {
  supplier: '厂家',
  integrator: '集成商',
  agency: '代理商',
  other: '其他',
};
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(({ supAudit, loading }) => ({
  supAudit,
  loading: loading.effects['supAudit/fetch'],
}))
@Form.create()
class AccountCheckList extends React.Component {
  state = {
    formExpand: false,
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'supAudit/fetch',
    });
  }
  onPageChange = (page, pageSize) => {
    const fieldsValue = this.props.form.getFieldsValue();
    const rangeValue = fieldsValue['range-picker'];
    const { district, ...others } = fieldsValue;
    this.props.dispatch({
      type: 'supAudit/savePagination',
      payload: { current: page, pageSize },
    });
    this.props.dispatch({
      type: 'supAudit/fetch',
      payload: {
        start_time:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        end_time:
          rangeValue && rangeValue.length
            ? rangeValue[1].format('YYYY-MM-DD')
            : null,
        province_id: district && district.length >= 1 ? district[0] : null,
        city_id: district && district.length >= 2 ? district[1] : null,
        district_id: district && district.length === 3 ? district[2] : null,
        ...others,
      },
    });
  };
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'supAudit/fetch',
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form, supAudit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const rangeValue = fieldsValue['range-picker'];
      const { district, ...others } = fieldsValue;
      const values = {
        ...others,
        start_time:
          rangeValue && rangeValue.length
            ? rangeValue[0].format('YYYY-MM-DD')
            : null,
        end_time:
          rangeValue && rangeValue.length
            ? rangeValue[1].format('YYYY-MM-DD')
            : null,
        province_id: district && district.length >= 1 ? district[0] : null,
        city_id: district && district.length >= 2 ? district[1] : null,
        district_id: district && district.length === 3 ? district[2] : null,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'supAudit/savePagination',
        payload: { ...supAudit.pagination, current: 1 },
      });
      dispatch({
        type: 'supAudit/fetch',
        payload: values,
      });
    });
  };
  render() {
    const { loading, supAudit } = this.props;
    const { supplierList, pagination } = supAudit;
    const { getFieldDecorator } = this.props.form;
    const paginationProps = {
      ...pagination,
      style: { float: 'right', marginTop: 24 },
      showQuickJumper: true,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      showSizeChanger: true,
    };
    const columns = [
      {
        title: '序号',
        key: 'id',
        render: (text, record, index) => index + 1,
      },
      {
        title: '账号',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '企业名称',
        dataIndex: 'company',
        key: 'company',
      },
      {
        title: '企业性质',
        dataIndex: 'company_type',
        key: 'company_type',
        render: text => company_type_status[text],
      },
      {
        title: '法人',
        dataIndex: 'legal',
        key: 'legal',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '联系邮箱',
        dataIndex: 'email',
        key: 'email',
        render: text => text || '-',
      },
      {
        title: '地区',
        dataIndex: 'district_id',
        key: 'district_id',
        render: text => getAreaBycode(`${text}`),
      },
      {
        title: '注册日期',
        dataIndex: 'date_joined',
        key: 'date_joined',
        render: text => moment.unix(text).format('YYYY-MM-DD'),
      },
      {
        title: '审核状态',
        dataIndex: 'audit_status',
        key: 'audit_status',
        render: text =>
          (text === 1 ? (
            <span>
              <Badge status="success" />通过
            </span>
          ) : text === 0 ? (
            <span>
              <Badge status="default" />待审核
            </span>
          ) : (
            <span>
              <Badge status="error" />未通过
            </span>
          )),
      },
      {
        title: '操作',
        key: 'option',
        render: row => (
          <Fragment>
            <a
              disabled={row.audit_status !== 0}
              onClick={() => {
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/supAccountManagement/accountCheck',
                    search: `?id=${row.id}`,
                  })
                );
              }}
            >
              审核
            </a>
            <Divider type="vertical" />
            <a
              disabled={row.audit_status !== 1}
              onClick={() => {
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/supAccountManagement/accountCheckModify',
                    search: `?id=${row.id}`,
                  })
                );
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/supAccountManagement/accountCheckDetail',
                    search: `?id=${row.id}`,
                  })
                );
              }}
            >
              查看
            </a>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="账号列表">
        <Card title="搜索条件">
          <Form
            onSubmit={this.handleSearch}
            layout="inline"
            className={styles.tableListForm}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="账号">
                  {getFieldDecorator('username')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="企业名称">
                  {getFieldDecorator('company')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>

              <Col xll={4} md={8} sm={24}>
                <FormItem label="企业性质">
                  {getFieldDecorator('company_type')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="">全部</Option>
                      <Option value="supplier">厂家</Option>
                      <Option value="agency">代理商</Option>
                      <Option value="integrator">集成商</Option>
                      <Option value="other">其他</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {this.state.formExpand ? (
              <Fragment>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="法人">
                      {getFieldDecorator('legal')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="手机">
                      {getFieldDecorator('mobile')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="联系邮箱">
                      {getFieldDecorator('email')(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="审核状态">
                      {getFieldDecorator('audit_status')(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                          <Option value="">全部</Option>
                          <Option value="0">待审核</Option>
                          <Option value="1">通过</Option>
                          <Option value="2">未通过</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="地区">
                      {getFieldDecorator('district')(
                        <Cascader
                          options={options}
                          changeOnSelect
                          placeholder="请选择"
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col xll={4} md={8} sm={24}>
                    <FormItem label="注册时间">
                      {getFieldDecorator('range-picker')(<RangePicker />)}
                    </FormItem>
                  </Col>
                </Row>
              </Fragment>
            ) : null}

            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={this.handleFormReset}
                >
                  重置
                </Button>
                <span
                  style={{ marginLeft: 8 }}
                  onClick={this.toggleForm}
                  className={styles.unfold}
                >
                  {this.state.formExpand ? (
                    <a
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        this.setState({ formExpand: false });
                      }}
                    >
                      收起<Icon type="up" />
                    </a>
                  ) : (
                    <a
                      style={{ marginLeft: 15 }}
                      onClick={() => {
                        this.setState({ formExpand: true });
                      }}
                    >
                      展开<Icon type="down" />
                    </a>
                  )}
                </span>
              </span>
            </div>
          </Form>
        </Card>
        <Card bordered={false} style={{ marginTop: 30 }} loading={loading}>
          <Table
            columns={columns}
            pagination={false}
            dataSource={supplierList}
          />
          <Pagination {...paginationProps} />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default AccountCheckList;
