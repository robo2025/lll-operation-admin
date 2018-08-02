import React from 'react';
import qs from 'qs';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Row, Col, Card, Form, Input, Button, Icon, Select, Modal, InputNumber, Message, Spin } from 'antd';
import { connect } from 'dva';
import StockConfigListTable from '../../components/StockManagement/StockConfigListTable';
import GoodStockRecordTable from '../../components/StockManagement/GoodStockRecordTable';
import styles from './stockManagement.less';

const FormItem = Form.Item;
const Option = Select.Option;
const SetRestrictModal = Form.create()(
    class extends React.Component {
        checkNum = (rule, value, callback) => {
            if (value < 0) {
                callback('请输入正整数');
                return;
            }
            callback();
        }
        render() {
            const { visible, onCancel, onOk, form, fetchSettingConfigLoading } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: {
                    md: { span: 7 },
                    sm: { span: 7 },
                },
                wrapperCol: {
                    md: { span: 16 },
                    sm: { span: 16 },
                },
            };

            return (
                <Modal
                    title="库存限制配置"
                    onOk={onOk}
                    visible={visible}
                    onCancel={onCancel}
                >
                    <Spin spinning={fetchSettingConfigLoading || false}>
                        <Form>
                            <FormItem label="最大入库值" {...formItemLayout}>
                                {getFieldDecorator('goods_max_in_info', {
                                    rules: [
                                        { message: '请输入数字', type: 'number' },
                                        { validator: this.checkNum },
                                    ],
                                })(
                                    <InputNumber placeholder="请输入" style={{ width: '80%' }} />
                                )}
                            </FormItem>
                            <FormItem label="最大调拨值" {...formItemLayout}>
                                {getFieldDecorator('goods_max_out_info', {
                                    rules: [
                                        { message: '请输入数字', type: 'number' },
                                        { validator: this.checkNum },
                                    ],
                                }
                                )(
                                    <InputNumber placeholder="请输入" style={{ width: '80%' }} />
                                )}
                            </FormItem>
                        </Form>
                    </Spin>
                </Modal>
            );
        }
    }
);
@Form.create()
@connect(({ stock, loading }) => ({
    stock,
loading: loading.effects['stock/fetch'],
fetchSettingConfigLoading: loading.effects['stock/fetchSettingConfig'],
    fetchConfigLoading: loading.effects['stock/fetchConfig'],
}))
export default class StockConfigList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, { ignoreQueryPrefix: true }),
            searchValues: {},
            setRestrictModalShow: false,
            recordValue: {}, // 存储设置限制信息
            viewRecordModalShow: false,
            recordArgs: {
                page: 1,
            },
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        dispatch({
            type: 'stock/fetch',
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize,
        });
    }
    viewRecord = (record) => { // 查看记录模态框
        const { dispatch } = this.props;
        this.setState({
            viewRecordModalShow: true,
            recordValue: record,
        });
        dispatch({
            type: 'stock/fetchConfig',
            params: {
                gno: record.gno,
            },
        });
    }
    viewRecordCancel = () => { // 关闭查看记录模态框
        this.setState({
            viewRecordModalShow: false,
            recordValue: {},
            recordArgs: {
                page: 1,
            },
        });
    }
    onRecordTableChange = (pagination) => { // 记录模态框页面改变
        const { dispatch } = this.props;
        const { recordValue } = this.state;
        dispatch({
            type: 'stock/fetchConfig',
            offset: (pagination.current - 1) * pagination.pageSize,
            params: {
                gno: recordValue.gno,
            },
        });
        this.setState({
            recordArgs: {
                page: pagination.current,
            },
        });
    }
    onSetRestrict = (record) => { // 设置限制模态框
        this.setState({
            setRestrictModalShow: true,
            recordValue: record,
        });
    }
    handleSetRestrictOk = () => { // 设置限制模态框点击确认按钮
        const form = this.formRef.props.form;
        const { dispatch } = this.props;
        const { recordValue, searchValues, args } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {};
            let hasValue = false;
            for (let key in fieldsValue) {
                if (fieldsValue[key]) {
                    hasValue = true;
                    values[key] = fieldsValue[key];
                }
            }
            if (hasValue) {
                dispatch({
                    type: 'stock/fetchSettingConfig',
                    params: { gno: recordValue.gno, ...values },
                    success: (res) => {
                        Message.success('设置成功');
                        this.setState({
                            setRestrictModalShow: false,
                            recordValue: {},
                        });
                        form.resetFields();
                    },
                    error: (res) => {
                        Message.warning(res.msg);
                    },
                });
            } else {
                // 如果两个都为空，是否提示
                Message.warning('至少一项不为空');
            }
        });
    }
    handleSetRestrictCancel = () => { // 设置限制模态框点击取消按钮
        const form = this.formRef.props.form;
        form.resetFields();
        this.setState({
            setRestrictModalShow: false,
            recordValue: {},
        });
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    // 当页码或者每页条数发生改变
    onstockTableChange = (pagination) => {
        const { history, dispatch } = this.props;
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
            type: 'stock/fetch',
            offset: (pagination.current - 1) * pagination.pageSize,
            limit: pagination.pageSize,
            params: searchValues,
        });
    }
    toggleForm = () => {
        this.setState({
            expand: !this.state.expand,
        });
    }
    // 搜索框点击搜索按钮
    handleSearch = (e) => {
        e.preventDefault();
        const { form, dispatch, history } = this.props;
        const { args } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {};
            for (let key in fieldsValue) {
                if (fieldsValue[key]) {
                    values[key] = fieldsValue[key];
                }
            }
            this.setState({
                searchValues: values,
                args: {
                    page: 1,
                    pageSize: args.pageSize,
                },
            });
            history.replace({
                search: `?page=1&pageSize=${args.pageSize}`,
            });
            dispatch({
                type: 'stock/fetch',
                offset: 0,
                limit: args.pageSize,
                params: values,
            });
        });
    }
    // 重置搜索框
    handleFormReset = () => {
        const { form, dispatch, history } = this.props;
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
            type: 'stock/fetch',
            offset: 0,
            limit: args.pageSize,
        });
    }
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={12}>
                        <FormItem label="商品ID">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="产品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="请输入商品名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                        <FormItem label="产品型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入商品名称" />
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
        return (
<Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={12}>
                    <FormItem label="商品ID">
                        {getFieldDecorator('gno')(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={12}>
                    <FormItem label="产品名称">
                        {getFieldDecorator('product_name')(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={12}>
                    <FormItem label="产品型号">
                        {getFieldDecorator('partnumber')(
                            <Input placeholder="请输入商品名称" />
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
                <Col md={8} sm={12}>
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
                <Col md={8} sm={12}>
                    <FormItem label="供应商名称">
                        {getFieldDecorator('supplier_name')(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={12}>
                    <FormItem label="库存数量">
                        <Col span={11}>
                            <FormItem>
                                {getFieldDecorator('stock_start')(
                                    <Input style={{ width: '100%', textAlign: 'center' }} placeholder="最小值" />
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
                                {getFieldDecorator('stock_end')(
                                    <Input style={{ width: '100%', textAlign: 'center' }} placeholder="最大值" />
                                )}
                            </FormItem>
                        </Col>
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
        return this.state.expand ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    render() {
        const { stock, loading, fetchSettingConfigLoading, fetchConfigLoading } = this.props;
        const { goodsStockList, total, stockConfigList, configTotal } = stock;
        const { args, setRestrictModalShow, viewRecordModalShow, recordValue, recordArgs } = this.state;
        const { page, pageSize } = args;
        const recordPage = recordArgs.page >> 0;
        const columns = [{
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
        }, {
            title: '操作人',
            dataIndex: 'operator',
            key: 'operator',
        }, {
            title: '最大入库限制',
            dataIndex: 'goods_max_in_info',
            key: 'goods_max_in_info',
            render: val => <span>{val || '--'}</span>,
        }, {
            title: '最大调拨限制',
            dataIndex: 'goods_max_out_info',
            key: 'goods_max_out_info',
            render: val => <span>{val || '--'}</span>,
        }, {
            title: '操作时间',
            dataIndex: 'add_time',
            key: 'add_time',
            render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
        }];
        return (
            <PageHeaderLayout title="库存配置">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false} className={styles['search-wrap']} >
                    <div className={styles.tableListForm}>
                        <StockConfigListTable
                            data={goodsStockList}
                            total={total}
                            current={page >> 0}
                            pageSize={pageSize >> 0}
                            loading={loading}
                            onstockTableChange={this.onstockTableChange}
                            onSetRestrict={this.onSetRestrict}
                            onviewRecord={this.viewRecord}
                        />
                        <SetRestrictModal
                            wrappedComponentRef={this.saveFormRef}
                            visible={setRestrictModalShow}
                            onCancel={this.handleSetRestrictCancel}
                            onOk={this.handleSetRestrictOk}
                            fetchSettingConfigLoading={fetchSettingConfigLoading}
                        />
                        <Modal
                            title="历史记录"
                            visible={viewRecordModalShow}
                            width="800px"
                            onCancel={this.viewRecordCancel}
                            footer={[
                                <div style={{ textAlign: 'center' }} key="back"><Button type="primary" onClick={this.viewRecordCancel}>关闭</Button></div>,
                            ]}
                        >
                            <Row className={styles.recordShow}>
                                <Col span={12}>
                                    <Col span={6}><span>供应商名称 :</span></Col><Col span={17}>{recordValue.supplier_name}</Col>

                                </Col>
                                <Col span={12}>
                                    <Col span={6}><span>产品名称 :</span></Col><Col span={17}>{recordValue.product_name}</Col>
                                </Col>
                                <Col span={12}>
                                    <Col span={6}><span>商品ID :</span></Col><Col span={17}>{recordValue.gno}</Col>

                                </Col>
                                <Col span={12}>
                                    <Col span={6}><span>产品型号 :</span></Col><Col span={17}>{recordValue.partnumber}</Col>
                                </Col>
                            </Row>
                            <GoodStockRecordTable
                                columns={columns}
                                data={stockConfigList}
                                total={configTotal}
                                current={recordPage}
                                loading={fetchConfigLoading}
                                onRecordTableChange={this.onRecordTableChange}
                            />
                        </Modal>
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
