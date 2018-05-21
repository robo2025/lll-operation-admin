import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Button, Table, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import ProductForm from '../../components/CustomeForm/ProductForm';
import { ACTION_FLAG } from '../../constant/statusList';
import { queryString } from '../../utils/tools';

import styles from './ProductDetail.less';

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
const formItemLayout2 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 6 },
};


@connect(({ product, logs, loading }) => ({
  product,
  logs,
  loading,
}))
@Form.create()
export default class GoodDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      args: queryString.parse(window.location.href),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 获取商品详情
    dispatch({
      type: 'product/fetchDetail',
      pno: args.pno,
    });
    // 获取产品操作日志
    dispatch({
      type: 'logs/fetch',
      module: 'product',
      objectId: args.pno,
    });
  }

  render() {
    const { product, logs, loading } = this.props;
    const { detail } = product;
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout title="产品详情" >
        <Card bordered={false} className={styles['new-good-wrap']}>
          <SectionHeader
            title="产品基础信息"
          />
          <ProductForm
            loading={loading.models.product}
            data={product.detail}
          />
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
          <SectionHeader
            title="操作日志"
          />
          <Table
            loading={loading.models.logs}
            rowKey="id"
            columns={actionColumns}
            dataSource={logs.list}
          />
          <div className={styles['submit-btn-wrap']}>
            <Button type="primary" onClick={() => { this.props.history.goBack(); }}>返回列表</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
