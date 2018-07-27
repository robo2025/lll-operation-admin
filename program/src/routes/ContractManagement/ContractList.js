import React, { Fragment } from 'react';
import qs from 'qs';
import moment from 'moment';
import {
    Form,
    Row,
    Col,
    Button,
    Icon,
    Badge,
    Select,
    Input,
    Card,
    Divider,
    Table,
    Modal,
    message,
    DatePicker,
  } from 'antd';
  import { connect } from 'dva';
  import locale from 'antd/lib/date-picker/locale/zh_CN';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { CONTRACT_STATUS } from '../../constant/statusList';
import styles from './contract.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const contractBadge = ['default', 'success', 'warning', 'error'];
@Form.create()
@connect(({ contract, loading }) => ({
  contract,
  loading: loading.effects['contract/fetch'],
  deleteLoading: loading.effects['contract/fetchDeleteContract'],
}))
export default class ContractList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, {
        ignoreQueryPrefix: true,
      }),
      searchValues: {},
      deleteVisible: false, // 确认删除模态框
      deleteInfo: {}, // 保存确认删除的对象
    };
  }
  componentDidMount() {
    const { args } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/fetch',
      offset: (args.page - 1) * args.pageSize,
      limit: args.pageSize,
    });
  }

  onCancel = () => {
    // 取消删除合同
    this.setState({
      deleteVisible: false,
    });
  };

  onTableChange = (pagination) => {
    // 表格页码发生改变
    const { dispatch, history } = this.props;
    const { searchValues } = this.state;
    this.setState({
      args: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    history.replace({
      search: `?page=${pagination.current}&pageSize=${pagination.pageSize}`,
    });
    dispatch({
      type: 'contract/fetch',
      offset: pagination.pageSize * (pagination.current - 1),
      limit: pagination.pageSize,
      params: searchValues,
    });
  };
  // 搜索条件
  handleSearch = (e) => {
    e.preventDefault();
    const { form, dispatch, history } = this.props;
    const { args } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { create_time, ...values } = fieldsValue;
      if (create_time && create_time.length > 0) {
        values.start_time = create_time[0].format('YYYY-MM-DD');
        values.end_time = create_time[1].format('YYYY-MM-DD');
      }
      const searchValues = {};
      for (const key in values) {
        if (values[key] && values[key].trim().length > 0) {
            searchValues[key] = values[key].trim();
        }
      }
      this.setState({
        searchValues,
        args: {
          page: 1,
          pageSize: args.pageSize,
        },
      });
      history.replace({
        search: `?page=1&pageSize=${args.pageSize}`,
      });
      dispatch({
        type: 'contract/fetch',
        offset: 0,
        limit: args.pageSize,
        params: searchValues,
      });
    });
  };
  handleFormReset = () => {
    const { form, history, dispatch } = this.props;
    const { args } = this.state;
    form.resetFields();
    this.setState({
      args: {
        page: 1,
        pageSize: args.pageSize,
      },
      searchValues: {},
    });
    history.replace({
      search: `?page=1&pageSize=${args.pageSize}`,
    });
    dispatch({
      type: 'contract/fetch',
      offset: 0,
      limit: args.pageSize,
    });
  };
    //   删除合同执行
    deleteContract = (record) => {
        // console.log(record);
        const { supplier_info } = record;
        const { profile } = supplier_info;
        this.setState({
          deleteVisible: true,
          deleteInfo: { ...profile, ...record },
        });
      };
      sureDelete = () => {
        // 确定删除合同
        const { deleteInfo, args, searchValues } = this.state;
        const { dispatch, history } = this.props;
        const { id } = deleteInfo;
        dispatch({
          type: 'contract/fetchDeleteContract',
          id,
          success: (res) => {
            message.success(res.msg);
            dispatch({
              type: 'contract/fetch',
              offset: 0,
              limit: args.pageSize,
              params: searchValues,
            });
            history.replace({ search: `?page=1&pageSize=${args.pageSize}` });
            this.setState({
              args: {
                page: 1,
                pageSize: args.pageSize,
              },
              deleteVisible: false,
            });
          },
          error: (res) => {
            message.error(res.msg);
          },
        });
      };
  renderForm() {
    const { form } = this.props;
    const { expandForm } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles.tableListForm} onSubmit={this.handleSearch}>
        <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="企业名称">
              {getFieldDecorator('company')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="法人">
              {getFieldDecorator('legal')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? (
          <Fragment>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="合同编号">
                  {getFieldDecorator('contract_no')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="合同类型">
                  {getFieldDecorator('contract_type')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="合同状态">
                  {getFieldDecorator('contract_status')(
                    <Select placeholder="请选择">
                      <Option value="">全部</Option>
                      <Option value="1">未过期</Option>
                      <Option value="2">即将过期</Option>
                      <Option value="3">已过期</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={9} sm={24}>
                <FormItem label="创建时间">
                  {getFieldDecorator('create_time')(<RangePicker locale={locale} />)}
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
    const { contract, loading, deleteLoading } = this.props;
    const { contractList, contractTotal } = contract;
    const { args, deleteVisible, deleteInfo } = this.state;
    const { page, pageSize } = args;
    const columns = [
      {
        title: '序号',
        width: '60px',
        key: 'idx',
        dataIndex: 'idx',
        render: (text, record, index) => index + 1,
      },
      {
        title: '合同编号',
        width: '200px',
        dataIndex: 'contract_no',
        key: 'contract_no',
      },
      {
        title: '合同类型',
        width: '200px',
        dataIndex: 'contract_type',
        key: 'contract_type',
      },
      {
        title: '企业名称',
        key: 'company',
        render: record => record.supplier_info.profile.company,
      },
      {
        title: '法人',
        width: '160px',
        key: 'legal',
        render: record => record.supplier_info.profile.legal,
      },
      {
        title: '手机',
        width: '160px',
        key: 'mobile',
        render: record => record.supplier_info.mobile,
      },
      {
        title: '合同有效期',
        width: '200px',
        key: 'startAndEnd',
        render: record => `${record.start_time} ~ ${record.end_time}`,
      },
      {
        title: '合同状态',
        width: '160px',
        dataIndex: 'contract_status',
        key: 'contract_status',
        render: val => (
          <Badge status={contractBadge[val]} text={CONTRACT_STATUS[val]} />
        ),
      },
      {
        title: '创建时间',
        width: '200px',
        key: 'created_time',
        dataIndex: 'created_time',
        render: val => moment(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        key: 'operation',
        width: 160,
        fixed: 'right',
        render: (record) => {
          return (
            <div className={styles.text_decoration}>
              <a
                href={`#/contractManagement/contractList/edit?id=${record.id}`}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                href={`#/contractManagement/contractList/view?id=${record.id}`}
              >
                查看
              </a>
              <Divider type="vertical" />
              <a
                href=" javascript:;"
                onClick={() => this.deleteContract(record)}
              >
                删除
              </a>
            </div>
          );
        },
      },
    ];
    const paginationOptions = {
      total: contractTotal,
      showSizeChanger: true,
      showQuickJumper: true,
      current: page >> 0,
      pageSize: pageSize >> 0,
    };
    return (
      <PageHeaderLayout title="供应商合同列表">
        <Card title="搜索条件" className={styles['search-wrap']}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card>
          <div className={styles.addInfo}>
            <Button type="primary">
              <a href="#/contractManagement/contractList/add">
                <Icon type="plus" /> 新增合同
              </a>
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={contractList}
            rowKey={record => record.id}
            scroll={{ x: 1700 }}
            pagination={paginationOptions}
            loading={loading}
            onChange={this.onTableChange}
          />
          <Modal
            visible={deleteVisible}
            title="删除合同"
            width="600px"
            onCancel={this.onCancel}
            footer={[
              <Button key="back" onClick={this.onCancel}>
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={deleteLoading}
                onClick={this.sureDelete}
              >
                确认
              </Button>,
            ]}
          >
            <Row className={styles.deleteModal}>
              <Col span={12}>
                <Col span={7}>合同编号：</Col>
                <Col span={17}>{deleteInfo.contract_no}</Col>
              </Col>
              <Col span={12}>
                <Col span={7}>企业名称：</Col>
                <Col span={17}>{deleteInfo.company}</Col>
              </Col>
            </Row>
            <p className={styles.deleteModalInfo}>
              确定删除该合同吗？删除后将不能恢复！
            </p>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
