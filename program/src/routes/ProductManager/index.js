import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker, message, Modal, Checkbox, Popconfirm, Cascader } from 'antd';
import ProductTable from '../../components/StandardTable/ProductTable';
import CheckboxGroup from '../../components/Checkbox/CheckboxGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { handleServerMsgObj, queryString } from '../../utils/tools';
import { API_URL, PAGE_SIZE } from '../../constant/config';
import styles from './product-manager.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const plainOptions = ['pno', 'product_name', 'brand_name', 'registration_place', 'category', 'english_name', 'spec', 'creator', 'created_time', 'model_count'];

function getStanrdCatalog(data) {
    data.forEach((val) => {
        val.value = val.id;
        val.label = val.category_name;
        if (val.children && val.children.length > 0 && val.level < 3) {
            getStanrdCatalog(val.children);
        } else {
            delete val.children;
        }
    });
}
@connect(({ product, testApi, loading, catalog }) => ({
    product,
    testApi,
    catalog,
    loading: loading.models.product,
}))
@Form.create()
export default class ProductManager extends Component {
    constructor(props) {
        super(props);
        this.jumpToPage = this.jumpToPage.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.showExportModal = this.showExportModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.removeProducts = this.removeProducts.bind(this);
        this.querySupplyInfo = this.querySupplyInfo.bind(this);
        this.state = {
            expandForm: false,
            selectedRows: [],
            formValues: {},
            isShowExportModal: false,
            exportFields: [], // 导出产品字段
            exportDatePicker:{},  // 导出产品时间选择
            datePickerValue:"",// 导出产品默认时间
            isCheckAll: false,
            args: queryString.parse(props.location.search) || { page: 1, pageSize: 10 },
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        dispatch({
            type: 'product/fetch',
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize,
        });
        // 请求目录列表
        dispatch({
            type: 'catalog/fetchLevel',
        });
    }

    onChange = (date, dateString) => {
        // console.log(date, dateString);
    }

    // 全选按钮改变
    onCheckAllChange = (e) => {
        this.setState({
            isCheckAll: e.target.checked,
            exportFields: e.target.checked ? plainOptions : [],
        });
    }

    // 导出数据复选框改变
    onExportFieldsChange = (fields) => {
        this.setState({
            exportFields: fields,
            isCheckAll: fields.length === plainOptions.length,
        });
    }

    // 显示导出数据框
    showExportModal() {
        this.setState({ isShowExportModal: true });
    }

    // 取消导出数据
    handleCancel() {
        this.setState({
            datePickerValue:"",
            exportDatePicker:{},
            exportFields:[],
            isCheckAll:false,
            isShowExportModal: false
        })
    }
    onExportDatePickerChange=(date,dateString)=>{ // 导出产品时间选择
        console.log(date,dateString)
        this.setState({
            datePickerValue:date,
            exportDatePicker:{
                created_start:dateString[0],
                created_end:dateString[1],
            }
        })
    }
    // 确定导出数据
    handleOk() {
        const {exportDatePicker,exportFields} = this.state;
        const { dispatch } = this.props;
        if(this.state.exportFields.length <= 0) {
            message.warning('请选择导出项');
            return;
        }
        dispatch({
            type: 'product/queryExport',
            params:exportDatePicker,
            fields: exportFields,
            success: (res) => {
                window.open(`${API_URL}/product_reports?filename=${res.filename}`);
                this.setState({
                    datePickerValue:"",
                    exportDatePicker:{},
                    exportFields:[],
                    isCheckAll:false,
                    isShowExportModal: false
                })
            },
            error:(res) => {
                message.warning(res.msg);
            }
        });
    }


    // 修改产品
    editProduct(productId) {
        const { history } = this.props;
        history.push(`/product/list/modify?prdId=${productId}`);
    }

    // 删除产品
    removeProducts() {
        const { dispatch } = this.props;
        const pnos = this.state.selectedRows.map(val => val.pno);
        if (pnos.length <= 0) {
            message.error('请先选择要删除的产品');
            return;
        }
        dispatch({
            type: 'product/remove',
            pnos,
            error: (res) => { message.error(handleServerMsgObj(res.msg)); },
        });
    }

    // 获取供货信息
    querySupplyInfo(productId) {
        const { dispatch } = this.props;
        dispatch({
            type: 'product/querySupplyInfo',
            productId,
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch, history } = this.props;
        const { formValues } = this.state;

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            offset: (pagination.current - 1) * (pagination.pageSize),
        };
        this.setState({
            args: {
                page: pagination.current,
                pageSize: pagination.pageSize
            }
        })
        // 分页：将页数提取到url上
        history.replace({
            pathname: '/product/list',
            search: `?page=${params.currentPage}&pageSize=${params.pageSize}`,
        });

        dispatch({
            type: 'product/fetch',
            offset: params.offset,
            limit: params.pageSize,
            params: formValues
        });
    }

    handleFormReset = () => {
        const { form, dispatch, history } = this.props;
        const { args } = this.state;
        form.resetFields();
        this.setState({
            formValues: {},
            args: {
                page: 1,
                pageSize: args.pageSize
            }
        });
        history.replace({
            pathname: '/product/list',
            search: `?page=1&pageSize=${args.pageSize}`,
        });
        dispatch({
            type: 'product/fetch',
            offset: 0,
            limit: args.pageSize,
            params: {}
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

        const { dispatch, form, history } = this.props;
        const { args } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const createTime = {};
            if (fieldsValue.created_time && fieldsValue.created_time.length > 0) {
                createTime.created_start = fieldsValue.created_time[0].format('YYYY-MM-DD');
                createTime.created_end = fieldsValue.created_time[1].format('YYYY-MM-DD');
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
            delete values.category;
            delete values.created_time;
            this.setState({
                formValues: values,
                args: {
                    page: 1,
                    pageSize: args.pageSize
                }
            });
            history.replace({
                pathname: '/product/list',
                search: `?page=1&pageSize=${args.pageSize}`,
            });
            dispatch({
                type: 'product/fetch',
                params: values,
                offset: 0,
                limit: args.pageSize
            });
        });
    }

    jumpToPage(url) {
        const { history } = this.props;
        history.push(url);
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={7} md={12} sm={24}>
                        <FormItem label="产品ID">
                            {getFieldDecorator('pno')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="产品名称">
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
                    <Col xxl={5} md={12} sm={24}>
                        <FormItem label="产地">
                            {getFieldDecorator('registration_place')(
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
        getStanrdCatalog(level);
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={7} md={12} sm={24}>
                        <FormItem label="产品ID">
                            {getFieldDecorator('pno')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="产品名称">
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
                    <Col xxl={5} md={12} sm={24}>
                        <FormItem label="产地">
                            {getFieldDecorator('registration_place')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={7} md={12} sm={24}>
                        <FormItem label="所属类目">
                            {getFieldDecorator('category')(
                                <Cascader options={level} changeOnSelect placeholder="请选择类目" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="创建人">
                            {getFieldDecorator('creator')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="创建日期">
                            {getFieldDecorator('created_time')(
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
        const { loading, product } = this.props;
        const { selectedRows, args, isShowExportModal } = this.state;
        const data = product.list;
        const { total } = product;
        const current = args.page >> 0;
        const pageSize = args.pageSize >> 0;
        // 导出数据modal标题
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
            <PageHeaderLayout title="产品管理">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button type="primary" icon="plus" onClick={this.jumpToPage.bind(this, 'list/new')}>新建</Button>
                            <Popconfirm
                                title="确定要删除吗?"
                                onConfirm={this.removeProducts}
                            >
                                <Button >
                                    删除
                                </Button>
                            </Popconfirm>
                            <Button onClick={this.showExportModal}>导出数据</Button>
                        </div>
                        <Modal
                            visible={isShowExportModal}
                            width="600px"
                            title={exportCom}
                            onCancel={this.handleCancel}
                            onOk={this.handleOk}
                        >
                            <div className={styles['exportTip']}>
                                <span className={styles['tip']}>选择导出字段项：</span>
                                <RangePicker onChange={this.onExportDatePickerChange} value={this.state.datePickerValue}/>
                            </div>
                            <CheckboxGroup
                                onChange={this.onExportFieldsChange}
                                isCheckAll={this.state.isCheckAll}
                                checkedList={this.state.exportFields}
                            />
                        </Modal>
                        <ProductTable
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            total={total}
                            current={current}
                            pageSize={pageSize}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                            editProduct={this.editProduct}
                            querySupplyInfo={this.querySupplyInfo}
                            isShowAlert={selectedRows.length > 0}
                            defaultPage={args.page}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
