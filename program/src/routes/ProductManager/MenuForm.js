import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Table, Button, Input, Popconfirm, Divider, Modal, Form, Radio, Breadcrumb } from 'antd';
import styles from './menu-manager.less';

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

  let className = restProps.className;
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
// -------------------------------------

function getStanrdCatalog(data) {
  data.forEach((val) => {
    // const newChildren = _.cloneDeep(val.children);
    // val.lyChildren = newChildren;
    // if (val.children && val.children.length >= 0) {
    //   getStanrdCatalog(val.children);
    // }
    const test = _.transform(val, (result, value, key) => {
      if (key === 'children') {
        result.lyChildren = value;
      } else {
        result[key] = value;
      }
    }, {});
    val.lyChildren = test.lyChildren;
    delete val.children;
    if (val.children || val.lyChildren) {
      getStanrdCatalog(val.children || val.lyChildren);
    }
  });
}

class MenuForm extends React.Component {
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
      breadData: [{ level: 0, id: 0, category_name: '根目录:' }],
      currCatalogData: getStanrdCatalog(this.props.data),
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
      render: (text, record) => (<a onClick={() => { this.handleCatelogItemClick(record); }}>{text}</a>),
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


  componentDidMount() {
    this.setState({ currCatalogData: this.props.data });
  }


  // 类目点击
  handleCatelogItemClick = (record) => {
    console.log('当前点击record', record, record.lyChildren);
    if (record.id === 0) {
      this.setState({ currCatalogData: this.props.data });
    } else {
      this.setState({ currCatalogData: record.lyChildren });
    }
    const { breadData } = this.state;
    const recordLevel = record.level; // 目录的层级
    breadData[recordLevel] = record;
    for (let i = recordLevel + 1; i < breadData.length; i++) {
      breadData[i] = null;
    }
    this.setState({ breadData });
    // const lastBreadDataLevel = breadData[breadData.length - 1].level;
    // if (record.level === lastBreadDataLevel) {
    //   breadData.pop();
    //   const newBreadData = [
    //     ...breadData,
    //     record,
    //   ];
    //   this.setState({ breadData: newBreadData });
    // } else if (record.level > lastBreadDataLevel) {
    //   const newBreadData = [
    //     ...breadData,
    //     record,
    //   ];
    //   this.setState({ breadData: newBreadData });
    // }
  }

  // 面包屑被点击
  handleBreadClick = (record) => {

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

  components = {
    body: {
      row: BodyRow,
    },
  }

  moveRow = (dragIndex, hoverIndex) => {
    alert(dragIndex + ',' + hoverIndex);
    const data = this.state.currCatalogData;
    const dragRow = data[dragIndex];

    this.setState(
      update(this.state, {
        currCatalogData: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
    );
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

    // const dataTemp = JSON.stringify(data);
    // const data2 = JSON.parse(dataTemp);
    // data2.forEach((val) => {
    //   delete val.children;
    // });

    console.log('当前类目:', this.state);

    return (
      <div className={styles['catelog-wrap']}>
        <Button type="primary" icon="plus" onClick={() => { this.showModal('visible'); }} style={{ marginBottom: 15 }}>新增一级类目</Button>
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

        <Breadcrumb>
          {this.state.breadData.map((val, idx) => {
            return val ?
              (
                <Breadcrumb.Item
                  key={idx}
                >
                  <a onClick={() => { this.handleCatelogItemClick(val); }}>{val.category_name}</a>
                </Breadcrumb.Item>
              ) : null;
          })
          }
        </Breadcrumb>
        <Table
          columns={this.columns}
          dataSource={this.state.currCatalogData}
          components={this.components}
          rowKey={record => (record.id)}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
        />
      </div>
    );
  }
}

const DradMenuForm = DragDropContext(HTML5Backend)(MenuForm);
export default DradMenuForm;
