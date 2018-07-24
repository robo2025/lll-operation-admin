import React from 'react';
import EditableProfile from '../EditableProfile';
import { connect } from 'dva';

@connect()
class AccountCheck extends React.Component {
  handleSubmit = (formData) => {
    this.props.dispatch({
      type: 'supAccount/audit',
      payload: formData,
    });
  };
  render() {
    return (
      <EditableProfile buttonText="审核" handleSubmit={this.handleSubmit} />
    );
  }
}

export default AccountCheck;
