import React from 'react';
import moment from 'moment';
import { Table, Button, Input, Popconfirm, Divider, Modal, Form, Radio } from 'antd';

const FormItem = Form.Item;
const mapStatus = ['禁用', '启用'];
const mapLevel = ['一级类目', '二级类目', '三级类目', '四级类目'];

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

export default class MenuForm extends React.Component {
  constructor(props) {
    super(props);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.customValidate = this.customValidate.bind(this);
    this.state = {
      visible: false,
      currCatalog: {}, // 当前要被新增的类目
      isShowAddChildModal: false,
      isShowModifyModal: false,
      catalogName: {},
      isActive: { value: true },
    };
    this.columns = [{
      title: '类目级别',
      dataIndex: 'level',
      key: 'level',
      render: (text, record) => (<span>{mapLevel[text - 1]}</span>),
    }, {
      title: '类目名称',
      dataIndex: 'category_name',
      key: 'category_name',
    }, {
      title: '类目ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: val => <span>{mapStatus[val]}</span>,
    }, {
      title: '已关联数据条数',
      dataIndex: 'product_count',
      key: 'product_count',
    }, {
      title: '创建人',
      dataIndex: 'staff_id',
      key: 'staff_id',
    }, {
      title: '创建时间',
      dataIndex: 'created_time',
      key: 'created_time',
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => {
        return record.level < 4 ?
          (
            <span>
              <a onClick={() => { this.showModal('isShowAddChildModal', record); }}>新增子类</a>
              <Divider type="vertical" />
              <a onClick={() => { this.showModal('isShowModifyModal', record); }}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              {
                record.is_active === 0 ?
                  <a onClick={() => this.changeCatalogStatus(record.id, 1)}>启用</a>
                  :
                  <a onClick={() => this.changeCatalogStatus(record.id, 0)}>禁用</a>
              }

            </span>
          ) : (
            <span>
              <a disabled>新增子类</a>
              <Divider type="vertical" />
              <a onClick={() => { this.showModal('isShowModifyModal', record); }}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              {
                record.is_active === 0 ?
                  <a onClick={() => this.changeCatalogStatus(record.id, 1)}>启用</a>
                  :
                  <a onClick={() => this.changeCatalogStatus(record.id, 0)}>禁用</a>
              }
            </span>
          );
      },
    }];
  }

  // 是否展示Modal，key:state对应的key
  showModal(key, record) {
    const tempJson = {};
    tempJson[key] = true;
    this.setState({ ...tempJson, currCatalog: record });
    console.log(record);
  }
  // 是否隐藏Modal,key:state对应的key
  hideModal(key) {
    const tempJson = {};
    tempJson[key] = false;
    this.setState(tempJson);
  }

  // Modal事件：点击确定后关闭
  handleOk = (key) => {
    const { addMenu, modifyInfo } = this.props;
    if (key === 'visible') { // 添加以及目录
      const { catalogName, isActive } = this.state;
      if (!catalogName || !catalogName.value) { // 如果类目名称为空
        alert('请完善类目名称');
      } else { // 类目名称不为空
        addMenu(0, catalogName.value, isActive.value + 0, '');
        this.hideModal(key);
      }
    } else if (key === 'isShowAddChildModal') { // 添加子级目录
      const { catalogName, isActive, currCatalog } = this.state;
      if (!catalogName || !catalogName.value) { // 如果类目名称为空
        alert('请完善类目名称');
      } else { // 类目名称不为空
        addMenu(currCatalog.id, catalogName.value, isActive.value + 0, '');
        this.hideModal(key);
      }
    } else if (key === 'isShowModifyModal') {
      const { catalogName, isActive, currCatalog } = this.state;
      if (!catalogName || !catalogName.value) { // 如果类目名称为空
        alert('请完善类目名称');
      } else { // 类目名称不为空
        modifyInfo(currCatalog.id, catalogName.value, isActive.value + 0, '');
        this.hideModal(key);
      }
    }
  }

  // Modal事件：点击取消后关闭
  handleCancel = (key) => {
    this.hideModal(key);
  }


  // 类目提交
  handleSubmit() {
    console.log('提交信息');
  }

  // 删除类目
  remove(id) {
    const { removeCatalog } = this.props;
    removeCatalog(id);
  }

  // 修改类目状态
  changeCatalogStatus(id, status) {
    console.log('修改类目状态', id, status);
    const { modifyStatus } = this.props;
    modifyStatus(id, status);
  }

