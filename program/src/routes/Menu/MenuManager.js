import React from 'react';
import { connect } from 'dva';
import { Card, Modal, message } from 'antd';
import qs from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FilterContent from '../../components/ModalContent/FilterContent';
import EditCatalogContent from './EditCatalogContent';
import AddCatalogContent from './AddCatalogContent';
import DragMenuForm from './MenuForm';
import { handleServerMsgObj } from '../../utils/tools';

import styles from './product-manager.less';

const modalData = {
  edit: {
    width: 500,
    title: '编辑类目',
    component: EditCatalogContent,
  },
  filter: {
    width: 800,
    title: '筛选项设置',
    component: FilterContent,
  },
  add: {
    width: 500,
    title: '筛选项设置',
    component: AddCatalogContent,
  },
};

// 产品目录管理
@connect(({ catalog, loading }) => ({
  catalog,
  loading,
}))
class MenuManager extends React.Component {
  constructor(props) {
    super(props);
    const searchVal = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    this.state = {
      visible: false,
      cate: searchVal.bread ? searchVal.bread : [{ id: 0, pid: 0, category_name: '根目录' }],
      args: searchVal,
      modalKey: 'filter',
      currentCatalog: {},
    };
  }

  componentDidMount() {
    this.dispatchDefaultCatalogList();
  }

  // 默认更新数据
  dispatchDefaultCatalogList = () => {
    const { dispatch } = this.props;
    const { args } = this.state;
    if (args.bread && Array.isArray(args.bread) && args.bread.length > 0) {
      const lastCatelog = args.bread[args.bread.length - 1];
      dispatch({
        type: 'catalog/fetch',
        pid: lastCatelog.id,
      });
    } else {
      dispatch({
        type: 'catalog/fetch',
        pid: 0,
      });
    }
  }

  // 根据目录pid请求目录列表
  dispatchCatalogList = (pid) => {
    const { history } = this.props;
    const { cate } = this.state;
    this.props.dispatch({
      type: 'catalog/fetch',
      pid,
      success: () => {
        const breadCataArr = cate.map(val => ({ id: val.id, category_name: val.category_name }));
        history.push(`?${qs.stringify({ bread: breadCataArr })}`);
      },
    });
  }

  // 根据目录ID获取参数列表
  dispatchCatalogSpecs = (categoryId) => {
    this.props.dispatch({
      type: 'catalog/fetchSpecs',
      categoryId,
    });
  }

  // 修改类目操作
  dispatchModifyCatalog = (data) => {
    const { dispatch } = this.props;
    const { currentCatalog } = this.state;
    dispatch({
      type: 'catalog/modifyInfo',
      categoryId: currentCatalog.id,
      data,
      success: () => {
        message.success('修改成功');
        this.setState({
          visible: false,
        });
        this.dispatchDefaultCatalogList();
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 添加类目
  dispatchAddCatalog = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/add',
      data,
      success: () => {
        this.setState({
          visible: false,
        });
        this.dispatchDefaultCatalogList();
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 删除类目
  removeCatalog = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/removeOne',
      categoryId: id,
      success: (res) => {
        message.success(res.msg);
        this.dispatchDefaultCatalogList();
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 启用/关闭类目
  modifyCatalogStatus = (id, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/modifyStatus',
      categoryId: id,
      isActive: status,
      success: () => {
        this.dispatchDefaultCatalogList();
      },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 类目排序
  sortCatalogLevel = (level, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/sortCatalogLevel',
      level,
      data,
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  // 当目录被点击
  handleCatalogClick = (record) => {
    const { cate } = this.state;
    if (Array.isArray(cate) & cate.length <= 0) {
      cate.push(record);
    } else {
      const lastCatelog = cate[cate.length - 1];
      if (lastCatelog.level === record.level) {
        cate[cate.length - 1] = record;
      } else {
        cate.push(record);
      }
    }
    this.setState({ cate }, () => {
      this.dispatchCatalogList(record.id);
    });
  }

  // 当面包屑被点击
  handleBreadClick = (record, idx) => {
    const { cate } = this.state;
    this.setState({
      cate: cate.slice(0, idx + 1),
    }, () => {
      this.dispatchCatalogList(record.id);
    });
  }

  // 是否展示Modal
  showModal = (record, key) => {
    this.setState({
      visible: true,
      modalKey: key,
      currentCatalog: record,
    });
    if (key === 'filter') { // 获取参数列表
      this.dispatchCatalogSpecs(record.id);
    }
  }

  handleOk = () => {
    const { modalKey } = this.state;
    this.$formObj.validateFields((err, values) => {
      if (err) {
        console.log('校验出错', err);
        return false;
      }
      if (modalKey === 'edit') { // 编辑类目
        this.dispatchModifyCatalog(values);
      } else if (modalKey === 'filter') { // 筛选项设置
        alert('筛选设置');
      } else if (modalKey === 'add') { // 添加类目
        const { cate } = this.state;
        const lastCatelog = cate[cate.length - 1];
        this.dispatchAddCatalog({ pid: lastCatelog.id, ...values });
      }
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 将子组件form对象传过来
  bindForm = (formObj) => {
    this.$formObj = formObj;
  }

  render() {
    const { catalog, loading } = this.props;
    const { visible, cate, modalKey, currentCatalog } = this.state;
    const ModalContent = modalData[modalKey].component;

    return (
      <PageHeaderLayout title="产品目录管理">
        <Card title="目录管理" className={styles.card} bordered={false}>
          <DragMenuForm
            loading={loading.models.catalog}
            data={catalog.list}
            breadData={cate}
            addMenu={this.addMenu}
            removeCatalog={this.removeCatalog}
            modifyStatus={this.modifyCatalogStatus}
            modifyInfo={this.modifyCatalog}
            sortCatalog={this.sortCatalogLevel}
            onCatalogClick={this.handleCatalogClick}
            onBreadClick={this.handleBreadClick}
            onFilterClick={this.showModal}
            onActionClick={this.showModal}
          />
        </Card>
        <Modal
          visible={visible}
          width={modalData[modalKey].width}
          confirmLoading={false}
          title={modalData[modalKey].title}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ModalContent
            data={currentCatalog}
            specsData={catalog.specs}
            total={catalog.total}
            bindForm={this.bindForm}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default MenuManager;
