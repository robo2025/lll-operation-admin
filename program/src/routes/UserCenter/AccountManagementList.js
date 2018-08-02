import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Table,
  message,
  Card,
  Icon,
  Input,
  Button,
  DatePicker,
  Modal,
  Spin,
} from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './userCenter.less';
import { NATURE, PROPLE_LEVEL, INDUSTRY } from '../../constant/statusList';
import DescriptionList from '../../components/DescriptionList';
import { getAreaBycode } from '../../utils/cascader-address-options';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Description } = DescriptionList;

const EditSubAccount = Form.create()((props) => {
    const { form, editSubModalVisible, subDetail, editLoading, onEditOk, onEditCancel } = props;
    const { getFieldDecorator } = form;
    const { profile } = subDetail;
    const { position } = profile || {};
    const handleOK = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const { realname, ...values } = fieldsValue;
            if (realname) {
                values.realname = realname.trim();
            }
            onEditOk(values, form);
        });
    };
    const handleCancel = () => {
        onEditCancel(form);
        form.resetFields();
    };
    const formItemLayout = {
        labelCol: {
            md: 6,
        },
        wrapperCol: {
            md: 15,
        },
    };
    return (
        <Modal 
        title={position} 
        visible={editSubModalVisible}
        onOk={handleOK}
        onCancel={handleCancel}
        >
            <Spin spinning={editLoading || false}>
            <Form>
                <FormItem label="联系人" {...formItemLayout}>
                {getFieldDecorator('realname', {
                    rules: [
                        { required: true, message: '请输入联系人', whitespace: true },
                        { max: 50, message: '长度不能超过50' },
                    ],
                })(
                    <Input placeholder="请输入" />
                )}
                </FormItem>
                <FormItem label="联系电话" {...formItemLayout}>
                {getFieldDecorator('telphone', {
                    rules: [
                        { required: true, message: '请输入联系电话' },
                        { pattern: /^1[0-9]{10}$/, message: '请输入正确的联系电话' },
                        { max: 50, message: '长度不能超过50' },
                    ],
                })(
                    <Input placeholder="请输入" />
                )}
                </FormItem>
            </Form>
            </Spin>
        </Modal>
    );
});
@Form.create()
@connect(({ userCenter, loading }) => ({
  userCenter,
  loading: loading.effects['userCenter/fetchList'],
  detailLoading: loading.effects['userCenter/fetchDetail'],
  subLoading: loading.effects['userCenter/fetchSubList'],
  editLoading: loading.effects['userCenter/fetchEditSubInfo'],
}))
export default class AccountManagementList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      args: {
        page: 1,
        pageSize: 10,
      },
      searchValues: {},
      deatilModalVisible: false, // 企业详情显示接口
      editSubModalVisible: false, // 编辑子账号接口
      subDetail: {},
      subTableLoading: false,
    };
  }
  componentDidMount() {
    this.onGetAccountList({
      params: {},
      offset: 0,
      limit: 10,
    });
  }
  onGetAccountList({ params, offset, limit }) { // 得到账号列表
    const { dispatch } = this.props;
    dispatch({
      type: 'userCenter/fetchList',
      params,
      offset,
      limit,
    });
  }
  onGetSubAccountList({ userId, offset, limit }) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userCenter/fetchSubList',
        userId,
        offset,
        limit,
      });
  }
