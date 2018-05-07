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
@connect(state => ({
  catalog: state.catalog,
  loading: state.loading.models.catalog,
}))
class MenuManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      args: qs.parse(props.location.search, { ignoreQueryPrefix: true }) || [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    console.log('目录参数', this.state.args);
    if (args.cate && Array.isArray(args.cate) && args.cate.length > 0) {
      const lastCatelog = args.cate[args.cate.length - 1];
      dispatch({
        type: 'catalog/fetchLevel',
        pid: lastCatelog.pid,
      });
    } else {
      dispatch({
        type: 'catalog/fetchLevel',
        pid: 0,
      });
    }
  }

  // 当目录被点击
  onCatalogClick = (record) => {

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
    const catalogList = catalog.list;
    console.log('面包屑', cate);

    return (
      <PageHeaderLayout title="产品目录管理">
        <Card title="目录管理" className={styles.card} bordered={false} loading={loading}>
          <DragMenuForm
            data={catalogList}
            addMenu={this.addMenu}
            removeCatalog={this.removeCatalog}
            modifyStatus={this.modifyCatalogStatus}
            modifyInfo={this.modifyCatalog}
            sortCatalog={this.sortCatalogLevel}
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
