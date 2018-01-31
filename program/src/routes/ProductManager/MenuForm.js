import React from 'react';
import moment from 'moment';
import { Table, Button, Input, message, Popconfirm, Divider, Modal, Form, Radio } from 'antd';
import styles from './menu-form.less';

const FormItem = Form.Item;

export default class MenuForm extends React.Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.state = {
      visible: false,
    };
  }

  // 是否展示新增类目Modal
  showModal() {
    this.setState({
      visible: true,
    });
  }

  // 确定添加类目后事件
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  // 取消添加类目后事件
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  // 类目提交
  handleSubmit() {
    console.log('提交信息');
  }

  // remove
  remove() {
    console.log('删除');
  }

  render() {
    const formLayout = 'horizontal';
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    } : null;

    const data = this.props.value; // 表单数据
    const mapStatus = ['禁用', '启用'];
    const mapLevel = ['一级类目', '二级类目', '三级类目'];

    const columns = [{
      title: '类目级别',
      dataIndex: 'level',
      key: 'level',
      render: val => <span>{mapLevel[val]}</span>,
    }, {
      title: '类目名称',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '类目ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: val => <span>{mapStatus[val]}</span>,
    }, {
      title: '已关联数据条数',
      dataIndex: 'relate_num',
      key: 'relate_num',
    }, {
      title: '创建人',
      dataIndex: 'create_man',
      key: 'create_man',
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => {
        return record.level < 2 ?
        (
          <span>
            <a>新增子类</a>
            <Divider type="vertical" />
            <a>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="是否启用？" onConfirm={() => this.remove(record.key)} >
              <a>启用</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a disabled>新增子类</a>
            <Divider type="vertical" />            
            <a>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a>启用</a>
          </span>
        );
      },
    }];

    return (
      <div>
        <Button type="primary" icon="plus" onClick={this.showModal}>新增类目</Button>
        <Modal
          title="新增类目"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit} layout="horizontal">
            <FormItem
              label="一级类目名称"
              {...formItemLayout}
            >
              <Input />
            </FormItem>
            <FormItem
              className="collection-create-form_last-form-item"
              label="状态"
              {...formItemLayout}
            >
              <Radio.Group>
                <Radio value="public">启用</Radio>
                <Radio value="private">禁用</Radio>
              </Radio.Group>
            </FormItem>
          </Form>
        </Modal>
        <Table
          columns={columns}
          dataSource={data}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          icon="plus"
        >
          新增类目
        </Button>
      </div>
    );
  }
}
