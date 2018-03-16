/*
 * @Author: lll
 * @Date: 2018-01-31 16:19:39
 * @Last Modified by: lll
 * @Last Modified time: 2018-03-16 16:10:05
 */
import React, { PureComponent } from 'react';
import 'braft-editor/dist/braft.css';
import { Form, Input, Row, Col, Upload, Icon, Table, Tabs, Spin } from 'antd';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import RichEditor from '../../components/RichEditor/RichEditor';
import RichEditorShow from '../../components/RichEditor/RichEidtorShow';

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
class GoodInfo extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log('渲染好了', this.goodDescDom, this);
  }

  // 输入框有改变时
  handleChange(key, value) {
    const tempJson = {};
    tempJson[key] = value;
    this.props.onAttrChange(tempJson);
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
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
    const category = product ? product.category : '';
    const categoryStr = category ?
      `${category.category_name}-${category.children.category_name}-${category.children.children.category_name}-${category.children.children.children.category_name}`
      : '';
    // const uploadButton = (
    //   <div>
    //     <Icon type="plus" />
    //     <div className="ant-upload-text">上传</div>
    //   </div>
    // );
    console.log('product', data.product.description);
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
              <Col span={10}>
                <FormItem
                  label="库存"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 12 }}
                >
                  {getFieldDecorator('stock', {
                    rules: [{ required: true, message: '请输入库存量' }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="最低采购量"
                  labelCol={{ span: 14 }}
                  wrapperCol={{ span: 10 }}
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
            {
              product.cad_url ?
                product.cad_url.map((val, idx) => (
                  <Row gutter={24} key={idx}>
                    <Col span={12}>
                      <FormItem
                        label={idx === 0 ? 'CAD图' : ''}
                        labelCol={{ span: 8 }}
                        wrapperCol={(idx === 0) ? { span: 15 } : { span: 15, offset: 9 }}
                      >
                        <span>{val.split('/').slice(-1)[0]}</span>
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        labelCol={{ span: 1 }}
                        wrapperCol={{ span: 20, offset: 15 }}
                      >
                        <a href={val}>查看</a>
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
                  rowKey={item => (item.id + Math.random)}
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
                      alt={val.img_type}
                      title={val.img_type}
                    />
                  </Col>
                ))
              }
            </Row>
          </div>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="2" onChange={(key) => { console.log(key); }}>
            <TabPane tab="商品详情" key="2">
              <RichEditorShow content={data.product.description} />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="3" >
              <RichEditorShow content={data.product.faq} />
            </TabPane>
          </Tabs>
        </div>
        <SectionHeader title="产品其他属性" />
        <div className="other-attrs">
          {
            product.other_attrs < 1 ? <Row gutter={8}><Col span={8} offset={1}>无</Col></Row> : null
          }
          {
            product.other_attrs.map((val, idx) => (
              <Row gutter={24} key={idx}>
                <Col span={3} style={{ textAlign: 'left' }}>
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
                <span>{user.supplier.contactname}</span>
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="联系电话"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>{user.supplier.mobile}</span>
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="公司名称"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>{user.supplier.company}</span>
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
                <span>{user.supplier.shipping_address}</span>
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default GoodInfo;

