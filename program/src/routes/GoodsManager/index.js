import React, { Component } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import { Row, Col, Card, Form, Input, Checkbox, Select, Icon, Button, Menu, DatePicker, Modal, message, Cascader } from 'antd';
import GoodsTable from '../../components/StandardTable/GoodsTable';
import GoodCheckboxGroup from '../../components/Checkbox/GoodCheckboxGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { handleServerMsg } from '../../utils/tools';
import { PAGE_SIZE } from '../../constant/config';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const plainOptions = ['gno', 'product_name', 'brand_name', 'english_name', 'partnumber', 'prodution_place', 'category', 'stock', 'price', 'supplier_name', 'min_buy', 'audit_status', 'publish_status', 'created_time'];// 所有选项
function getStandardCategory(data) {
    data.map(ele => {
        ele.value = ele.id;
        ele.label = ele.category_name;
        if (ele.children && ele.children.length > 0 && ele.level < 3) {
            getStandardCategory(ele.children);
        } else {
            delete ele.children;
        }
    })
}

@connect(({ loading, good, catalog }) => ({
    good,
    catalog,
    loading: loading.models.good,
}))
@Form.create()
export default class GoodsMananger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            expandForm: false,
            selectedRows: [],
            formValues: {},
            isShowExportModal: false,
            exportFields: [], // 导出产品字段 
            isCheckAll: false, // 是否全选导出数据   
            args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, { ignoreQueryPrefix: true }),
        };
    }


    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        dispatch({
            type: 'good/fetch',
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize,
        });
        dispatch({
            type: "catalog/fetchLevel"
        })
    }

    onDatepickerChange = (date, dateString) => {
        // console.log(date, dateString);
    }

    // 导出数据复选框改变
    onExportFieldsChange = (fields) => {
        // console.log('exportFiles', fields);
        this.setState({
            exportFields: fields,
            isCheckAll: fields.length === plainOptions.length,
        });
    }

    // 全选按钮改变
    onCheckAllChange = (e) => {
        this.setState({
            isCheckAll: e.target.checked,
            exportFields: e.target.checked ? plainOptions : [],
        });
    }

    // 显示导出数据Modal
    showExportModal = () => {
        this.setState({ isShowExportModal: true });
    }

    // 取消导出数据
    handleCancel = () => {
        this.setState({ isShowExportModal: false });
    }
    // 确定导出数据
    handleOk = () => {
        this.setState({ isShowExportModal: false });
        const { dispatch } = this.props;
        dispatch({
            type: 'good/queryExport',
            fields: this.state.exportFields,
            success: (res) => {
                window.open('http://139.199.96.235:9005/api/admin/goods_reports?filename=' + res.filename);
            },
            error: (res) => { message.error(handleServerMsg(res.msg)); },
        });
    }

    // 上下架商品
    handlePublishGood = (gno, status) => {
        const { dispatch, history } = this.props;
        const { args, formValues } = this.state;
        dispatch({
            type: 'good/modifyGoodStatus',
            gno,
            goodStatus: status,
            success: () => {
                message.success('下架成功');
                console.log(formValues,args,1234567890)
                dispatch({
                    type: 'good/fetch',
                    offset: (args.page - 1) * args.pageSize,
                    limit: args.pageSize,
                    params:formValues
                });
            },
            error: (res) => {
                message.error(handleServerMsg(res.msg));
            },
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch, history } = this.props;
        const { formValues } = this.state;
        const params = {
            pageSize: pagination.pageSize,
            offset: (pagination.current - 1) * (pagination.pageSize),
        };
        // 分页：将页数提取到url上
        history.replace({
            search: `?page=${pagination.current}&pageSize=${pagination.pageSize}`,
        });
        this.setState({
            args:{
                page:pagination.current,
                pageSize:pagination.pageSize
            }
        })
        dispatch({
            type: 'good/fetch',
            offset: params.offset,
            limit: params.pageSize,
            params:formValues
        });
    }

    handleFormReset = () => {
        const { form, dispatch,history } = this.props;
        const {args} = this.state;
        form.resetFields();
        this.setState({
            formValues: {},
            args:{
                page:1,
                pageSize:args.pageSize
            }
        });
        // 分页：将页数提取到url上
        history.replace({
            search: `?page=1&pageSize=${args.pageSize}`,
        });
        dispatch({
            type: 'good/fetch',
            offset: 0,
            limit: args.pageSize,
        });
        dispatch({
            type: 'rule/fetch',
            payload: {},
        });
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }

    handleMenuClick = (e) => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

        if (!selectedRows) return;

        switch (e.key) {
            case 'remove':
                dispatch({
                    type: 'rule/remove',
                    payload: {
                        no: selectedRows.map(row => row.no).join(','),
                    },
                    callback: () => {
                        this.setState({
                            selectedRows: [],
                        });
                    },
                });
                break;
            default:
                break;
        }
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    }

    handleSearch = (e) => {
        e.preventDefault();

        const { dispatch, form ,history} = this.props;
        const {args} = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const createTime = {};
            if (fieldsValue.create_time && fieldsValue.create_time.length > 0) {
                createTime.created_start = fieldsValue.create_time[0].format('YYYY-MM-DD');
                createTime.created_end = fieldsValue.create_time[1].format('YYYY-MM-DD');
            }
            const categoryId = {};
            if (fieldsValue.category && fieldsValue.category.length > 0) {
                categoryId.category_id_1 = fieldsValue.category[0];
                categoryId.category_id_2 = fieldsValue.category[1];
                categoryId.category_id_3 = fieldsValue.category[2];
            }
            const values = {
                ...fieldsValue,
                ...createTime,
                ...categoryId
            };
            delete values.create_time;
            delete values.category;
            this.setState({
                formValues: values,
                args:{
                    page:1,
                    pageSize:args.pageSize
                }
            });
            history.replace({search: `?page=1&pageSize=${args.pageSize}`})
            dispatch({
                type: 'good/fetch',
                params: values,
                offset:0,
                limit: args.pageSize
            });
        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
        });
    }

    // 校验表单：传入的是this.props.form对象
    validateForm = (formObj) => {
        // 将子组件的this.props.form传给父组件，方便后面校验
        this.formObj = formObj;
    }


    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={5} md={12} sm={24}>
                        <FormItem label="商品 ID">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="商品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="品牌">
                            {getFieldDecorator('brand_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={7} md={12} sm={24}>
                        <FormItem label="型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
                            展开 <Icon type="down" />
                        </a>
                    </span>
                </div>
            </Form>
        );
    }

    renderAdvancedForm() {
        const { getFieldDecorator } = this.props.form;
        const { catalog } = this.props;
        const { level } = catalog;
        getStandardCategory(level);
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={5} md={12} sm={24}>
                        <FormItem label="商品 ID">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="商品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="品牌">
                            {getFieldDecorator('brand_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={7} md={12} sm={24}>
                        <FormItem label="型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={5} md={12} sm={24}>
                        <FormItem label="审核状态">
                            {getFieldDecorator('audit_status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="0">未审核</Option>
                                    <Option value="1">审核通过</Option>
                                    <Option value="2">审核不通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="上下架状态">
                            {getFieldDecorator('publish_status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="">全部</Option>
                                    <Option value="0">下架中</Option>
                                    <Option value="1">上架中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="价格">
                            <InputGroup>
                                {getFieldDecorator('min_price')(
                                    <Input style={{ width: 130, textAlign: 'center' }} placeholder="最低价" />
                                )}
                                <Input style={{ width: 35, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                {getFieldDecorator('max_price')(
                                    <Input style={{ width: 130, textAlign: 'center', borderLeft: 0 }} placeholder="最高价" />
                                )}
                            </InputGroup>
                        </FormItem>
                    </Col>
                    <Col xxl={7} md={12} sm={24}>
                        <FormItem label="所属类目">
                            {getFieldDecorator('category')(
                                <Cascader options={level} changeOnSelect placeholder="请选择类目" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={12} sm={24}>
                        <FormItem label="商品提交日期">
                            {getFieldDecorator('create_time')(
                                <RangePicker />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <span style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
                            收起 <Icon type="up" />
                        </a>
                    </span>
                </div>
            </Form>
        );
    }

    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    render() {
        const { loading, good } = this.props;
        const { selectedRows, args, isShowExportModal } = this.state;
        const data = good.list;
        const { total } = good;
        const page = args.page >>0;
        const pageSize = args.pageSize >>0;
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
                <Menu.Item key="approval">批量审批</Menu.Item>
            </Menu>
        );

        // 导出数据Modal标题
        const exportCom = (
            <h4>
                导出数据
        <Checkbox
                    style={{ marginLeft: 20 }}
                    onChange={this.onCheckAllChange}
                    checked={this.state.isCheckAll}
                >
                    全选
        </Checkbox>
            </h4>
        );

        return (
            <PageHeaderLayout title="商品管理">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false} className={styles['good-manager-wrap']}>
                    <div className={styles.tableList}>

                        <div className={styles.tableListOperator}>
                            <Button onClick={this.showExportModal}>导出数据</Button>
                        </div>
                        <Modal
                            visible={isShowExportModal}
                            width="600px"
                            title={exportCom}
                            onCancel={this.handleCancel}
                            onOk={this.handleOk}
                        >
                            <GoodCheckboxGroup
                                onChange={this.onExportFieldsChange}
                                isCheckAll={this.state.isCheckAll}
                                checkedList={this.state.exportFields}
                            />
                        </Modal>
                        <GoodsTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            total={total}
                            current={page}
                            pageSize ={pageSize}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                            onPublish={this.handlePublishGood}
                            defaultPage={args.page}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
