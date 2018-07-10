import React from 'react';
import { connect } from 'dva';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { Form, Row, Col, Input, Button, Icon, Card } from 'antd';
import StockListTable from "../../components/StockManagement/StockListTable";
import styles from "./stockManagement.less";
const FormItem = Form.Item;
@Form.create()
@connect(({stock,loading}) => ({
    stock,loading
}))
export default class GoodsStockList extends React.Component {
    constructor(props) {
        super(props);

    }
    state = {
        expandForm: false
    }
    componentDidMount(){
        const {dispatch} = this.props;
        dispatch({
            type:"stock/fetch",
            offset:0,
            limit:10
        })
    }
    toggleForm =()=>{
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
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="产品型号">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
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
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="产品型号">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="上下架状态">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="供应商名称">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="库存数量">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col xxl={8} md={8} sm={24}>
                        <FormItem label="审核状态">
                            {getFieldDecorator('gno')(
                                <Input placeholder="请输入商品ID" />
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
    renderForm(){
        return this.state.expandForm?this.renderAdvancedForm():this.renderSimpleForm();
    }
    render() {
        const {stock} = this.props;
        const {goodsStockList,total} = stock;
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
                    />
                </Card>
            </PageHeaderLayout>
        )
    }
}