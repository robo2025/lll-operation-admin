import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Table, Input, Popconfirm, Divider, Modal, Form, Radio, Breadcrumb, Button } from 'antd';
import styles from './menu-manager.less';

const FormItem = Form.Item;
const mapStatus = ['禁用', '启用'];
const mapLevel = ['一级类目', '二级类目', '三级类目', '四级类目'];
const { confirm } = Modal;

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);


// -------------------------------------
function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

let BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };

  let { className } = restProps;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(
    connectDropTarget(
      <tr
        {...restProps}
        className={className}
        style={style}
      />
    )
  );
};

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

class MenuForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currCatalog: {}, // 当前要被新增的类目
      isShowAddChildModal: false,
      isShowModifyModal: false,
      catalogName: {},
      isActive: { value: true },
      isSort: false,
    };
    this.columns = [{
      title: '类目级别',
      dataIndex: 'level',
      key: 'level',
      render: text => (<span>{mapLevel[text - 1]}</span>),
    }, {
      title: '类目名称',
      dataIndex: 'category_name',
      key: 'category_name',
      render: (text, record) => (
        <a onClick={() => { this.handleCatelogItemClick(record); }}>{text}</a>
      ),
    }, {
      title: '类目ID',
      dataIndex: 'cno',
      key: 'cno',
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
      dataIndex: 'creator_id',
      key: 'creator_id',
      render: (text, record) => (<span>{`${record.creator}(${text})`}</span>),
    }, {
      title: '创建时间',
      dataIndex: 'created_time',
      key: 'created_time',
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    }, {
      title: '操作',
      dataIndex: '',
      key: 'x',
      render: (text, record) => {
        return record.level < 3 ?
          (
            <span>
              {/* <a onClick={() => { this.showModal('isShowAddChildModal', record); }}>新增子类</a> */}
              {/* <Divider type="vertical" /> */}
              <a onClick={() => { this.props.onActionClick(record, 'edit'); }}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                <a disabled={record.product_count > 0}>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              {
                record.is_active === 0 ?
                  <a onClick={() => this.changeCatalogStatus(record.id, 1)}>启用</a>
                  :
                  <a onClick={() => this.changeCatalogStatus(record.id, 0)} style={{ color: '#E21918' }}>禁用</a>
              }
            </span>
          ) : (
            <span>
              {/* <a disabled>新增子类</a> */}
              {/* <Divider type="vertical" /> */}
              <a onClick={() => { this.props.onActionClick(record, 'edit'); }}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                <a disabled={record.product_count > 0}>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              {
                record.is_active === 0 ?
                  <a onClick={() => this.changeCatalogStatus(record.id, 1)}>启用</a>
                  :
                  <a onClick={() => this.changeCatalogStatus(record.id, 0)} style={{ color: '#E21918' }}>禁用</a>
              }
              <Divider type="vertical" />
              <a onClick={() => { this.props.onActionClick(record, 'filter'); }}>筛选项设置</a>
            </span>
          );
      },
    }];
  }

  onFilterClick = (record) => {
    this.props.onFilterClick(record);
  }

  // 类目点击
  handleCatelogItemClick = (record) => {
    this.props.onCatalogClick(record);
  }

  // 是否取消排序
  showSortConfirm = () => {
    const that = this;
    confirm({
      title: '温馨提示',
      content: '您当前还有排序没有保存，是否取消排序？',
      cancelText: '取消当前排序',
      okText: '继续排序',
      onOk() {
        // this.setState({ isSort: false });
        console.log('继续排序');
      },
      onCancel() {
        that.setState({ isSort: false });
      },
    });
  }

  // 是否展示Modal，key:state对应的key
  showModal = (key, record) => {
    const tempJson = {};
    tempJson[key] = true;
    this.setState({ ...tempJson, currCatalog: record });
    console.log(record);
  }

  // 是否隐藏Modal,key:state对应的key
  hideModal = (key) => {
    const tempJson = {};
    tempJson[key] = false;
    this.setState(tempJson);
  }

  // Modal事件：点击确定后关闭
  handleOk = (key) => {
    const { addMenu, modifyInfo } = this.props;
    if (key === 'visible') { // 添加目录
      const { catalogName, isActive, breadData } = this.state;
      if (!catalogName || !catalogName.value) { // 如果类目名称为空
        alert('请完善类目名称');
      } else { // 类目名称不为空
        // addMenu(0, catalogName.value, isActive.value + 0, '');
        const validBreadData = _.compact(breadData);
        console.log('当前新建目录ID', validBreadData[validBreadData.length - 1].id);
        addMenu(validBreadData[validBreadData.length - 1].id, catalogName.value, isActive.value + 0, '');
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
  handleSubmit = () => {
    console.log('提交信息');
  }

  // 删除类目
  remove(id) {
    const { removeCatalog } = this.props;
    removeCatalog(id);
  }

  // 修改类目状态
  changeCatalogStatus(id, status) {
    const { modifyStatus } = this.props;
    modifyStatus(id, status);
  }

  /**
   * 自定义表单校验
   * @param {string} name 行id
   * @param {string} value 行内容值
   * @param {string} message 出错时提示信息
   * */
  customValidate = (name, value, message) => {
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

  components = {
    body: {
      row: BodyRow,
    },
  }

  // 移动行
  moveRow = (dragIndex, hoverIndex) => {
    const { data, onMoveRow } = this.props;
    onMoveRow(dragIndex, hoverIndex);
    this.setState({ isSort: true });
  }

  // 取消排序
  handleCancelSort = () => {
    this.setState({ isSort: false });
  }

  // 确定排序
  handleSubmitSort = () => {
    const { data } = this.props;
    const { pid, level } = data[0] ? data[0] : [{ pid: -1, level: -1 }];
    const sortResult = data.map((val, idx) => (
      {
        sort: idx,
        id: val.id,
      }
    ));
    if (pid >= 0) {
      // 提交排序结果
      this.setState({ isSort: false });
      this.props.sortCatalog(level, sortResult);
    } else {
      Modal.error({
        title: '错误',
        content: '当前无排序结果',
      });
    }
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

    const { data, breadData, loading, onFilterClick, onActionClick } = this.props; // 表单数据
    const { catalogName, currCatalog, isSort } = this.state;

    const breadDataLength = breadData.length;// 当前面包屑有效数据长度

    return (
      <div className={styles['catelog-wrap']}>
        <Button
          type="primary"
          icon="plus"
          disabled={breadDataLength > 4}
          onClick={() => { onActionClick(data, 'add'); }}
          style={{ marginBottom: 15 }}
        >
          新增类目
        </Button>
        {/* 新建类目弹窗 */}
        <Modal
          title="新增类目"
          visible={this.state.visible}
          onOk={() => { this.handleOk('visible'); }}
          onCancel={() => { this.handleCancel('visible'); }}
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
        <Breadcrumb
          separator=">"
        >
          {breadData.map((val, idx) => {
            return val ?
              (
                <Breadcrumb.Item
                  key={val.id}
                >
                  <a onClick={() => { this.props.onBreadClick(val, idx); }}>{val.category_name}</a>
                </Breadcrumb.Item>
              ) : null;
          })
          }
        </Breadcrumb>
        <Table
          loading={loading}
          pagination={false}
          childrenColumnName="lyChildren"
          columns={this.columns}
          dataSource={data}
          components={this.components}
          rowKey={record => (record.id)}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
        />
        <div
          style={{ marginTop: 30, marginBottom: 30, display: 'flex', justifyContent: 'flex-end' }}
          className={isSort ? 'show' : 'hidden'}
        >
          <Button style={{ marginRight: 20 }} onClick={this.handleCancelSort}>取消排序</Button>
          <Button type="primary" onClick={this.handleSubmitSort}>保存排序</Button>
        </div>
      </div>
    );
  }
}

const DragMenuForm = DragDropContext(HTML5Backend)(MenuForm);
export default DragMenuForm;
