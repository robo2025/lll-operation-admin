import React from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Icon, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

@connect(({ sysAccount }) => ({
  positionList: sysAccount.positionList,
}))
@Form.create({
  mapPropsToFields(props) {
    const { positionList } = props;
  },
})
class Positions extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'sysAccount/fetchPositions',
    });
  }
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    console.log(keys);
    const nextKeys = keys.length === 0 ? [0] : keys.concat(keys[keys.length - 1] + 1);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem {...formItemLayoutWithOutLabel} required={false} key={k}>
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入职位名称或删除此行',
              },
            ],
          })(
            <Input
              placeholder="职位名称"
              style={{ width: '60%', marginRight: 8 }}
            />
          )}
          <Icon
            className="dynamic-plus-button"
            type="plus-circle-o"
            style={{ fontSize: 16 }}
            onClick={() => this.add(k)}
          />
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            style={{ fontSize: 16, marginLeft: 8, color: 'red' }}
            onClick={() => this.remove(k)}
          />
          
        </FormItem>
      );
    });
    return (
      <PageHeaderLayout title="职位管理">
        <Card>
          <Form onSubmit={this.handleSubmit}>
            {formItems}
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> 添加
              </Button>
            </FormItem>
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Positions;
