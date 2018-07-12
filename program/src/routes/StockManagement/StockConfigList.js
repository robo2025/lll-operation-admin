import React from 'react';
import qs from 'qs';
import moment from 'moment';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { Row, Col, Card, Form, Input,Button,Icon } from 'antd';
import {connect} from 'dva';
import StockConfigListTable from "../../components/StockManagement/StockConfigListTable";
import styles from "./stockManagement.less";
const FormItem = Form.Item;
@Form.create()
@connect(({stock,loading})=>({
     stock, loading: loading.effects['stock/fetch']
}))
export default class StockConfigList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            args:qs.parse(props.location.search||{page:1, pageSize:10},{ignoreQueryPrefix:true}),
            searchValues:{}
        }
    }
    componentDidMount(){
        const {dispatch} = this.props;
        const {args} = this.state;
        dispatch({
            type: "stock/fetch",
            offset: (args.page - 1) * args.pageSize,
            limit: args.pageSize
        })
    }
    onstockTableChange=(pagination)=> {
        
    }
    toggleForm=()=> {
        this.setState({
            expand:!this.state.expand
        })
    }
    renderSimpleForm(){
        const { getFieldDecorator } = this.props.form;
        return (
        <Form>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={12}>
                    <FormItem label="商品ID">
                        {getFieldDecorator('pno')(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={12}>
                    <FormItem label="商品名称">
                        {getFieldDecorator('product_name')(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={12}>
                    <FormItem label="型号">
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
        )
    }
    renderAdvancedForm() {
        const { getFieldDecorator } = this.props.form;
        return (<Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={12}>
                    <FormItem label="商品ID">
                        {getFieldDecorator('pno')(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={12}>
                    <FormItem label="商品名称">
                        {getFieldDecorator('product_name')(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={12}>
                    <FormItem label="型号">
                        {getFieldDecorator('partnumber')(
                            <Input placeholder="请输入商品名称" />
                        )}
                    </FormItem>
                </Col>
                <Col md={8} sm={12}>
                    <FormItem label="上下架状态">
                        {getFieldDecorator('publist_status')(
                            <Input placeholder="请输入商品名称" />
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
                <Col md={8} sm={12}>
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
            <div style={{ overflow: 'hidden' }}>
                <span style={{ float: 'right', marginBottom: 24 }}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                    <a style={{ marginLeft: 8 }} onClick={this.toggleForm} className="unfold">
                        收起 <Icon type="up" />
                    </a>
                </span>
            </div>
        </Form>)
    }
    renderForm(){
        return this.state.expand ? this.renderAdvancedForm():this.renderSimpleForm();
    }
    render() {
        const {stock,loading} = this.props;
        const {goodsStockList,total} = stock;
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
                        loading={loading}
                        onstockTableChange={this.onstockTableChange}
                        />
                    </div>
                </Card>
            </PageHeaderLayout>
        )
    }
}