  /**
   * 自定义表单校验
   * @param {string} name 行id
   * @param {string} value 行内容值
   * @param {string} message 出错时提示信息
   * */
  customValidate(name, value, message) {
    const tempJson = {};
    tempJson[name] = {
      value,
      message,
    };
    if (value.length <= 0) {
      tempJson[name].validateStatus = 'error';
      tempJson[name].help = message;
    } else {
      tempJson[name].validateStatus = '';
    }
    this.setState({ ...tempJson });
    // console.log('校验', this.state);
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }


  render() {
    const formLayout = 'horizontal';
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    } : null;

    const { data } = this.props; // 表单数据
    const { catalogName, currCatalog } = this.state;

    return (
      <div>
        <Button type="primary" icon="plus" onClick={() => { this.showModal('visible'); }}>新增一级类目</Button>
        {/* 新建类目弹窗 */}
        <Modal
          title="新增类目"
          visible={this.state.visible}
          onOk={() => { this.handleOk('visible'); }}
          onCancel={() => { this.handleCancel('visible'); }}
        >
          <Form onSubmit={this.handleSubmit} layout="horizontal">
            <FormItem
              label="一级类目名称"
              {...formItemLayout}
              required
              validateStatus={catalogName.validateStatus}
              help={catalogName.help}
            >
              <Input onChange={(e) => { this.customValidate('catalogName', e.target.value, '类目名称不能为空'); }} />
            </FormItem>
            <FormItem
              className="collection-create-form_last-form-item"
              label="状态"
              {...formItemLayout}
            >
              <Radio.Group onChange={(e) => { this.customValidate('isActive', e.target.value === 'on', ''); }} defaultValue="on">
                <Radio value="on">启用</Radio>
                <Radio value="off">禁用</Radio>
              </Radio.Group>
            </FormItem>
          </Form>
        </Modal>
        {/* 添加子类目 */}
        <Modal
          title="新建子类目"
          visible={this.state.isShowAddChildModal}
          onOk={() => { this.handleOk('isShowAddChildModal'); }}
          onCancel={() => { this.handleCancel('isShowAddChildModal'); }}
        >
          <Form onSubmit={this.handleSubmit} layout="horizontal">
            <FormItem
              label="上级类目名称"
              {...formItemLayout}
            >
              <span>{currCatalog ? currCatalog.category_name : ''}</span>
            </FormItem>
            <FormItem
              label="子类目名称"
              {...formItemLayout}
              required
              validateStatus={catalogName.validateStatus}
              help={catalogName.help}
            >
              <Input onChange={(e) => { this.customValidate('catalogName', e.target.value, '类目名称不能为空'); }} />
            </FormItem>
            <FormItem
              className="collection-create-form_last-form-item"
              label="状态"
              {...formItemLayout}
            >
              <Radio.Group onChange={(e) => { this.customValidate('isActive', e.target.value === 'on', ''); }} defaultValue="on">
                <Radio value="on">启用</Radio>
                <Radio value="off">禁用</Radio>
              </Radio.Group>
            </FormItem>
          </Form>
        </Modal>
        {/* 修改类目弹窗 */}
        <Modal
          title="修改类目"
          visible={this.state.isShowModifyModal}
          onOk={() => { this.handleOk('isShowModifyModal'); }}
          onCancel={() => { this.handleCancel('isShowModifyModal'); }}
        >
          <Form onSubmit={this.handleSubmit} layout="horizontal">
            <FormItem
              label="类目名称"
              {...formItemLayout}
              required
              validateStatus={catalogName.validateStatus}
              help={catalogName.help}
            >
              <Input onChange={(e) => { this.customValidate('catalogName', e.target.value, '类目名称不能为空'); }} />
            </FormItem>
            <FormItem
              className="collection-create-form_last-form-item"
              label="状态"
              {...formItemLayout}
            >
              <Radio.Group onChange={(e) => { this.customValidate('isActive', e.target.value === 'on', ''); }} defaultValue="on">
                <Radio value="on">启用</Radio>
                <Radio value="off">禁用</Radio>
              </Radio.Group>
            </FormItem>
          </Form>
        </Modal>
        <Table
          defaultExpandAllRows
          columns={this.columns}
          dataSource={data}
          rowKey={record => (record.id)}
        />
      </div>
    );
  }
}
