/*
 * @Author: lll
 * @Date: 2018-01-31 16:19:39
 * @Last Modified by: lll
 * @Last Modified time: 2018-06-22 13:43:10
 */
import React from 'react';
import 'braft-editor/dist/braft.css';
import { Form, Row, Col, Table, Tabs, Spin } from 'antd';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import RichEditorShow from '../../components/RichEditor/RichEidtorShow';
import { PIC_TYPES } from '../../constant/statusList';
import { getAreaBycode } from '../../utils/cascader-address-options';

import styles from './good-info.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

// 其他属性列
const attrClomns = [{
  title: '属性名',
  dataIndex: 'spec_name',
  key: 'spec_name',
}, {
  title: '属性值',
  dataIndex: 'spec_unit',
  key: 'spec_unit',
  render: (text, record) => (<span>{record.spec_value}{text}</span>),
}];

@Form.create()
class GoodInfo extends React.Component {
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
      labelCol: {
        md: { span: 4 },
        xxl: { span: 3 },
      },
      wrapperCol: {
        md: { span: 18 },
        xxl: { span: 15 },
      },
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
    const { data, user } = this.props;
    if (!data.product) {
      return <Spin spinning />;
    }
    const { product } = data;
    const productModel = data.product_model;
    const category = product ? product.category : '';
    const categoryStr = category ?
      `${category.category_name}-${category.children.category_name}-${category.children.children.category_name}-${category.children.children.children.category_name}`
      : '';
    const supplierAdress = getAreaBycode(user.profile ? user.profile.district_id.toString() : '').join('');
      

    return (
      <div className={styles['good-info-wrap']}>
        <SectionHeader title="商品基础信息" />
        {/* 商品主要属性 */}
        <div style={{ float: 'left', width: '45%', borderRight: '1px solid #eee' }}>
          <Form layout="horizontal">
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              {getFieldDecorator('cate', {
                initialValue: categoryStr,
              })(
                <span>{categoryStr}</span>
              )}
            </FormItem>
            <FormItem
              label="产品ID"
              {...formItemLayout}
            >
              {getFieldDecorator('pno', {
              })(
                <span>{product.pno}</span>
              )}
            </FormItem>
            <FormItem
              label="商品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('product_name', {
                initialValue: product.product_name,
              })(
                <span className="title" title={product.product_name}>{product.product_name}</span>
              )}
            </FormItem>
            <FormItem
              label="商品ID"
              {...formItemLayout}
            >
              {getFieldDecorator('gno', {
              })(
                <span>{data.gno}</span>
              )}
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              {getFieldDecorator('partnumber', {
              })(
                <span>{data.product_model ? data.product_model.partnumber : ''}</span>
              )}
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              {getFieldDecorator('band', {
              })(
                <span>{product.brand.brand_name}</span>
              )}
            </FormItem>
            <FormItem
              label="英文名"
              {...formItemLayout}
            >
              {getFieldDecorator('en_name', {
              })(
                <span>{product.brand.english_name}</span>
              )}
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              {getFieldDecorator('prodution_place', {
              })(
                <span>{product.brand.registration_place}</span>
              )}
            </FormItem>
            <FormItem
              label="质保期"
              {...formItemLayout}
            >
              {getFieldDecorator('shelf_life', {
              })(
                <span>{data.shelf_life}</span>
              )}
            </FormItem>
            <FormItem
              label="销售单位"
              {...formItemLayout}
            >
              {getFieldDecorator('sales_unit', {
              })(
                <span>{data.sales_unit}</span>
              )}
            </FormItem>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem
                  label="库存："
                  labelCol={{ md: { span: 8 }, xxl: { span: 6 } }}
                  wrapperCol={{ md: { span: 12 }, xxl: { span: 10 } }}
                >
                  {getFieldDecorator('stock', {
                    rules: [{ required: false, message: '请输入库存量' }],
                  })(
                    <span>{data.stock}</span>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="最低采购量"
                  labelCol={{ md: { span: 14 }, xxl: { span: 6 } }}
                  wrapperCol={{ md: { span: 10 }, xxl: { span: 8 } }}
                >
                  {
                    getFieldDecorator('min_buy', {
                      rules: [{ required: true, message: '请输入最低采购量' }],
                    })(
                      <span>{data.min_buy}</span>
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
            {
              product.cad_urls ?
                product.cad_urls.map((val, idx) => (
                  <Row gutter={24} key={idx}>
                    <Col span={12}>
                      <FormItem
                        labelCol={{ md: { span: 8 }, xxl: { span: 6 } }}
                        label={idx === 0 ? 'CAD图' : ''}
                        wrapperCol={(idx === 0) ? { span: 15 } : { span: 15, offset: 9 }}
                      >
                        <span className="title" title={val.split('/').slice(-1)[0]}>{val.split('/').slice(-1)[0]}</span>
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        labelCol={{ span: 1 }}
                        wrapperCol={{ span: 20, offset: 15 }}
                      >
                        <a href={val} target="_blank">查看</a>
                      </FormItem>
                    </Col>
                  </Row>
                )) : null
            }
            <FormItem
              label="价格设置"
              {...formItemLayout}
            >
              <div className={styles['price-range']}>
                <Table
                  bordered
                  pagination={false}
                  size="small"
                  rowKey="id"
                  dataSource={data.prices}
                  columns={columns}
                />
              </div>
            </FormItem>
          </Form>
        </div>
        {/* 商品图片和价格区间 */}
        <div style={{ float: 'left', height: 546, width: '50%', marginLeft: '5%', position: 'relative' }}>
          <div>
            {/* <h4>商品图片</h4> */}
            <Row style={{ maxWidth: 500 }} gutter={48}>
              {
                product.pics.map(val => (
                  <Col span={6} key={val.id} >
                    <img
                      className="good-pics"
                      src={val.img_url}
                      alt={PIC_TYPES[val.img_type]}
                      title={PIC_TYPES[val.img_type]}
                    />
                    <p style={{ textAlign: 'center' }}>{PIC_TYPES[val.img_type]}</p>
                  </Col>
                ))
              }
            </Row>
          </div>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1">
            <TabPane tab="产品概述" key="1">
              <RichEditorShow content={data.product ? data.product.summary : '无'} />
            </TabPane>
            <TabPane tab="产品详情" key="2">
              <RichEditorShow content={data.product ? data.product.description : '无'} />
            </TabPane>
            <TabPane tab="学堂" key="3">
              <RichEditorShow content={data.product ? data.product.course : '无'} />
            </TabPane>
            <TabPane tab="视频详解" key="4">
              <RichEditorShow content={data.product ? data.product.video : '无'} />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="5" >
              <RichEditorShow content={data.product ? data.product.faq : '无'} />
            </TabPane>
          </Tabs>
        </div>
        <SectionHeader title="规格参数" />
        <div className="other-attrs" style={{ width: 680 }}>
          <Table
            className="attr-table"
            bordered
            size="small"
            pagination={false}
            columns={attrClomns}
            dataSource={productModel.specs}
            locale={{
              emptyText: '该产品无其它属性',
            }}
          />
        </div>
        <SectionHeader title="佣金比率" />
        <div className="other-attrs">
          <Row gutter={24}>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="佣金比率"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span> 0.0%</span>
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
                <span>{user.username}</span>
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="联系电话"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>{user.mobile}</span>
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="公司名称"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>{user.profile ? user.profile.company : ''}</span>
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
                <span>{supplierAdress}{user.profile ? user.profile.address : ''}</span>
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default GoodInfo;

