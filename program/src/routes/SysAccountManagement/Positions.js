import React from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Icon, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditPosition from './EditPostiton';

@connect(({ sysAccount }) => ({
  positionList: sysAccount.positionList,
}))
class Positions extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'sysAccount/fetchPositions',
    });
  }
  onSubmit = (values) => {
    const { dispatch } = this.props;
    const { keys, ...others } = values;
    let result = [];
    Object.keys(others).forEach((id) => {
      result = [
        ...result,
        {
          id,
          name: others[id],
        },
      ];
    });
    console.log(123);
    dispatch({
        type: 'sysAccount/fetchEditPosition',
        params: result,
        success: (res) => {
            console.log(res);
        },
        error: (error) => {
            console.log(error);
        },
    });
  };
  compare(pro) {
    // 数组排序
    return function objCompare(obj1, obj2) {
      const val1 = obj1[pro];
      const val2 = obj2[pro];
      if (val1 > val2) {
        // 正序
        return 1;
      } else if (val1 < val2) {
        return -1;
      } else {
        return 0;
      }
    };
  }
  render() {
    const { positionList } = this.props;
    positionList.sort(this.compare('id'));
    return (
      <PageHeaderLayout title="职位信息">
        <Card title="所有职位">
          <EditPosition initData={positionList} onSubmit={this.onSubmit} />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Positions;
