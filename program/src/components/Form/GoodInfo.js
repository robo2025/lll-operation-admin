/*
 * @Author: lll
 * @Date: 2018-01-31 16:19:39
 * @Last Modified by: lll
 * @Last Modified time: 2018-02-02 10:03:36
 */
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Upload, Icon, Table, Tabs } from 'antd';
import SectionHeader from '../../components/PageHeader/SectionHeader';

import styles from './good-info.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;

@Form.create()
class GoodInfo extends PureComponent {
  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { data } = this.props;
    for (const keyName in data) {
      if (data[keyName]) {
        const temp = {};
        temp[keyName] = data[keyName];
        setFieldsValue(temp);
      }
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
    };

    const columns = [{
      title: '采购量',
      dataIndex: 'num',
      key: 'num',
    }, {
      title: '销售单价(含税)',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '发货日',
      dataIndex: 'delivery',
      key: 'delivery',
    }];

    const { getFieldDecorator } = this.props.form;
    const { data } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    console.log(this.props);

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
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="产品ID"
              {...formItemLayout}
            >
              {getFieldDecorator('good_id', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="商品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="商品ID"
              {...formItemLayout}
            >
              {getFieldDecorator('product_id', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              {getFieldDecorator('type', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              {getFieldDecorator('band', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="英文名"
              {...formItemLayout}
            >
              {getFieldDecorator('en_name', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              {getFieldDecorator('place', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="质保期"
              {...formItemLayout}
            >
              {getFieldDecorator('warranty', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="销售单位"
              {...formItemLayout}
            >
              {getFieldDecorator('unit', {
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
                    getFieldDecorator('min_buy_num', {
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
                getFieldDecorator('freight', {
                })(
                  <span>{data.freight}</span>
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
            <Upload
              action="//jsonplaceholder.typicode.com/posts/"
              listType="picture-card"
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {uploadButton}
            </Upload>
          </div>
          <div className={styles['price-range']}>
            <h4>*价格设置</h4>
            <Table
              bordered
              pagination={false}
              size="small"
              rowKey="123456"
              dataSource={data.price_range}
              columns={columns}
            />
          </div>

        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="商品概述" key="1">
              <TextArea
                autosize={{
                  minRows: 20,
                }}
              />
            </TabPane>
            <TabPane tab="商品详情" key="2">
              <TextArea
                autosize={{
                  minRows: 20,
                }}
              />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="3" >
              <TextArea
                autosize={{
                  minRows: 20,
                }}
              />
            </TabPane>
          </Tabs>
        </div>
        <SectionHeader title="产品其他属性" />
        <div className="other-args">
          <Row gutter={24}>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="控制输出"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>NPM及电路开路输出</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="检测物体"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>不透明物体 min.08×1.8mm</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8} style={{ textAlign: 'left' }}>
              <FormItem
                label="形状"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 10 }}
              >
                <span>L型</span>
              </FormItem>
            </Col>
          </Row>
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