//   点击编辑子账号
onEditSub = (record) => {
    this.setState({
        subDetail: record,
        editSubModalVisible: true,
        subTableLoading: true, // 子账号列表table的加载动画
    });
}
// 编辑子账号OK
onEditOk = (values, form) => {
    const { dispatch } = this.props;
    const { subDetail } = this.state;
    const { main_user_id, id } = subDetail;
    dispatch({
        type: 'userCenter/fetchEditSubInfo',
        userId: main_user_id,
        subUserId: id,
        params: values,
        success: (res) => {
            message.success(res.msg);
            form.resetFields();
            this.onGetSubAccountList({
                userId: main_user_id,
                offset: 0,
                limit: 10,
            });
            this.setState({
                editSubModalVisible: false,
            });
        },
        error: (res) => {
            if (res.msg.indexOf(':') !== -1) {
                message.error(res.msg.split(':')[1]);
            } else {
                message.error(res.msg);
            }
        },
    });
}
// 取消编辑子账号
onEditCancel = (form) => {
    form.resetFields();
    this.setState({
        editSubModalVisible: false,
    });
}
  onviewDeatil = (record) => {
    // 查看详情
    const { dispatch } = this.props;
    dispatch({
      type: 'userCenter/fetchDetail',
      userId: record.id,
      error: (res) => {
        message.error(res);
      },
    });
    this.onGetSubAccountList({
        userId: record.id,
        offset: 0,
        limit: 10,
    });
    this.setState({
      deatilModalVisible: true,
    });
  };
  // 取消查看详情
  ondetailModalCancel = () => {
    this.setState({
      deatilModalVisible: false,
      subTableLoading: false, // 子账号table动画初次不加载
    });
  };
  onPaginationChange = (pagination) => {
    const { searchValues } = this.state;
    this.setState({
      args: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.onGetAccountList({
      params: searchValues,
      offset: (pagination.current - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    const { args } = this.state;
    form.validateFields((err, fieldsValue) => {
      const { create_time, ...others } = fieldsValue;
      const values = {};
      if (create_time && create_time.length > 0) {
        values.created_start = create_time[0].format('YYYY-MM-DD');
        values.created_end = create_time[1].format('YYYY-MM-DD');
      }
      for (const key in others) {
        if (others[key] && others[key].trim().length > 0) {
          values[key] = others[key].trim();
        }
      }
      this.setState({
        args: {
          page: 1,
          pageSize: args.pageSize,
        },
        searchValues: values,
      });
      this.onGetAccountList({
        params: values,
        offset: 0,
        limit: args.pageSize,
      });
    });
  };
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    const { args } = this.state;
    this.setState({
      args: {
        page: 1,
        pageSize: args.pageSize,
      },
      searchValues: {},
    });
    this.onGetAccountList({
      params: {},
      offset: 0,
      limit: args.pageSize,
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
            <FormItem label="联系人">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        {expandForm ? (
          <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="创建时间">
                {getFieldDecorator('create_time')(
                  <RangePicker style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
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
    const { userCenter, loading, detailLoading, editLoading, subLoading } = this.props;
    const { deatilModalVisible, args, editSubModalVisible, subDetail, subTableLoading } = this.state;
    const { accountList, accountTotal, accountDetail, subList } = userCenter;
    const { mobile, email, username, profile } = accountDetail;
    const {
      company,
      nature,
      people_level,
      industry,
      district_id,
      license_url,
      orgcode_url,
      taxlicense_url,
    } =
      profile || {};
    const { page, pageSize } = args;
    const columns = [
      {
        title: '序号',
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '用户名',
        key: 'username',
        dataIndex: 'username',
      },
      {
        title: '企业名称',
        key: 'company',
        render: record => record.profile.company || '--',
      },
      {
        title: '注册时间',
        key: 'created_time',
        dataIndex: 'created_time',
        render: val => moment(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '手机号码',
        key: 'mobile',
        dataIndex: 'mobile',
      },
      {
        title: '企业邮箱',
        key: 'email',
        dataIndex: 'email',
        render: val => val || '--',
      },
      {
        title: '企业性质',
        key: 'nature',
        render: record => NATURE[record.profile.nature] || '--',
      },
      {
        title: '操作',
        width: 90,
        fixed: 'right',
        key: 'operation',
        render: record => (
          <a
            href=" javascript:;"
            style={{ textDecoration: 'none' }}
            onClick={() => this.onviewDeatil(record)}
          >
            查看详情
          </a>
        ),
      },
    ];
    const subColumns = [
      {
        title: '序号',
        key: 'idx',
        render: (record, text, index) => index + 1,
      },
      {
        title: '角色',
        key: 'position',
        render: record => record.profile.position || '--',
      },
      {
        title: '账号名',
        key: 'username',
        dataIndex: 'username',
        render: val => val || '--',
      },
      {
        title: '联系人',
        key: 'realname',
        render: record => record.profile.realname || '--',
      },
      {
        title: '联系人电话',
        key: 'telphone',
        render: record => record.profile.telphone || '--',
      },
      {
        title: '操作',
        width: 90,
        fixed: 'right',
        key: 'operation',
        render: record => (
          <a href=" javascript:;" style={{ textDecoration: 'none' }} onClick={() => this.onEditSub(record)}>
            编辑
          </a>
        ),
      },
    ];
    const paginationOptions = {
      current: page >> 0,
      pageSize: pageSize >> 0,
      showSizeChanger: true,
      showQuickJumper: true,
      total: accountTotal,
    };
    return (
      <PageHeaderLayout title="账号管理">
        <Card title="搜索条件" className={styles['search-wrap']}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card className={styles['search-wrap']}>
          <div className={styles.tableListForm}>
            <Table
              columns={columns}
              dataSource={accountList.map((ele, index) => {
                return { ...ele, key: index };
              })}
              loading={loading}
              scroll={{ x: 1200 }}
              pagination={paginationOptions}
              onChange={this.onPaginationChange}
            />
            <Modal
              title="企业详情"
              width={1000}
              visible={deatilModalVisible}
              onCancel={this.ondetailModalCancel}
              footer={[
                <div key="detail" style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={this.ondetailModalCancel}>取消</Button>
                </div>,
              ]}
            >
              <Spin spinning={subLoading && detailLoading}>
                <Card title="基本信息" className={styles['search-wrap']} bordered={false}>
                  <DescriptionList col={3}>
                    <Description term="用户名">{username}</Description>
                    <Description term="手机号码">{mobile}</Description>
                    <Description term="企业邮箱">{email}</Description>
                    <Description term="企业名称">{company}</Description>
                    <Description term="企业性质">{NATURE[nature]}</Description>
                    <Description term="公司人数">
                      {PROPLE_LEVEL[people_level]}
                    </Description>
                    <Description term="所属行业">
                      {INDUSTRY[industry]}
                    </Description>
                    <Description term="公司所在地">
                      {getAreaBycode(String(district_id)).join('-')}
                    </Description>
                  </DescriptionList>
                  <DescriptionList col={1} className={styles.license}>
                    <Description term="营业执照">
                      <span>
                        {license_url ? (
                          <a href={license_url} target="_blank">
                            <img src={license_url} alt="图片未找到" />
                          </a>
                        ) : (
                          '--'
                        )}
                        {orgcode_url ? (
                          <a href={orgcode_url} target="_blank">
                            <img src={orgcode_url} alt="图片未找到" />
                          </a>
                        ) : null}
                        {taxlicense_url ? (
                          <a href={taxlicense_url} target="_blank">
                            <img src={taxlicense_url} alt="图片未找到" />
                          </a>
                        ) : null}
                      </span>
                    </Description>
                  </DescriptionList>
                </Card>
                <Card title="账号信息" className={styles['search-wrap']} bordered={false}>
                  <Table 
                  columns={subColumns} 
                  dataSource={subList.map((ele) => { return { ...ele, key: ele.last_login }; })} 
                  pagination={false} 
                  loading={subTableLoading && subLoading}
                  />
                </Card>
              </Spin>
            </Modal>
            <EditSubAccount 
            editSubModalVisible={editSubModalVisible}
            subDetail={subDetail}
            editLoading={editLoading}
            onEditOk={this.onEditOk}
            onEditCancel={this.onEditCancel}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
