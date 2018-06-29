import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Badge,
  Table,
  Form,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Button,
  Icon,
  Divider,
  Pagination,
  Modal,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './index.less';
import DescriptionList from '../../components/DescriptionList';
import { getAreaBycode } from '../../utils/cascader-address-options';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Description } = DescriptionList;
const supplierColumns = [
  {
    title: '供应商ID',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: '供应商用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '供应商公司名',
    dataIndex: 'profile.company',
    key: 'company',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '地区',
    dataIndex: 'profile.district_id',
    key: 'district_id',
    render: text => getAreaBycode(`${text}`),
  },
];
const AssignedModal = Form.create()((props) => {
  const {
    sln_no,
    sln_name,
    sln_date,
    user_name,
    modalVisible,
    handleAssigned,
    handleModalVisible,
    handleSupplierSearch,
    handleSupplierSelected,
    suppliers,
    loading,
    form,
  } = props;
  return (
    <Modal
      title="询价单派单"
      visible={modalVisible}
      onOk={handleAssigned}
      width={900}
      onCancel={() => {
        handleModalVisible(false);
      }}
    >
      <DescriptionList size="small" col="2">
        <Description term="方案询价单号">{sln_no}</Description>
        <Description term="方案名称">{sln_name}</Description>
        <Description term="客户">{user_name}</Description>
        <Description term="创建时间">
          {moment.unix(sln_date).format('YYYY-MM-DD HH:mm')}
        </Description>
      </DescriptionList>
      <Divider />
      <FormItem
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        label="可选供应商列表"
      >
        <div style={{ display: 'flex' }}>
          {form.getFieldDecorator('company')(<Input placeholder="请输入" />)}
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={() => handleSupplierSearch(form)}
          >
            搜索
          </Button>
        </div>
      </FormItem>
      <Table
        loading={loading}
        style={{ marginTop: 28 }}
        columns={supplierColumns}
        dataSource={suppliers}
        pagination={{ defaultPageSize: 5 }}
        rowSelection={{
          type: 'radio',
          onSelect: (record) => {
            handleSupplierSelected(record);
          },
        }}
      />
    </Modal>
  );
});
const slnStatus = (status) => {
  switch (status) {
    case 'P':
      return (
        <span>
          <Badge status="processing" />未报价
        </span>
      );
    case 'M':
      return (
        <span>
          <Badge status="success" />已报价
        </span>
      );
    case 'S':
      return (
        <span>
          <Badge status="default" />未发布
        </span>
      );
    default:
      return (
        <span>
          <Badge status="default" />无状态
        </span>
      );
  }
};
@connect(({ solution, loading }) => ({
  solution,
  loading: loading.effects['solution/fetch'],
  supplierFetchLoading: loading.effects['solution/fetchSuppliers'],
}))
@Form.create()
class SolutionList extends React.Component {
  state = {
    formExpand: false,
    modalVisible: false,
    rowSelected: {},
    suppilerSelected: {},
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'solution/fetch',
    });
  }
  onPageChange = (page, pageSize) => {
    const fieldsValue = this.props.form.getFieldsValue();
    const rangeValue = fieldsValue['range-picker'];
    this.props.dispatch({
      type: 'solution/savePagination',
      payload: { current: page, pageSize },
    });
    this.props.dispatch({
      type: 'solution/fetch',
      payload: {
        start_time: rangeValue ? rangeValue[0].format('YYYY-MM-DD') : null,
        end_time: rangeValue ? rangeValue[1].format('YYYY-MM-DD') : null,
        ...fieldsValue,
      },
    });
  };
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'solution/fetch',
    });
  };
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: flag,
    });
  };
  handleSupplierSelected = (supplier) => {
    this.setState({ suppilerSelected: supplier });
  };
  handleSupplierSearch = (form) => {
    const { company } = form.getFieldsValue();
    this.props.dispatch({
      type: 'solution/fetchSuppliers',
      payload: { company },
    });
  };
  handleAssigned = () => {
    const { rowSelected, suppilerSelected } = this.state;
    if (!suppilerSelected.id) {
      message.error('请选择供应商！');
      return;
    }
    this.props.dispatch({
      type: 'solution/handleAssigned',
      payload: {
        sln_no: rowSelected.sln_no,
        supplier_id: suppilerSelected.id,
      },
      callback: (success, data) => {
        if (success && success === true) {
          message.success(data);
          this.setState({ modalVisible: false });
          this.props.dispatch({
            type: 'solution/fetch',
          });
        } else {
          message.error(data);
        }
      },
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form, solution } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const rangeValue = fieldsValue['range-picker'];
      const { sln_no, is_type } = fieldsValue;
      const values = {
        start_time: rangeValue ? rangeValue[0].format('YYYY-MM-DD') : null,
        end_time: rangeValue ? rangeValue[1].format('YYYY-MM-DD') : null,
        sln_no,
        is_type,
      };
      dispatch({
        type: 'solution/savePagination',
        payload: { ...solution.pagination, current: 1 },
      });
      dispatch({
        type: 'solution/fetch',
        payload: values,
      });
    });
  };
  showAssignedModal = (row) => {
    this.setState({ modalVisible: true, rowSelected: row });
    if (this.props.solution.suppliers.length === 0) {
      this.props.dispatch({
        type: 'solution/fetchSuppliers',
      });
    }
  };
  render() {
    const { loading, form, solution, supplierFetchLoading } = this.props;
    const { list, pagination, suppliers } = solution;
    const { getFieldDecorator } = form;
    const paginationProps = {
      ...pagination,
      style: { float: 'right', marginTop: 24 },
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      showSizeChanger: true,
    };
    const columns = [
      {
        title: '序号',
        key: 'id',
        dataIndex: 'id',
        render: (text, record, index) => index + 1,
      },
      {
        title: '方案询价单号',
        dataIndex: 'sln_no',
        key: 'sln_no',
      },
      {
        title: '方案名称',
        dataIndex: 'sln_name',
        key: 'sln_name',
      },
      {
        title: '预算金额',
        dataIndex: 'customer_price',
        key: 'customer_price',
        render: text => <span>¥{text}</span>,
      },
      {
        title: '派单状态',
        dataIndex: 'assign_status',
        key: 'assign_status',
        render: text =>
          (text === 'Y' ? (
            <span>
              <Badge status="success" />已指派
            </span>
          ) : (
            <span>
              <Badge status="default" />
              未指派
            </span>
          )),
      },
      {
        title: '报价状态',
        dataIndex: 'sln_status',
        key: 'sln_status',
        render: text => slnStatus(text),
      },
      {
        title: '报价金额',
        dataIndex: 'supplier_price',
        key: 'supplier_price',
        render: text => (text === 0 ? '-' : `¥${text}`),
      },
      {
        title: '报价供应商',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        render: text => (text === '' ? '-' : text),
      },
      {
        title: '创建时间',
        dataIndex: 'sln_date',
        key: 'sln_date',
        render: text => moment.unix(text).format('YYYY-MM-DD HH:MM'),
      },
      {
        title: '操作',
        key: 'opreation',
        render: (row) => {
          return (
            <Fragment>
              {/* M：已报价 */}
              {row.sln_status === 'M' ? (
                <a>重置报价</a>
              ) : (
                // Y：已派单
                row.assign_status === 'Y' ? <a disabled>重置报价</a> : <a onClick={() => this.showAssignedModal(row)}>派单</a>
              )}
              <Divider type="vertical" />
              <a href={`${location.href}/solutionDetail?sln_no=${row.sln_no}`}>
                查看
              </a>
            </Fragment>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title="方案询价单列表">
        <Card title="搜索条件">
          <Form
            onSubmit={this.handleSearch}
            layout="inline"
            className={styles.tableListForm}
          >
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="方案询价单号">
                  {getFieldDecorator('sln_no')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="状态">
                  {getFieldDecorator('is_type')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="all">全部</Option>
                      <Option value="P">未报价</Option>
                      <Option value="M">已报价</Option>
                      <Option value="E">失效</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xll={4} md={8} sm={24}>
                <FormItem label="创建时间">
                  {getFieldDecorator('range-picker')(<RangePicker />)}
                </FormItem>
              </Col>
            </Row>
            {this.state.formExpand ? (
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col xll={4} md={8} sm={24}>
                  <FormItem label="应用">
                    {getFieldDecorator('no')(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="">全部</Option>
                        <Option value="2">焊接</Option>
                        <Option value="4">搬运</Option>
                        <Option value="6">码垛</Option>
                        <Option value="6">切割</Option>
                        <Option value="6">抛光</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xll={4} md={8} sm={24}>
                  <FormItem label="行业">
                    {getFieldDecorator('no')(
                      <Select placeholder="请选择" style={{ width: '100%' }}>
                        <Option value="">全部</Option>
                        <Option value="2">航空</Option>
                        <Option value="4">电力</Option>
                        <Option value="6">3C</Option>
                        <Option value="6">工业</Option>
                        <Option value="6">汽车</Option>
                      </Select>
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
        <Card bordered={false} loading={loading} style={{ marginTop: 30 }}>
          <Table columns={columns} dataSource={list} pagination={false} />
          <Pagination {...paginationProps} />
        </Card>
        <AssignedModal
          {...this.state.rowSelected}
          modalVisible={this.state.modalVisible}
          handleModalVisible={this.handleModalVisible}
          handleSupplierSelected={this.handleSupplierSelected}
          handleSupplierSearch={this.handleSupplierSearch}
          handleAssigned={this.handleAssigned}
          suppliers={suppliers}
          loading={supplierFetchLoading}
        />
      </PageHeaderLayout>
    );
  }
}
export default SolutionList;
