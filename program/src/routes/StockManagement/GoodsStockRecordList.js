import React from 'react';
import moment from 'moment';
import qs from 'qs';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { Card, Form, Row, Col, Input, Button, Icon, DatePicker, Select } from 'antd';
import GoodsStockTable from "../../components/StockManagement/GoodsStockTable";
import styles from "./stockManagement.less";
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
@Form.create()
@connect(({ stock, loading }) => ({
    stock,
    loading: loading.effects['stock/fetchRecord']
}))
export default class GoodsStockRecordList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, { ignoreQueryPrefix: true }),
            searchValues: {},
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        dispatch({
            type: "stock/fetchRecord",
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize
        })
    }
    toggleForm = () => {
        this.setState({
            expand: !this.state.expand
        })
    }
    //表格页数改变
    onRecordChange = (pagination) => {
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
            type: "stock/fetchRecord",
            offset: (pagination.current - 1) * pagination.pageSize,
            limit: pagination.pageSize,
            params: searchValues
        })
    }
    handleSearch = () => {
        const { dispatch, form, history } = this.props;
        const { args } = this.state;
        form.validateFields((err, fieldsValues) => {
            if (err) return;
            const values = {};
            for (var key in fieldsValues) {
                if (fieldsValues[key]) {
                    values[key] = fieldsValues[key];
                }
            }
            if (values.create_time && values.create_time.length > 0) {
                values.start_time = values.create_time[0].format("YYYY-MM-DD");
                values.stop_time = values.create_time[1].format("YYYY-MM-DD");
            }
            delete values.create_time;
            this.setState({
                args: {
                    page: 1,
                    pageSize: args.pageSize
                },
                searchValues: values
            });
            history.replace({
                search: `?page=1&pageSize=${args.pageSize}`
            });
            dispatch({
                type: "stock/fetchRecord",
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
        history.replace({
            search: `?page=1&pageSize=${args.pageSize}`
        });
        this.setState({
            searchValues: {},
            args: {
                page: 1,
                pageSize: args.pageSize
            }
        });
        dispatch({
            type: "stock/fetchRecord",
            offset: 0,
            limit: args.pageSize,
        })
    }
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline" onSubmit={this.handleSearch}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={12}>
                        <FormItem label="单号">
                            {getFieldDecorator('order_id')(
                                <Input placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="操作类型">
                            {getFieldDecorator('change_option')(
                                <Select placeholder="请选择">
                                    <Option value="">全部</Option>
                                    <Option value="I">入库</Option>
                                    <Option value="O">调拨</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="创建时间">
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
            <Form layout="inline" onSubmit={this.handleSearch}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={12}>
                        <FormItem label="单号">
                            {getFieldDecorator('order_id')(
                                <Input placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="操作类型">
                            {getFieldDecorator('change_option')(
                                <Select placeholder="请选择">
                                    <Option value="">全部</Option>
                                    <Option value="I">入库</Option>
                                    <Option value="O">调拨</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="创建时间">
                            {getFieldDecorator('create_time')(
                                <RangePicker />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={12}>
                        <FormItem label="供应商名称">
                            {getFieldDecorator('supplier_name')(
                                <Input placeholder='请输入' />
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
        return this.state.expand ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    render() {
        const { stock, loading } = this.props;
        const { stockRecord, recordTotal } = stock;
        const { args } = this.state;
        const { page, pageSize } = args;
        return (
            <PageHeaderLayout title="库存记录">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false} className={styles['search-wrap']} >
                    <div className={styles.tableListForm}>
                        <GoodsStockTable
                            data={stockRecord}
                            total={recordTotal}
                            current={page >> 0}
                            pageSize={pageSize >> 0}
                            loading={loading}
                            onRecordChange={this.onRecordChange}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}