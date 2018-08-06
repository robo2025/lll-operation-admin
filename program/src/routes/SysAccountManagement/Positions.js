import React from 'react';
import { connect } from 'dva';
import { Card, message, Spin, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditPosition from './EditPostiton';

@Form.create()
@connect(({ sysAccount, loading }) => ({
  positionList: sysAccount.positionList,
  loading: loading.effects['sysAccount/fetchPositions'],
  editLoading: loading.effects['sysAccount/fetchEditPosition'],
  deleteLoading: loading.effects['sysAccount/fetchDeletePostiton'],
}))
class Positions extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'sysAccount/fetchPositions',
    });
  }
  onSubmit = (values) => {
    const { dispatch, form } = this.props;
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
    dispatch({
      type: 'sysAccount/fetchEditPosition',
      params: result,
      success: (res) => {
        message.success(res.msg);
        dispatch({
          type: 'sysAccount/fetchPositions',
          success: () => {
            form.resetFields();
          },
        });
      },
      error: (error) => {
        message.error(error.msg);
      },
    });
  };
  onRemove = (k) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysAccount/fetchDeletePostiton',
      positionId: k.id,
      success: (res) => {
        message.success(res.msg);
        dispatch({
            type: 'sysAccount/fetchPositions',
          });
      },
      error: (error) => {
        message.error(error.msg);
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
    const { positionList, loading, editLoading, deleteLoading, form } = this.props;
    positionList.sort(this.compare('id'));
    return (
      <PageHeaderLayout title="职位信息">
        <Card title="所有职位">
            <Spin spinning={loading || editLoading || deleteLoading || false}>
          <EditPosition
            initData={positionList}
            onSubmit={this.onSubmit}
            onRemove={this.onRemove}
            form={form}
          />
            </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Positions;
