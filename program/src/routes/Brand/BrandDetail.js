import React, { Component } from 'react';
import { Card, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

@Form.create()
export default class BrandDetail extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout title="查看品牌">
        <Card bordered={false} style={{ marginBottom: 25 }}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="品牌ID"
            >
              <span>PP123456789</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌"
            >
              <span>固高</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="英文名(选填)"
            >
              <span>QUICKQT</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="LOGO"
            >
              <div className="pic-box">
                <img
                  src="https://ss.intsig.net/yemai/vip/camfs/qxb/11111_16d11642e1a8286ae3b3028fa2de13db"
                  alt="图片"
                  width={80}
                  height={80}
                />
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌证书"
            >
              <div className="pic-box">
                <img
                  src="http://img1.maka.im/2013364/128551285456ebb6f6a8a558.26902182.png@0-0-1200-357a_80Q.src"
                  alt="图片"
                  width={150}
                />
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌介绍"
            >
              <p>
                固高科技(香港)有限公司成立于1999年，总部位于香港科技大学。创立者为自动化和微电子领域的国际知名
                专家、学者。具有多年在加利福尼亚大学(UC Berkeley)、麻省理工学院 (MIT)、贝尔实验
                室(Bell Lab)等国际一流科研机构进行研发和管理经验，同年，固高科技（深圳）有限公司成立。
              </p>
            </FormItem>
          </Form>
        </Card>
        <Card bordered={false} title="已关联产品" style={{ marginBottom: 25 }}>
          456
        </Card>
        <Card bordered={false} title="操作记录" style={{ marginBottom: 25 }}>
          456
        </Card>
      </PageHeaderLayout>
    );
  }
}
