import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Modal, Radio, Input, Form, message, Spin } from 'antd';
import RecordTable from '../../components/RecordTable';
import EditableProfile from './EditableProfile';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@connect(({ supAudit }) => ({
  profile: supAudit.profile,
}))
@Form.create()
class AccountCheck extends React.Component {
  state = {
    modalVisible: false,
    isPass: 1,
  };
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: flag,
    });
  };
  handleRadioChange = (e) => {
    this.setState({
      isPass: e.target.value,
    });
  };
  handleSubmit = () => {
    const { form } = this.props;
    const { formData, isPass } = this.state;
    form.validateFields();
    const { reason } = form.getFieldsValue();
    this.props.dispatch({
      type: 'supAudit/accountAudit',
      payload: {
        formData,
        id: location.href.split('=').pop(),
        audit_status: isPass,
        remark: reason,
      },
      callback: (success, data) => {
        if (success & (success === true)) {
          message.success(data);
          this.handleModalVisible(false);
          this.props.dispatch(routerRedux.goBack());
        } else {
          message.error(data);
        }
      },
    });
  };
  handleAudit = (formData) => {
    this.handleModalVisible(true);
    this.setState({ formData });
  };
  render() {
    const { operation_records } = this.props.profile || [];
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout title="供应商账号审核">
        <EditableProfile
          buttonText="审核"
          handleSubmit={this.handleAudit}
          type="update"
        />
        <Modal
          visible={this.state.modalVisible}
          onCancel={() => {
            this.handleModalVisible(false);
          }}
          onOk={() => {
            this.handleSubmit();
          }}
          title="审核结果"
        >
          <div style={{ textAlign: 'center' }}>
            <RadioGroup
              onChange={e => this.handleRadioChange(e)}
              defaultValue={1}
            >
              <Radio value={1}>通过</Radio>
              <Radio value={2}>不通过</Radio>
            </RadioGroup>
            {this.state.isPass === 2 ? (
              <Form
                className="login-form"
                layout="inline"
                style={{ marginTop: 15 }}
              >
                <FormItem label="原因">
                  {getFieldDecorator('reason', {
                    rules: [{ required: true, message: '请输入原因!' }],
                  })(<Input placeholder="请输入原因" />)}
                </FormItem>
              </Form>
            ) : null}
          </div>
        </Modal>
        <RecordTable
          dataSource={operation_records ? operation_records.map((item) => {
            return { ...item, key: item.created_time };
          }) : []}
        />
      </PageHeaderLayout>
    );
  }
}

export default AccountCheck;
