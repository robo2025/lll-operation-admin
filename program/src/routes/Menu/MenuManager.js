import React from 'react';
import { connect } from 'dva';
import { Card, Modal, message } from 'antd';
import qs from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FilterContent from '../../components/ModalContent/FilterContent';
import DragMenuForm from './MenuForm';
import { handleServerMsg } from '../../utils/tools';

import styles from './product-manager.less';


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
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    console.log('didMount-目录参数', this.state.args);
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

  // 添加类目
  addMenu = (pid, name, isActive, desc) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/add',
      pid,
      name,
      isActive: isActive + 0,
      desc,
      error: (res) => { message.error(handleServerMsg(res.msg)); },
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
      },
      error: (res) => { message.error(handleServerMsg(res.msg)); },
    });
  }

  // 启用/关闭类目
  modifyCatalogStatus = (id, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/modifyStatus',
      categoryId: id,
      isActive: status,
      error: (res) => { message.error(handleServerMsg(res.msg)); },
    });
  }

  // 修改类目
  modifyCatalog = (categoryId, name, isActive, desc) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/modifyInfo',
      categoryId,
      name,
      isActive,
      desc,
      error: (res) => { message.error(handleServerMsg(res.msg)); },
    });
  }

  // 类目排序
  sortCatalogLevel = (level, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/sortCatalogLevel',
      level,
      data,
      error: (res) => { message.error(handleServerMsg(res.msg)); },
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
  showModal = (record) => {
    this.setState({ visible: true, currCatalog: record });
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { catalog, loading } = this.props;
    const { visible, cate } = this.state;
    console.log('面包屑', cate);

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
          />
        </Card>
        <Modal
          visible={visible}
          width={800}
          confirmLoading={false}
          title="筛选条件项设置"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <FilterContent />
        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default MenuManager;
