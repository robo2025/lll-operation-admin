import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import qs from 'qs';
import { Card, Row, Form, Button, Table, Tabs } from 'antd';
import RichEditorShow from '../../components/RichEditor/RichEidtorShow';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import { PIC_TYPES, ACTION_FLAG } from '../../constant/statusList';

import styles from './style.less';

const { TabPane } = Tabs;
const FormItem = Form.Item;
// 操作记录列
const actionColumns = [{
  title: '操作类型',
  dataIndex: 'action_flag',
  key: 'action_flag',
  render: val => <span>{ACTION_FLAG[val]}</span>,
}, {
  title: '说明',
  dataIndex: 'change_message',
  key: 'change_message',
}, {
  title: '操作员',
  dataIndex: 'creator',
  key: 'creator',
  render: (text, record) => (<span>{`${text}(${record.creator_id})`}</span>),
}, {
  title: '操作时间',
  dataIndex: 'created_time',
  key: 'created_time',
  render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
}];


@connect(({ productModel, logs, loading }) => ({
  productModel,
  logs,
  loading,
}))
@Form.create()
export default class productModelDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'productModel/fetchDetail',
      mno: args.mno,
    });
    // 获取产品操作日志
    dispatch({
      type: 'logs/fetch',
      module: 'product_model',
      objectId: args.mno,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { productModel, logs, loading } = this.props;
    const { detail } = productModel;    
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 15 },
    };
    const formItemLayout2 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 6 },
    };

    return (
      <PageHeaderLayout title={detail.product && detail.product.product_name}>
        <Card>
          <SectionHeader
            title="产品型号信息"
          />
          <div className={styles['product-info-wrap']} >
            <div style={{ float: 'left', width: '50%' }}>
              <Form layout="horizontal">
                <FormItem
                  label="产品型号ID"
                  {...formItemLayout}
                >
                  {getFieldDecorator('mno', {
                  })(
                    <span>{detail.mno}</span>
                  )}
                </FormItem>
                <FormItem
                  label="产品型号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('partnumber', {
                  })(
                    <span>{detail.partnumber}</span>
                  )}
                </FormItem>
                <FormItem
                  label="品牌"
                  {...formItemLayout}
                >
                  {getFieldDecorator('bno', {
                  })(
                    <span>{detail.product && detail.product.brand.brand_name}</span>
                  )}
                </FormItem>
                <FormItem
                  label="英文名"
                  {...formItemLayout}
                >
                  {getFieldDecorator('english_name', {
                  })(
                    <span>{detail.product && detail.product.brand.english_name}</span>
                  )}
                </FormItem>
                <FormItem
                  label="产地"
                  {...formItemLayout}
                >
                  {getFieldDecorator('registration_place', {
                  })(
                    <span>{detail.product && detail.product.brand.registration_place}</span>
                  )}
                </FormItem>
              </Form>
            </div>
            <div style={{ float: 'left', maxWidth: 520, position: 'relative', top: -60 }}>
              <div style={{ marginBottom: 20 }}>
                <h3>产品图片</h3>
                <small>暂时支持格式：JPG/PNG/GIF/BMG/JPGE,文件大小请保持在100KB以内；</small>
              </div>
              <Row gutter={24} className={styles['pics-wrap']}>
                {
                  detail.product && detail.product.pics.map(val => (
                    <div className="pic-box" key={val.id}>
                      <img
                        src={val.img_url}
                        alt="图片"
                        width={120}
                        height={120}
                      />
                      <p className="upload-pic-desc">{PIC_TYPES[val.img_type]}</p>
                    </div>
                  ))
                }
              </Row>
            </div>
          </div>
          <div style={{ clear: 'both' }} />
          <SectionHeader
            title="规格参数"
          />
          <div className="spec-wrap" style={{ width: 800 }}>
            <Form>
              {
                detail.specs && detail.specs.map(val => (
                  <FormItem
                    label={val.spec_name}
                    {...formItemLayout2}
                    key={val.id}
                  >
                    {getFieldDecorator(`spec_${val.spec_name}`, {
                    })(
                      <span>{val.spec_value}{val.spec_unit}</span>
                    )}
                  </FormItem>
                ))
              }
            </Form>
          </div>
          <div className="good-desc">
            <Tabs defaultActiveKey="1">
              <TabPane tab="产品概述" key="1">
                <RichEditorShow content={detail.product ? detail.product.summary : '无'} />
              </TabPane>
              <TabPane tab="产品详情" key="2">
                <RichEditorShow content={detail.product ? detail.product.description : '无'} />
              </TabPane>
              <TabPane tab="学堂" key="3">
                <RichEditorShow content={detail.product ? detail.product.course : '无'} />
              </TabPane>
              <TabPane tab="视频详解" key="4">
                <RichEditorShow content={detail.product ? detail.product.video : '无'} />
              </TabPane>
              <TabPane tab="常见问题FAQ" key="5" >
                <RichEditorShow content={detail.product ? detail.product.faq : '无'} />
              </TabPane>
            </Tabs>
          </div>
          <SectionHeader
            title="操作日志"
          />
          <Table
            loading={loading.models.logs}
            rowKey="id"
            columns={actionColumns}
            dataSource={logs.list}
          />
          <div className={styles['submit-btn-back-wrap']}>
            <Button type="primary" onClick={() => { this.props.history.goBack(); }}>返回列表</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
