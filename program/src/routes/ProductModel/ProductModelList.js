import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import Cookies from 'js-cookie';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Upload, Button, Icon, DatePicker, Select, Divider, Modal, Popconfirm, message, Cascader } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CustomizableTable from '../../components/CustomTable/CustomizableTable';
import SupplyInformation from '../../components/SupplyInformation/SupplyInformation';
import ModelContent from './ModelContent';
import styles from './style.less';
import { PAGE_SIZE, SUCCESS_STATUS, FAIL_STATUS } from '../../constant/config';
import { handleServerMsgObj, checkFile } from '../../utils/tools';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
function getStandardCategory(data) {
    data.map((ele) => {
        ele.value = ele.id;
        ele.label = ele.category_name;
        if (ele.children && ele.children.length > 0 && ele.level < 3) {
            getStandardCategory(ele.children);
        } else {
            delete ele.children;
        }

    })
}
@connect(({ brand, good, product, productModel, loading, catalog }) => ({
    brand,
    good,
    product,
    productModel,
    loading,
    catalog
}))
@Form.create()
export default class ProductModelList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            currProductModel: {},
            expandForm: false,
            isShowModal: false,
            isImportModal: false,
            args: qs.parse(props.location.search || { page: 1, pageSize: 10 }, { ignoreQueryPrefix: true }),
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'idx',
            key: 'idx',
            width: 60,
            fixed: 'left',
            render: (text, record, idx) => (<span>{idx + 1}</span>),
        }, {
            title: '产品型号ID',
            dataIndex: 'mno',
            key: 'mno',
            width: 150,
            fixed: 'left',
        }, {
            title: '产品型号',
            dataIndex: 'partnumber',
            key: 'partnumber',
            width: 150,
            fixed: 'left',
        }, {
            title: '三级类目',
            dataIndex: 'product',
            key: 'menu3',
            width: 150,
            render: text => (<span>{!text || text.category.children.children.category_name}</span>),
        }, {
            title: '产品名称',
            dataIndex: 'product',
            key: 'product_name',
            render: text => (<span>{!text || text.product_name}</span>),
        }, {
            title: '产品图片',
            dataIndex: 'product',
            key: 'pics',
            width: 150,
            render: (text) => {
                return text.pics.map((item, idx) => {
                    if (idx < 3) {
                        return (
                            <img
                                className="product-thumb"
                                alt={item.img_tyle}
                                key={item.id}
                                src={item.img_url}
                            />);
                    }
                });
            },
        }, {
            title: '品牌',
            dataIndex: 'product',
            key: 'brand_name',
            render: text => (<span>{text.brand && text.brand.brand_name}</span>),
        }, {
            title: '产地',
            dataIndex: 'product',
            key: 'registration_place',
            render: text => (<span>{text.brand && text.brand.registration_place}</span>),
        }, {
            title: '已有供应商数量',
            dataIndex: 'supplier_count',
            key: 'supplier_count',
        }, {
            title: '创建时间',
            dataIndex: 'created_time',
            key: 'created_time',
            render: text => (<span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>),
        }, {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                <Fragment>
                    <a href={`#/product/model/view?mno=${record.mno}`}>查看</a>
                    <Divider type="vertical" />
                    <a href={`#/product/model/edit?mno=${record.mno}`}>
                        编辑
          </a>
                    <Divider type="vertical" />
                    <a onClick={() => { this.handleBtnClick(record); }}>供货消息</a>
                </Fragment>
            ),
            width: 180,
            fixed: 'right',
        }];
    }


    componentDidMount() {
        const { dispatch } = this.props;
        const { args } = this.state;
        // 请求产品型号列表
        dispatch({
            type: 'productModel/fetch',
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize,
        });
        // 请求目录列表
        dispatch({
            type: 'catalog/fetchLevel',
        });
        // 请求产品列表
        this.dispatchProductList({ offset: 0, limit: 6 });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    }

    onCancel = () => {
        this.setState({ isShowModal: false });
    }

    onOk = () => {
        this.setState({ isShowModal: false });
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }

    handleSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    };

    // 请求产品列表
    dispatchProductList = ({ offset, limit, params = {} }) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'product/fetch',
            offset,
            limit,
            params,
        });
    }

    // bindState
    bindModelThis = ($this) => {
        this.$ModelThis = $this;
    }

    handleModelOk = () => {
        console.log('$ModelThis', this.$ModelThis, this.$ModelThis.state);
        const { modelList } = this.$ModelThis.state;
        const pnos = modelList.map(val => val.pno);
        if (pnos.length > 0) {
            this.setState({ isImportModal: false });
            window.open(`https://testapi.robo2025.com/scm-service/models/template?${qs.stringify({ pnos }, { indices: false })}`);
        } else {
            this.setState({ isImportModal: false });
        }
    }

    // 图片上传前处理：验证文件类型
    handleBeforeUpload = (file) => {
        if (!checkFile(file.name, ['xls', 'xlsx'])) {
            message.error(`${file.name}的文件格式暂不支持上传`);
            return false;
        }
    }

    // 处理下载模板产品列表改变
    handleModelTableChange = (pagination, filtersArg, sorter) => {
        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            offset: (pagination.current - 1) * (pagination.pageSize),
        };
        this.dispatchProductList({ offset: params.offset, limit: params.pageSize });
    }

    // 是否显示modal
    toggleModal = (key, visible) => {
        this.setState({ [key]: visible });
    }

    handleModelUploadChange = ({ file }) => {
        const DOWNLOAD_URL = 'https://testapi.robo2025.com/scm-service/download';
        if (file.status === 'done' && file.response) {
            const { data, msg, rescode } = file.response;
            if (rescode >> 0 === SUCCESS_STATUS) {
                message.success(msg);
            } else if (rescode >> 0 === FAIL_STATUS) {
                Modal.error({
                    title: '导入失败',
                    content: <div><p>失败文件下载：</p><a href={`${DOWNLOAD_URL}?filename=${data.filename}`}>{data.filename}</a></div>,
                });
            } else {
                message.error(msg);
            }
        }
    }

    // 处理表格变化
    handleCustomizableTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch, history } = this.props;
        const { formValues } = this.state;
        const params = {
            pageSize: pagination.pageSize,
            offset: (pagination.current - 1) * (pagination.pageSize),
        };
        // 分页：将页数提取到url上
        history.replace({
            pathname: '/product/model',
            search: `?page=${pagination.current}&pageSize=${pagination.pageSize}`,
        });
        this.setState({
            args: {
                page: pagination.current,
                pageSize: pagination.pageSize
            }
        })
        dispatch({
            type: 'productModel/fetch',
            offset: params.offset,
            limit: params.pageSize,
            params: formValues
        });
    }

    // 供货信息被点击
    handleBtnClick = (record) => {
        this.setState({ currProductModel: record, isShowModal: true });
        this.dispatchGoodsList(record.mno);
    }

    // 请求供货商品列表
    dispatchGoodsList = (mno) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'good/fetch',
            params: {
                mno,
            },
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
            if (fieldsValue.catalog && fieldsValue.catalog.length > 0) {
                categoryId.category_id_1 = fieldsValue.catalog[0];
                categoryId.category_id_2 = fieldsValue.catalog[1];
                categoryId.category_id_3 = fieldsValue.catalog[2];
            }
            const values = {
                ...fieldsValue,
                ...createTime,
                ...categoryId
            };
            delete values.created_time;
            delete values.catalog;
            this.setState({
                formValues: values,
                args: {
                    page: 1,
                    pageSize: args.pageSize
                }
            });
            // 分页：将页数提取到url上
            history.replace({
                pathname: '/product/model',
                search: `?page=1&pageSize=${args.pageSize}`,
            });
            dispatch({
                type: 'productModel/fetch',
                params: values,
                offset: 0,
                limit: args.pageSize
            });
        });
    }
    handleFormReset = () => {
        const { dispatch, form, history } = this.props;
        const { args } = this.state;
        form.resetFields();
        this.setState({
            formValues: {},
            args: {
                page: 1,
                pageSize: args.pageSize
            }
        })
        // 分页：将页数提取到url上
        history.replace({
            pathname: '/product/model',
            search: `?page=1&pageSize=${args.pageSize}`,
        });

        dispatch({
            type: "productModel/fetch",
            offset: 0,
            limit: args.pageSize,
            params: {}
        })
    }

    // 删除产品型号
    removeProductsModel = () => {
        const { dispatch, history } = this.props;
        const { args, formValues } = this.state;
        const mnos = this.state.selectedRows.map(val => val.mno);
        if (mnos.length <= 0) {
            message.error('请先选择要删除的产品型号');
            return;
        }
        dispatch({
            type: 'productModel/remove',
            mnos,
            success: () => {
                message.success('删除成功');
                dispatch({
                    type: 'productModel/fetch',
                    offset: 0,
                    limit: args.pageSize,
                    params: formValues
                });
                // 分页：将页数提取到url上
                history.replace({
                    pathname: '/product/model',
                    search: `?page=1&pageSize=${args.pageSize}`,
                });
                this.setState({
                    selectedRows: [], selectedRowKeys: [], args: {
                        page: 1,
                        pageSize: args.pageSize
                    }
                });
            },
            error: (res) => {
                message.error(handleServerMsgObj(res.msg)); 
                dispatch({
                    type: 'productModel/fetch',
                    offset: 0,
                    limit: args.pageSize,
                    params: formValues
                });
                // 分页：将页数提取到url上
                history.replace({
                    pathname: '/product/model',
                    search: `?page=1&pageSize=${args.pageSize}`,
                });
                this.setState({
                    selectedRows: [], selectedRowKeys: [], 
                    args: {
                        page: 1,
                        pageSize: args.pageSize
                    }
                });
            },
        });
    }

    renderSimpleForm() {
        const { getFieldDecorator } = this.props.form;
        const { catalog } = this.props;
        const { level } = catalog;
        getStandardCategory(level);
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="产品型号ID">
                            {getFieldDecorator('mno')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="产品型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={5} md={12} sm={24}>
                        <FormItem label="品牌">
                            {getFieldDecorator('brand_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={7} md={12} sm={24}>
                        <FormItem label="所属类目">
                            {getFieldDecorator('catalog')(
                                <Cascader options={level} changeOnSelect placeholder="请选择类目" />
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
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="产品型号ID">
                            {getFieldDecorator('mno')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="产品型号">
                            {getFieldDecorator('partnumber')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={5} md={12} sm={24}>
                        <FormItem label="品牌">
                            {getFieldDecorator('brand_name')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={7} md={12} sm={24}>
                        <FormItem label="所属类目">
                            {getFieldDecorator('catalog')(
                                <Cascader options={level} changeOnSelect placeholder="请选择类目" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={6} md={12} sm={24}>
                        <FormItem label="创建人">
                            {getFieldDecorator('creator')(
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
                    <Col xxl={5} md={12} sm={24}>
                        <FormItem label="产地">
                            {getFieldDecorator('registration_place')(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={7} md={12} sm={24}>
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
                            展开 <Icon type="down" />
                        </a>
                    </span>
                </div>
            </Form>);
    }

    renderForm() {
        return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    render() {
        const {
            selectedRowKeys, selectedRows,
            currProductModel, isShowModal, isImportModal, args,
        } = this.state;
        const { productModel, good, product, loading } = this.props;
        const rowSelection = {
            fixed: true,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const productModelPage = args.page >> 0;
        const productModelPageSize = args.pageSize >> 0;
        return (
            <PageHeaderLayout title="产品型号列表">
                <Card bordered={false} className={styles['search-wrap']} title="搜索条件">
                    <div className={styles.tableListForm}>
                        {this.renderForm()}
                    </div>
                </Card>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button type="primary" icon="plus" href="#/product/model/add">新建</Button>
                            <Popconfirm
                                title="确定删除吗？"
                                onConfirm={this.removeProductsModel}
                            >
                                <Button>
                                    删除
                </Button>
                            </Popconfirm>
                            <Button onClick={this.showExportModal}>导出数据</Button>
                            <div style={{ display: 'inline-block', marginLeft: 32 }}>
                                <Upload
                                    className={styles.upload}
                                    name="file"
                                    action="https://testapi.robo2025.com/scm-service/models/template"
                                    headers={{
                                        Authorization: Cookies.get('access_token') || 'null',
                                    }}
                                    showUploadList={false}
                                    beforeUpload={this.handleBeforeUpload}
                                    onChange={this.handleModelUploadChange}
                                >
                                    <Button type="primary">
                                        <Icon type="upload" />导入产品数据
                  </Button>
                                </Upload>
                                <Button onClick={() => { this.toggleModal('isImportModal', true); }}>下载数据模板</Button>
                            </div>
                        </div>
                        <CustomizableTable
                            loading={loading.models.productModel}
                            rowSelection={rowSelection}
                            data={productModel.list}
                            columns={this.columns}
                            scroll={{ x: 2000 }}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleCustomizableTableChange}
                            defaultPage={args.page || 1}
                            total={productModel.total}
                            current={productModelPage}
                            pageSize={productModelPageSize}
                            rowKey="mno"
                        />
                    </div>
                    <Modal
                        width="60%"
                        visible={isShowModal}
                        title="供货信息"
                        okText=""
                        cancelText=""
                        onCancel={this.onCancel}
                        onOk={this.onOk}
                    >
                        <SupplyInformation
                            headerData={currProductModel}
                            data={good.list}
                            loading={loading.models.good}
                        />
                    </Modal>
                    {/* 下载数据模板Modal */}
                    <Modal
                        width="60%"
                        visible={isImportModal}
                        title="下载模板选择"
                        okText=""
                        cancelText=""
                        onCancel={() => { this.toggleModal('isImportModal', false); }}
                        onOk={this.handleModelOk}
                    >
                        <ModelContent
                            dataSource={product.list}
                            total={product.total}
                            loading={loading.models.product}
                            onModelTableChange={this.handleModelTableChange}
                            bindModelThis={this.bindModelThis}
                            onSearch={this.dispatchProductList}
                        />
                    </Modal>
                </Card>
            </PageHeaderLayout>
        );
    }
}
