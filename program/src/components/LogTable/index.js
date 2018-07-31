import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

const ACTION_FLAG_STATUS = {
  1: ' 添加',
  2: '修改',
  4: '审核',
  8: '发布',
  16: '删除',
};
const PLATFORM_STATUS = {
  operation: '运营',
  supplier: '供应商',
};
@connect(({ log, loading }) => ({
  log,
  loading: loading.effects['log/fetch'],
}))
export default class RecordTable extends Component {
  static defaultProps = {
    platform: null,
  };
  state = {
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };
  componentDidMount() {
    const { object_id, module, platform } = this.props;
    const { pagination } = this.state;
    this.props.dispatch({
      type: 'log/fetch',
      payload: {
        ...pagination,
        object_id,
        module,
        platform,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    const { object_id, module, platform, dispatch } = this.props;
    dispatch({
      type: 'log/fetch',
      payload: {
        object_id,
        module,
        platform,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      },
    });
  };
  render() {
    const { log, loading } = this.props;
    if (!log) {
        return <Card loading />;
    }
    const { list, total } = log;
    const { pagination } = this.state;
    const paginationProps = {
      ...pagination,
      total,
      style: { float: 'right', marginTop: 24 },
      showQuickJumper: true,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      showSizeChanger: true,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render: (text, record, index) => index + 1,
      },
      {
        title: '操作人',
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: '操作时间',
        dataIndex: 'created_time',
        key: 'created_time',
        render: text => moment.unix(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作对象',
        dataIndex: 'object_id',
        key: 'object_id',
      },
      {
        title: '操作类型',
        dataIndex: 'action_flag',
        key: 'action_flag',
        render: text => ACTION_FLAG_STATUS[text],
      },
      {
        title: '执行描述',
        dataIndex: 'change_message',
        key: 'change_message',
      },
      {
        title: '模块',
        dataIndex: 'module',
        key: 'module',
      },
      {
        title: '平台',
        dataIndex: 'platform',
        key: 'platform',
        render: text => PLATFORM_STATUS[text],
      },
    ];
    return (
         <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={{ ...paginationProps }}
         /> 
    );
  }
}
RecordTable.propTypes = {
  object_id: PropTypes.number.isRequired,
  module: PropTypes.string.isRequired,
  platform: PropTypes.string,
};
