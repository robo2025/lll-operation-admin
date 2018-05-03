import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Form, Input, Button, Icon, DatePicker, Select, Divider, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CustomizableTable from '../../components/CustomTable/CustomizableTable';

import styles from './style.less';
import { handleServerMsgObj } from '../../utils/tools';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ brand, productModel, loading }) => ({
  brand,
  productModel,
  loading,
}))
@Form.create()
export default class productModelModify extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productModel/fetch',
    });
  }

  render() {
    return (
      <PageHeaderLayout title="修改产品型号">
        <Card>
          修改产品型号信息
        </Card>
      </PageHeaderLayout>
    );
  }
}
