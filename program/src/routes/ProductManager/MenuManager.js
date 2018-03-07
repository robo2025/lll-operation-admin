import React from 'react';
import { connect } from 'dva';
import { Card, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DragMenuForm from './MenuForm';


import styles from './product-manager.less';


// 产品目录管理
@connect(state => ({
  catalog: state.catalog,
  loading: state.loading.models.catalog,
}))
class MenuManager extends React.Component {
  constructor(props) {
    super(props);
    this.addMenu = this.addMenu.bind(this);
    this.removeCatalog = this.removeCatalog.bind(this);
    this.modifyCatalogStatus = this.modifyCatalogStatus.bind(this);
    this.modifyCatalog = this.modifyCatalog.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/fetch',
    });
  }

  // 添加类目
  addMenu(pid, name, isActive, desc) {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/add',
      pid,
      name,
      isActive: isActive + 0,
      desc,
      error: (res) => { message.error(res.split(':')[1]); },            
    });
  }

  // 删除类目
  removeCatalog(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/removeOne',
      categoryId: id,
      success: (res) => {
        message.success(res.msg);
      },
      error: (res) => { message.error(res.split(':')[1]); },      
    });
  }

  // 启用/关闭类目
  modifyCatalogStatus(id, status) {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/modifyStatus',
      categoryId: id,
      isActive: status,
      error: (res) => { message.error(res.split(':')[1]); },      
    });
  }

  // 修改类目
  modifyCatalog(categoryId, name, isActive, desc) {
    const { dispatch } = this.props;
    dispatch({
      type: 'catalog/modifyInfo',
      categoryId,
      name,
      isActive,
      desc,
      error: (res) => { message.error(res.split(':')[1]); },      
    });
  }

  render() {
    const { catalog, loading } = this.props;
    const catalogList = catalog.list;
    return (
      <PageHeaderLayout title="产品目录管理">
        <Card title="目录管理" className={styles.card} bordered={false} loading={loading}>
          <DragMenuForm
            data={catalogList}
            addMenu={this.addMenu}
            removeCatalog={this.removeCatalog}
            modifyStatus={this.modifyCatalogStatus}
            modifyInfo={this.modifyCatalog}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}


export default MenuManager;
