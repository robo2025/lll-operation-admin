/*
 * @Author: lll
 * @Date: 2018-01-31 16:19:39
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-24 18:41:44
 */
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Upload, Icon, Table, Tabs, Spin } from 'antd';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import RichEditor from '../../components/RichEditor/RichEditor';

import styles from './good-info.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@Form.create({
  mapPropsToFields(props) {
    const { data } = props;
    const fields = {};
    Object.keys(data).forEach((key) => {
      fields[key] = Form.createFormField({
        value: data[key],
      });
    });
    return {
      ...fields,
    };
  },
  onValuesChange(props, values) {
    props.onChange(values);
  },
})
class GoodInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // 输入框有改变时
  handleChange(key, value) {
    const tempJson = {};
    tempJson[key] = value;
    this.props.onAttrChange(tempJson);
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
    };

    const columns = [{
      title: '采购量',
      key: 'id',
      render: record => (<span>{`${record.min_quantity}~${record.max_quantity}`}</span>),
    }, {
      title: '销售单价(含税)',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '发货日',
      dataIndex: 'lead_time',
      key: 'lead_time',
    }];

    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    if (!data.product) {
      return <Spin spinning />;
    }
    const { product } = data;
    const category = product ? product.category : '';
    const categoryStr = category ?
      `${category.category_name}-${category.children.category_name}-${category.children.children.category_name}-${category.children.children.children.category_name}`
      : '';
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className={styles['good-info-wrap']}>
        <SectionHeader title="商品基础信息" />
        {/* 商品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal">
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              {getFieldDecorator('cate', {
                initialValue: categoryStr,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="产品ID"
              {...formItemLayout}
            >
              {getFieldDecorator('pno', {
                initialValue: product.pno,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="商品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('product_name', {
                initialValue: product.product_name,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="商品ID"
              {...formItemLayout}
            >
              {getFieldDecorator('gno', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              {getFieldDecorator('partnumber', {
                initialValue: product.partnumber,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              {getFieldDecorator('band', {
                initialValue: product.brand_name,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="英文名"
              {...formItemLayout}
            >
              {getFieldDecorator('en_name', {
                initialValue: product.english_name,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              {getFieldDecorator('prodution_place', {
                initialValue: product.prodution_place,
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="质保期"
              {...formItemLayout}
            >
              {getFieldDecorator('shelf_life', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="销售单位"
              {...formItemLayout}
            >
              {getFieldDecorator('sales_unit', {
              })(
                <Input />
              )}
            </FormItem>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem
                  label="库存"
                  labelCol={{ span: 9 }}
                  wrapperCol={{ span: 11 }}
                >
                  {getFieldDecorator('stock', {
                    rules: [{ required: true, message: '请输入库存量' }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label="最低采购量"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 11 }}
                >
                  {
                    getFieldDecorator('min_buy', {
                      rules: [{ required: true, message: '请输入最低采购量' }],
                    })(
                      <Input />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <FormItem
              label="运费"
              {...formItemLayout}
            >
              {
                getFieldDecorator('shipping_fee_type', {
                })(
                  <span>{data.shipping_fee_type === 1 ? '包邮' : '货到付款'}</span>
                )
              }
            </FormItem>
          </Form>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem
                label="CAD图"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10 }}
              >
                <span>商品设计图.cad</span>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                labelCol={{ span: 1 }}
                wrapperCol={{ span: 23 }}
              >
                <span>2017-12-29 12:36:45</span>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                labelCol={{ span: 1 }}
                wrapperCol={{ span: 12 }}
              >
                <a>查看</a>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem
                label=""
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 10, offset: 9 }}
              >
                <span>商品设计图.cad</span>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                labelCol={{ span: 1 }}
                wrapperCol={{ span: 23 }}
              >
                <span>2017-12-29 12:36:45</span>
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                labelCol={{ span: 1 }}
                wrapperCol={{ span: 12 }}
              >
                <a>查看</a>
              </FormItem>
            </Col>
          </Row>
        </div>
        {/* 商品图片和价格区间 */}
        <div style={{ float: 'left', height: 546, position: 'relative' }}>
          <div>
            <h4>商品图片</h4>
            <Row style={{ maxWidth: 360 }} gutter={12}>
              {
                product.pics.map(val => (
                  <Col span={8} key={val.id} >
                    <img src={val.img_url} alt={val.img_type} title={val.img_type} width="100%" style={{ marginTop: 5, marginBottom: 8 }} />
                  </Col>
                ))
              }
            </Row>
          </div>
          <div className={styles['price-range']}>
            <h4>*价格设置</h4>
            <Table
              bordered
              pagination={false}
              size="small"
              rowKey={item => (item.id + Math.random)}
              dataSource={data.prices}
              columns={columns}
            />
          </div>

        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="商品概述" key="1">
              <RichEditor
                onChange={(html) => { this.handleChange('summary', html); }}
              />
            </TabPane>
            <TabPane tab="商品详情" key="2">
              <RichEditor
                onChange={(html) => { this.handleChange('description', html); }}
              />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="3" >
              <RichEditor
                onChange={(html) => { this.handleChange('faq', html); }}
              />
            </TabPane>
          </Tabs>
        </div>
        <SectionHeader title="产品其他属性" />
        <div className="other-attrs">

          {
            product.other_attrs.map((val, idx) => (
              <Row gutter={24} key={idx}>
                <Col span={8} style={{ textAlign: 'left' }}>
                  <FormItem
                    label={val.attr_name}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 10 }}
                  >
                    <span>{val.attr_value}</span>
                  </FormItem>
                </Col>
              </Row>

            ))
          }
        </div>
        <SectionHeader title="佣金比率" />
        <div className="commission">
          <Row gutter={24}>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="佣金比率"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>5%</span>
              </FormItem>
            </Col>
          </Row>
        </div>
        <SectionHeader title="供应商信息" />
        <div className="commission">
          <Row gutter={24}>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="联系人"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>某某某</span>
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="联系电话"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>13574488306</span>
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="公司名称"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>湖南孚中信息</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="收货地址"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>湖南长沙岳麓挑子湖</span>
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default GoodInfo;

