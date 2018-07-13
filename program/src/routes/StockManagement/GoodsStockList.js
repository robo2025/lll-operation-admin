import React from 'react';
import { connect } from 'dva';
import qs from 'qs';
import moment from 'moment';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { Form, Row, Col, Input, Button, Icon, Card, Select, Modal, DatePicker } from 'antd';
import StockListTable from "../../components/StockManagement/StockListTable";
import GoodStockRecordTable from "../../components/StockManagement/GoodStockRecordTable";
import {STOCK_OPERATION_STATUS} from "../../constant/statusList"
import styles from "./stockManagement.less";
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
@Form.create()
@connect(({ stock, loading }) => ({
    stock, loading: loading.effects['stock/fetch'], stockRecordLoading: loading.effects['stock/fetchRecord']
}))
export default class GoodsStockList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandForm: false,
            args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, { ignoreQueryPrefix: true }),
            searchValues: {},
            recordValues: {},
            viewRecordModalShow: false,
            recordInfo: {},
            recordArgs: { page: 1 }
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        dispatch({
            type: "stock/fetch",
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize
        })
    }
    stockListTabelChange = (pagination, filter, sorter) => {
        const { dispatch, history } = this.props;
        const { searchValues } = this.state;
        this.setState({
            args: {
                page: pagination.current,
                pageSize: pagination.pageSize
            }
        })
        history.replace({
            search: `?page=${pagination.current}&pageSize=${pagination.pageSize}`
        })
        dispatch({
            type: "stock/fetch",
            offset: pagination.pageSize * (pagination.current - 1),
            limit: pagination.pageSize,
            params: searchValues
        })
    }
    handleSearch = () => {
        const { form, dispatch, history } = this.props;
        const { args } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {};
            for (var key in fieldsValue) {
                if (fieldsValue[key]) {
                    values[key] = fieldsValue[key];
                }
            }
            this.setState({
                searchValues: values,
                args: {
                    page: 1,
                    pageSize: args.pageSize
                }
            })
            history.replace({
                search: `?page=1&pageSize=${args.pageSize}`
            })
            dispatch({
                type: "stock/fetch",
                offset: 0,
                limit: args.pageSize,
                params: values
            })
        })
    }
    handleFormReset = () => {
        const { form, history, dispatch } = this.props;
        const { args } = this.state;
        form.resetFields();
        this.setState({
            args: {
                page: 1,
                pageSize: args.pageSize
            },
            searchValues: {}
        })
        history.replace({
            search: `?page=1&pageSize=${args.pageSize}`
        })
        dispatch({
            type: "stock/fetch",
            offset: 0,
            limit: args.pageSize
        })
    }
    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="商品ID">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="产品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="请输入产品名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="产品型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入产品型号" />
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
        )
    }
    renderAdvancedForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="商品ID">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="产品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="请输入产品名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="产品型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入产品型号" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="上下架状态">
                            {getFieldDecorator('publish_status')(
                                <Select placeholder="请选择">
                                    <Option value="">全部</Option>
                                    <Option value="0">下架中</Option>
                                    <Option value="1">上架中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="供应商名称">
                            {getFieldDecorator('supplier_name')(
                                <Input placeholder="请输入供应商名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="库存数量">
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('goods_current_count_start')(
                                        <Input style={{ width: '100%', textAlign: 'center' }} placeholder="最大值" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <span style={{ display: 'inline-block', width: '100%', textAlign: 'center', fontSize: '20px' }}>
                                    ~
                                </span>
                            </Col>
                            <Col span={11}>
                                <FormItem>
                                    {getFieldDecorator('goods_current_count_end')(
                                        <Input style={{ width: '100%', textAlign: 'center' }} placeholder="最大值" />
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="审核状态">
                            {getFieldDecorator('audit_status')(
                                <Select placeholder="请选择">
                                    <Option value="">全部</Option>
                                    <Option value="0">未审核</Option>
                                    <Option value="1">审核通过</Option>
                                    <Option value="2">审核不通过</Option>
                                </Select>
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
        )
    }
    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    // 查看库存记录
    viewRecord = (values) => {
        const { dispatch } = this.props;
        this.setState({
            viewRecordModalShow: true,
            recordInfo: values,
            recordArgs: { page: 1 }
        })
        dispatch({
            type: "stock/fetchRecord",
            params: {
                goods_id: values.gno,
            }
        })
    }
    // 关闭库存记录框
    handleCancel = () => {
        const { form } = this.props;
        form.resetFields(['create_time']);
        this.setState({
            viewRecordModalShow: false,
            recordArgs: {
                page: 1
            },
            recordInfo: {},
        })
    }
    //库存记录搜索
    handleRecordSearch = () => {
        const { form, dispatch } = this.props;
        const { recordInfo } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {};
            if (fieldsValue.create_time && fieldsValue.create_time.length > 0) {
                values.start_time = fieldsValue.create_time[0].format('YYYY-MM-DD');
                values.stop_time = fieldsValue.create_time[1].format('YYYY-MM-DD');
            }
            this.setState({
                recordValues: values,
                recordArgs: { page: 1 }
            })
            dispatch({
                type: "stock/fetchRecord",
                params: {
                    goods_id: recordInfo.gno,
                    ...values
                }
            })
        })

    }
    // 库存记录搜索重置
    handleRecordReset = () => {
        const { form, dispatch } = this.props;
        const { recordInfo } = this.state;
        form.resetFields(['create_time']);
        this.setState({
            recordValues: {},
            recordArgs: { page: 1 }
        })
        dispatch({
            type: "stock/fetchRecord",
            params: {
                goods_id: recordInfo.gno
            }
        })
    }
    // 库存记录页码改变
    recordTableChange = (pagination) => {
        const { dispatch } = this.props;
        const { recordInfo, recordValues } = this.state;
        this.setState({
            recordArgs: {
                page: pagination.current
            }
        })
        dispatch({
            type: "stock/fetchRecord",
            offset: (pagination.current - 1) * pagination.pageSize,
            params: {
                goods_id: recordInfo.gno,
                ...recordValues
            }
        })
    }
    // 库存记录搜索条件
    renderStockRecordFilter() {
        const { getFieldDecorator } = this.props.form;
        return <Form onSubmit={this.handleRecordSearch} layout="inline" style={{ margin: "20px 0" }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col xxl={16} md={16} sm={24}>
                    <FormItem label="商品ID">
                        {getFieldDecorator('create_time')(
                            <RangePicker />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <div style={{ overflow: 'hidden' }}>
                <span style={{ float: 'right', marginBottom: 24 }}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleRecordReset}>重置</Button>
                </span>
            </div>

        </Form>
    }
    render() {
        const { stock, loading, form, stockRecordLoading } = this.props;
        const { goodsStockList, total, recordTotal, stockRecord } = stock;
        const { args, viewRecordModalShow, recordArgs, recordInfo } = this.state;
        const { page, pageSize } = args;
        const current = recordArgs.page >> 0;
        const columns = [
            {
                title: "序号",
                dataIndex: "idx",
                key: 'idx'
            }, {
                title: "单号",
                dataIndex: 'order_id',
                key: "order_id"
            }, {
                title: "操作类型",
                dataIndex: "change_option",
                key: 'change_option',
                render: (val) => <span>{STOCK_OPERATION_STATUS[val]}</span>
            }, {
                title: "库存变动数量",
                dataIndex: "change_count",
                key: "change_count"
            }, {
                title: "操作时间",
                dataIndex: "add_time",
                key: 'add_time',
                render: (val) => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
            }
        ]
        return (
            <PageHeaderLayout title="商品库存列表">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false}>
                    <StockListTable
                        data={goodsStockList}
                        total={total}
                        loading={loading}
                        onChange={this.stockListTabelChange}
                        pageSize={pageSize >> 0}
                        current={page >> 0}
                        onViewRecord={this.viewRecord}
                    />
                    <Modal
                        title="商品库存历史记录"
                        visible={viewRecordModalShow}
                        onCancel={this.handleCancel}
                        width="800px"
                        footer={[
                            <div style={{ textAlign: "center" }} key="back"><Button type="primary" onClick={this.handleCancel}>关闭</Button></div>,
                        ]}
                    >
                        <Row>
                            <Col span={12}>产品名称: {recordInfo.product_name}</Col>
                            <Col span={12}>产品型号: {recordInfo.partnumber}</Col>
                        </Row>
                        {this.renderStockRecordFilter()}
                        <GoodStockRecordTable
                            columns = {columns}
                            total={recordTotal}
                            loading={stockRecordLoading}
                            data={stockRecord}
                            current={current}
                            onRecordTableChange={this.recordTableChange}
                        />
                    </Modal>
                </Card>
            </PageHeaderLayout>
        )
    }
}