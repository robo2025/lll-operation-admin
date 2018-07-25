import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import EditableProfile from './EditableProfile';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect()
class AccountCheckModify extends React.Component {
  handleSubmit = (formData) => {
      // 修改和审核一个接口
    this.props.dispatch({
      type: 'supAccount/accountAudit',
      payload: { formData, id: location.href.split('=').pop() },
      callback: (success, data) => {
        if (success & success === true) {
            this.props.dispatch({
                type: 'supAccount/fetchDetail',
                payload: location.href.split('=').pop(),
            });
          message.success(data);
        } else {
          message.error(data);
        }
      },
    });
  };

  render() {
    return (
      <PageHeaderLayout title="供应商账号编辑">
        <EditableProfile
          buttonText="确认修改"
          handleSubmit={formData => this.handleSubmit(formData)}
          type="update"
        />
      </PageHeaderLayout>
    );
  }
}

export default AccountCheckModify;
