import React, { Component } from 'react';
import { connect } from 'dva';
import qs from 'qs';
import moment from 'moment';
import { Card, Row, Table, Tabs, Form, Input, Button, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import RichEditorShow from '../../components/RichEditor/RichEidtorShow';
import { PIC_TYPES, ACTION_FLAG } from '../../constant/statusList';
import { handleServerMsgObj } from '../../utils/tools';
import styles from './style.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
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
export default class productModelModify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }),
      specs: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    dispatch({
      type: 'productModel/fetchDetail',
      mno: args.mno,
      success: (res) => {
        const specs = [];
        res.data.specs.forEach((val1) => {
          res.data.product.specs.forEach((val2) => {
            if (val1.id === val2.id) {
              specs.push({
                ...val1,
                is_require: val2.is_require,
              });
            }
          });
        });
        this.setState({ specs });
      },
    });
    // 获取产品操作日志
    dispatch({
      type: 'logs/fetch',
      module: 'product_model',
      objectId: args.mno,
    });
  }

  handleSubmitProductModel = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log('校验出错', err);
      }
      // 从fieldsValue中取出参数项
      const specs = [];
      const specKeys = Object.keys(fieldsValue).filter(val => /spec_/.test(val));
      specKeys.forEach((val) => {
        specs.push({
          spec_name: val.replace(/spec_/, ''), // 参数名称
          spec_value: fieldsValue[val], // 参数值
          sort: 0,
        });
      });

      // 
      this.dispatchAddProductModel({
        partnumber: fieldsValue.partnumber, // 型号
        specs,
      });
    });
  }

  // 发起新增产品型号操作
  dispatchAddProductModel = (data) => {
    const { args } = this.state;
    const { dispatch, history } = this.props;
    dispatch({
      type: 'productModel/modify',
      mno: args.mno,
      data,
      success: () => { history.goBack(); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { specs } = this.state;
    const { productModel, logs, loading, history } = this.props;
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
      <PageHeaderLayout title="修改产品型号">
        <Card>
          <SectionHeader
            title="产品型号信息"
          />
          <div className={styles['product-info-wrap']} >
            <div style={{ float: 'left', width: '50%' }}>
              <Form layout="horizontal">
                <FormItem
                  label="所属类目"
                  {...formItemLayout}
                >
                  {getFieldDecorator('category', {
                  })(
                    <span>
                      {
                     detail.product && `
                     ${detail.product.category.category_name}-
                     ${detail.product.category.children.category_name}-
                     ${detail.product.category.children.children.category_name}-
                     ${detail.product.category.children.children.children.category_name}
                     `
                    }
                    </span>
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
                <FormItem
                  label="产品名称"
                  {...formItemLayout}
                >
                  {getFieldDecorator('product_name', {
                  })(
                    <span>{detail.product && detail.product.product_name}</span>
                  )}
                </FormItem>
                <FormItem
                  label="产品型号"
                  {...formItemLayout}
                >
                  {getFieldDecorator('partnumber', {
                    rules: [{
                      required: true,
                      message: '请输入...',
                    }],
                    initialValue: detail.partnumber,
                  })(
                    <Input />
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
                specs.map(val => (
                  <FormItem
                    label={val.spec_name}
                    {...formItemLayout2}
                    key={val.id}
                  >
                    {getFieldDecorator(`spec_${val.spec_name}`, {
                      rules: [{
                        required: Boolean(val.is_require),
                        message: '该参数项必填',
                      }],
                      initialValue: val.spec_value,
                    })(
                      <Input addonAfter={val.spec_unit} />
                    )}
                  </FormItem>
                ))
              }
            </Form>
          </div>
          <SectionHeader
            title="系列详情"
          />
          <div className="good-desc">
            <div className="cad-urls-wrap" style={{ width: 800 }}>
              <FormItem
                label="CAD图"
                {...formItemLayout2}
                extra="暂只支持PDF、WORD格式文档"
              >
                {getFieldDecorator('cad_urls', {
                  rules: [{
                    required: false,
                    message: '请上传CAD图',
                  }],
                })(
                  <div>
                    {
                      detail.product && detail.product.cad_urls.map(val => (
                        <a href={val} style={{ display: 'block' }} key={val}>{val}</a>
                      ))
                    }
                  </div>
                )}
              </FormItem>
            </div>
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
          <div className={styles['submit-btn-wrap']} style={{ marginTop: 20 }}>
            <Button onClick={() => { history.goBack(); }}>取消</Button>
            <Button type="primary" onClick={this.handleSubmitProductModel}>提交</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
