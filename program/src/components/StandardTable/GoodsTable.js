/*
 * @Author: lll
 * @Date: 2018-01-26 14:08:45
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-30 09:11:40
 */
import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider, Button, Modal, Form,Input ,Row, Col  } from 'antd';
import { AUDIT_STATUS, PUBLISH_STATUS } from '../../constant/statusList';
import styles from './goods-table.less';

const FormItem = Form.Item;
const {TextArea} = Input;
const AuditStatusMap = ['processing', 'success', 'error'];// 审核状态
const GoodsStatusMap = ['default', 'success', 'processing'];// 上下架状态
@Form.create()
class GoodsTable extends PureComponent {
    state = {
        selectedRowKeys: [],
        totalCallNo: 0,
        visible: false,
        recordGno:""
    };

    componentWillReceiveProps(nextProps) {
        // clean state
        if (nextProps.selectedRows.length === 0) {
            this.setState({
                selectedRowKeys: [],
                totalCallNo: 0,
            });
        }
    }

    handleRowSelectChange = (selectedRowKeys, selectedRows) => {
        const totalCallNo = selectedRows.reduce((sum, val) => {
            return sum + parseFloat(val.callNo, 10);
        }, 0);

        if (this.props.onSelectRow) {
            this.props.onSelectRow(selectedRows);
        }

        this.setState({ selectedRowKeys, totalCallNo });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.props.onChange(pagination, filters, sorter);
    }

    cleanSelectedKeys = () => {
        this.handleRowSelectChange([], []);
    }
   
    handleSubmit = (e) => {
        e.preventDefault();
        const {form,onPublish} = this.props;
        const {recordGno} = this.state;
        form.validateFields((err,fieldValues) => {
            if (err) return;
            onPublish(recordGno,{...fieldValues,publish_status:0});
            form.resetFields();
            this.setState({
                visible:false,
                recordGno:'',
            })
        })
    }
    handleReset=() => {
        const {form} = this.props;
        form.resetFields();
        this.setState({
            visible:false,
            recordGno:'',
        })
    }
    render() {
        const { selectedRowKeys, totalCallNo } = this.state;
        const { data, loading, onPublish, defaultPage, total, current, pageSize } = this.props;
        const { getFieldDecorator } = this.props.form;
        const columns = [{
            title: '商品ID',
            dataIndex: 'gno',
            width: 180,
            fixed: 'left',
        }, {
            title: '商品名称',
            dataIndex: 'product',
            render: val => (<span >{val.product_name}</span>),
            key: 'product_name',
        }, {
            title: '型号',
            dataIndex: 'product_model',
            key: 'partnumber',
            render: productModel => (<span>{productModel.partnumber}</span>),
        }, {
            title: '三级类目',
            dataIndex: 'product',
            render: val => (<span >{val.category ? val.category.children.children.category_name : ''}</span>),
            key: 'category_name_3',
        }, {
            title: '品牌',
            dataIndex: 'product',
            render: val => (<span >{val.brand.brand_name}</span>),
            key: 'brand_name',
        }, {
            title: '单价（含税）',
            dataIndex: 'prices',
            key: 'price',
            render: val => (<span >{val.length > 0 ? `${val.slice(0)[0].price}-${val.slice(-1)[0].price}` : '无'}</span>),
        }, {
            title: '库存',
            dataIndex: 'stock',
            key: 'stock',
        }, {
            title: '审核状态',
            dataIndex: 'audit_status',
            key: 'audit_status',
            render: val => (<Badge status={AuditStatusMap[val]} text={AUDIT_STATUS[val]} />),
        }, {
            title: '上下架状态',
            dataIndex: 'publish_status',
            key: 'publish_status',
            render(val) {
                return <Badge status={GoodsStatusMap[val]} text={PUBLISH_STATUS[val]} />;
            },
        }, {
            title: '供应商公司名称',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
        }, {
            title: '商品提交时间',
            dataIndex: 'created_time',
            sorter: true,
            render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
        }, {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a href={`#/goods/list/detail?gno=${record.gno}&audit=1`} disabled={record.publish_status === 1}>审核</a>
                    <Divider type="vertical" />
                    <a
                        onClick={() => { this.setState({ visible: true ,recordGno:record.gno}) }}
                        disabled={(record.audit_status !== 1) || (record.publish_status === 0)}
                    >
                        下架
                    </a>
                    {/* <Popconfirm
                        title="确定下架该商品吗？"
                        cancelText="取消"
                        okText="确定"
                        onConfirm={() => {onPublish(record.gno, 0) }}
                    >
                        <a disabled={(record.audit_status !== 1) || (record.publish_status === 0)}>
                            下架
                        </a>
                    </Popconfirm> */}
                    <Divider type="vertical" />
                    <a href={'#/goods/list/detail?gno=' + record.gno}>查看</a>
                </Fragment>
            ),
            width: 150,
            fixed: 'right',
        }];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            current,
            pageSize,
            total,
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleRowSelectChange,
            getCheckboxProps: record => ({
                disabled: record.disabled,
            }),
        };
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
          };

        return (
            <div className={styles.standardTable}>
                <div className={styles.tableAlert}>
                    <Alert
                        message={(
                            <div>
                                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
              </div>
                        )}
                        type="info"
                        showIcon
                    />
                </div>
                <Table
                    loading={loading}
                    rowKey={record => (record.gno ? record.gno : record.idx)}
                    rowSelection={rowSelection}
                    dataSource={data}
                    columns={columns}
                    pagination={paginationProps}
                    onChange={this.handleTableChange}
                    scroll={{ x: 2000 }}
                />
                <Modal
                    title="商品下架"
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleReset}
                >
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem label="下架说明" {...formItemLayout}>
                                {getFieldDecorator('audit_desc', {
                                    rules: [{ required: true, message: '请填写下架说明' }],
                                })(
                                    <TextArea  placeholder="请填写下架说明"/>
                                )}
                            </FormItem>
                            <Row>
                                <Col style={{textAlign:'right'}}>
                                <Button type="primary" htmlType="submit">确认</Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>取消</Button>
                                </Col>
                            </Row>
                        </Form>
                </Modal>
            </div>
        );
    }
}

export default GoodsTable;
