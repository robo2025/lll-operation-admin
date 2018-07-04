import React, { Component } from 'react';
import { Table, Form, Row, Col, Input, Button, Icon, Cascader } from 'antd';
import styles from './style.less';

const FormItem = Form.Item;

@Form.create()
export default class ModelContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modelList: [],
            formValues:{},
        };
    }

    componentDidMount() {
        const { bindModelThis } = this.props;
        if (bindModelThis) {
            bindModelThis(this);
        }
    }

    // 添加产品到模板
    addProductToModel = (record) => {
        const { modelList } = this.state;
        this.setState({ modelList: [...modelList, record] });
    }

    // 从模板删除产品
    deleteProductFromModel = (record) => {
        const { modelList } = this.state;
        this.setState({ modelList: modelList.filter(val => val.pno !== record.pno) });
    }

    handleSearch = (e) => {
        e.preventDefault();

        const { form, onSearch } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const categoryId = {};
            if (fieldsValue.catalog && fieldsValue.catalog.length > 0) {
                categoryId.category_id_1 = fieldsValue.catalog[0];
                categoryId.category_id_2 = fieldsValue.catalog[1];
                categoryId.category_id_3 = fieldsValue.catalog[2];
            }
            const values = {
                ...fieldsValue,
                ...categoryId,
            };
            delete values.catalog;
            this.setState({
                formValues: values,
            });

            onSearch({offset:0, params: values });
        });
    }

    // 搜索表单
    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const { level } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={6} md={6} sm={24}>
                        <FormItem label="产品ID">
                            {getFieldDecorator('pno')(
                                <Input placeholder="产品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={6} sm={24}>
                        <FormItem label="产品名称">
                            {getFieldDecorator('product_name')(
                                <Input placeholder="产品名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={9} md={9} sm={24}>
                        <FormItem label="产品类名">
                            {getFieldDecorator('catalog')(
                                <Cascader options={level} changeOnSelect placeholder="请选择类目" />
                            )}
                        </FormItem>
                    </Col>
                    <div style={{ overflow: 'hidden' }}>
                        <span style={{ float: 'right', marginBottom: 24 }}>
                            <Button type="primary" htmlType="submit"><Icon type="search" />搜索</Button>
                        </span>
                    </div>
                </Row>
            </Form>
        );
    }

    render() {
        const { modelList } = this.state;
        const { dataSource, onModelTableChange, total, loading ,current,pageSize} = this.props;
        // --------------- 给数据添加选中属性，防止重复选择 -------------------------
        const resDataSource = dataSource.map((val) => {
            const res = modelList.find(val2 => val2.pno === val.pno);
            if (res) {
                return { ...val, selected: true };
            } else {
                return { ...val, selected: false };
            }
        });
        // ----------------------------------------

        const columns = [{
            title: '产品ID',
            dataIndex: 'pno',
            key: 'pno',
        }, {
            title: '产品名称',
            dataIndex: 'product_name',
            key: 'product_name',
        }, {
            title: '所属类目',
            dataIndex: 'category',
            key: 'category_name',
            render: val => (
                <span>
                    {val && `${val.category_name}-${val.children.category_name}-${val.children.children.category_name}`}
                </span>
            ),
        }, {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand_name',
            render: val => (<span>{val && val.brand_name}</span>),
        }, {
            title: '产地',
            dataIndex: 'brand',
            key: 'registration_place',
            render: val => (<span>{val.registration_place}</span>),
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <a onClick={() => { this.addProductToModel(record); }} disabled={record.selected}>选择</a>
            ),
        }];
        const columns2 = [{
            title: '产品ID',
            dataIndex: 'pno',
            key: 'pno',
        }, {
            title: '产品名称',
            dataIndex: 'product_name',
            key: 'product_name',
        }, {
            title: '所属类目',
            dataIndex: 'category',
            key: 'category_name',
            render: val => (
                <span>
                    {val && `${val.category_name}-${val.children.category_name}-${val.children.children.category_name}`}
                </span>
            ),
        }, {
            title: '品牌',
            dataIndex: 'brand',
            key: 'brand_name',
            render: val => (<span>{val && val.brand_name}</span>),
        }, {
            title: '产地',
            dataIndex: 'brand',
            key: 'registration_place',
            render: val => (<span>{val.registration_place}</span>),
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <a onClick={() => { this.deleteProductFromModel(record); }}>取消</a>
            ),
        }];

        return (
            <div>
                <h3>可选产品列表</h3>
                <div className={styles.tableListForm}>
                    {this.renderSimpleForm()}
                </div>
                <Table
                    bordered
                    loading={loading}
                    dataSource={resDataSource}
                    columns={columns}
                    rowKey="pno"
                    onChange={onModelTableChange}
                    pagination={{
                        defaultPageSize: 6,
                        total,
                        current,
                        pageSize,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['6', '12', '18', '24'],
                    }}
                />
                <h3>已选产品列表</h3>
                <Table
                    bordered
                    dataSource={modelList}
                    columns={columns2}
                    rowKey="pno"
                    pagination={{
                        defaultPageSize: 6,
                        pageSize: 6,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['6', '12', '18', '24'],
                    }}
                />
            </div>
        );
    }
}
