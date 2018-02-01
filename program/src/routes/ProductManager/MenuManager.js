import React from 'react';
import { Card, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import MenuForm from './MenuForm';


import styles from './product-manager.less';

const tableData = [{
  key: '1',
  level: 0,
  title: '电机',
  id: 'm000',
  relate_num: Math.floor(Math.random() * 1000) >> 0,
  create_man: '管理员',
  createdAt: new Date(`2017-07-${Math.floor(5 / 2) + 1}`),
  status: Math.floor(Math.random() * 10) % 2,
  children: [{
    key: '11',
    level: 1,
    title: '传感器',
    id: 'm010',
    status: Math.floor(Math.random() * 10) % 2,
    relate_num: Math.floor(Math.random() * 1000) >> 0,
    create_man: '管理员',
    children: [{
      key: 'm020',
      level: 2,
      title: '直流电机',
      id: 'm020',
      status: Math.floor(Math.random() * 10) % 2,
      relate_num: Math.floor(Math.random() * 1000) >> 0,
      create_man: '管理员',
    }, {
        key: 'm021',
        level: 2,
        title: '直流电机',
        id: 'm021',
        status: Math.floor(Math.random() * 10) % 2,
        relate_num: Math.floor(Math.random() * 1000) >> 0,
        create_man: '管理员',
    }, {
      key: 'm022',
      level: 2,
      title: '直流电机',
      id: 'm022',
      status: Math.floor(Math.random() * 10) % 2,
      relate_num: Math.floor(Math.random() * 1000) >> 0,
      create_man: '管理员',
  }],
  }],
}, {
  key: '2',
  level: 0,
  title: '电机',
  id: 'm100',
  relate_num: Math.floor(Math.random() * 1000) >> 0,
  create_man: '管理员',
  createdAt: new Date(`2017-07-${Math.floor(5 / 2) + 1}`),
  status: Math.floor(Math.random() * 10) % 2,
  children: [{
    key: 'm110',
    level: 1,
    title: '传感器',
    id: 'm110',
    status: Math.floor(Math.random() * 10) % 2,
    relate_num: Math.floor(Math.random() * 1000) >> 0,
    create_man: '管理员',
    children: [{
      key: 'm111',
      level: 2,
      title: '直流电机',
      id: 'm111',
      status: Math.floor(Math.random() * 10) % 2,
      relate_num: Math.floor(Math.random() * 1000) >> 0,
      create_man: '管理员',
    }, {
        key: 'm112',
        level: 2,
        title: '直流电机',
        id: 'm112',
        status: Math.floor(Math.random() * 10) % 2,
        relate_num: Math.floor(Math.random() * 1000) >> 0,
        create_man: '管理员',
    }, {
      key: 'm113',
      level: 2,
      title: '直流电机',
      id: 'm113',
      status: Math.floor(Math.random() * 10) % 2,
      relate_num: Math.floor(Math.random() * 1000) >> 0,
      create_man: '管理员',
  }],
  }],
}];

// 产品目录管理
@Form.create()
class MenuManager extends React.Component {
  render() {
    const { form } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    return (
      <PageHeaderLayout title="产品目录管理">
        <Card title="目录管理" className={styles.card} bordered={false}>
          {getFieldDecorator('menu', {
            initialValue: tableData,
          })(<MenuForm />)}
        </Card>
      </PageHeaderLayout>
    );
  }
}


export default MenuManager;
