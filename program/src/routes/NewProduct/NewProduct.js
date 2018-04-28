/*
 * @Author: lll
 * @Date: 2018-02-01 11:30:59
 * @Last Modified by: lll
 * @Last Modified time: 2018-04-28 14:44:52
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Divider, Modal, Table, message, Checkbox, InputNumber } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NewProductForm from '../../components/Form/NewProductForm';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import AddAttrForm from '../../components/Form//AddAttrForm';
import { handleServerMsgObj } from '../../utils/tools';
import styles from './newproduct.less';


@connect(({ loading, product, catalog, upload, brand }) => ({
  product,
  catalog,
  upload,
  loading,
  brand,
}))
export default class NewProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowAttrMOdal: false,
      fields: {
        pics: [],
        cad_urls: [],
      },
      specs: [], // 用户自定义的其他属性
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
      offset: 0,
      limit: 8,
    });
    // 请求目录列表
    dispatch({
      type: 'catalog/fetchLevel',
    });
    // 请求品牌列表
    dispatch({
      type: 'brand/fetchAll',
      success: (res) => { this.setState({ brands: res.data }); },
    });
    // 获取upload_token
    dispatch({
      type: 'upload/fetch',
    });
  }

  onCancel = () => {
    this.setState({ isShowAttrMOdal: false });
  }

  onOk = () => {
    const { specs } = this.state;
    const len = specs.length - 100;
    this.formObj.validateFields((error, values) => {
      if (error) { // 校验不通过
        console.log('校验出错1', error);
        return false;
      } else { // 校验通过
        // 判断当前参数项是否存在
        const isExist = specs.some(val => parseInt(val.id, 10) === parseInt(values.id, 10));
        if (isExist) {
          const newSpecs = specs.map((val, idx) => {
            if (parseInt(val.id, 10) === parseInt(values.id, 10)) {
              return { ...values, sort: idx };
            }
            return { ...val, sort: idx };
          });
          this.setState({
            isShowAttrMOdal: false, // 隐藏添加属性弹窗    
            specs: { ...newSpecs },
          });
        } else {
          this.setState({
            isShowAttrMOdal: false,
            specs: [
              ...specs,
              {
                id: len - 100,
                spec_name: values.spec_name,
                spec_unit: values.spec_unit,
                is_require: values.is_require >> 0,
                is_search: values.is_search >> 0,
                sort: specs.length + 1,
              },
            ],
          });
        }
      }
      this.formObj.resetFields();// 重置表单
    });
  }

  ShowAttrModal = () => {
    this.setState({ isShowAttrMOdal: true });
  }

  // 当表单被修改事件
  handleFormChange = (changedFields) => {
    const { brands } = this.state;
    if (Object.keys(changedFields)[0] === 'category') {
      const categoryIdsArr = changedFields.category;
      const [category_id_1, category_id_2, category_id_3, category_id_4] = categoryIdsArr;
      this.setState({
        fields: {
          ...this.state.fields,
          category_id_1,
          category_id_2,
          category_id_3,
          category_id_4,
        },
      });
    } else if (changedFields.bno) {
      this.setState({
        fields: {
          ...this.state.fields,
          ...brands.find(val => val.bno === changedFields.bno),
        },
      });
    } else {
      this.setState({
        fields: { ...this.state.fields, ...changedFields },
      });
    }
  }

  /**
   * 当产品其他属性被修改事件[产品概述、详情、FAQ,其他属性，图片]
   * 
   * @param {object} obj json对象，产品属性key=>value
   * 
   */
  handleProductAttr = (obj) => {
    this.setState({
      fields: { ...this.state.fields, ...obj },
    });
  }

  /**
   * 编辑产品参数
   */
  handleEditOtherAttrFiled = (id) => {
    const { specs } = this.state;
    const newOtherAttrsFiled = specs.find((val) => {
      return val.id === id;
    });
    this.setState({
      isShowAttrMOdal: true,
      editSpec: newOtherAttrsFiled, // 将要编辑的项放入state
    });
  }

  /**
   * 修改产品参数某一项
   * @param {string} id 参数ID
   * @param {string} key 参数名
   * @param {string} value 参数值
   */
  handleSpecChange = (id, key, value) => {
    const { specs } = this.state;
    const newSpecs = specs.map((val) => {
      if (parseInt(val.id, 10) === parseInt(id, 10)) {
        const newVal = {
          ...val,
          [key]: value,
        };
        return newVal;
      }
      return val;
    });
    this.setState({ specs: newSpecs });
  }

  /**
   * 删除产品参数
   * @param {string} id 属性id
   */
  handleDeleteOtherAttrFiled(id) {
    const { specs } = this.state;
    const newSpecs = specs.filter((val) => {
      return parseInt(val.id, 10) !== parseInt(id, 10);
    });
    this.setState({
      specs: newSpecs,
    });
  }

  // 当产品列表改变时：分页
  handleProductTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    console.log('产品table改变--：', pagination, filtersArg, sorter);
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      offset: (pagination.current - 1) * (pagination.pageSize),
    };
    dispatch({
      type: 'product/fetch',
      offset: params.offset,
      limit: params.pageSize,
    });
  }

  // 校验表单：传入的是this.props.form对象
  validateForm = (formObj) => {
    // 将子组件的this.props.form传给父组件，方便后面校验
    this.formObj = formObj;
  }

  /**
   * 提交新增产品信息
   * 
   */
  handleSubmitProduct = () => {
    const { fields, specs } = this.state;
    console.log('提交产品信息', { ...fields, specs });
    const { dispatch, history } = this.props;
    dispatch({
      type: 'product/add',
      data: { ...fields, specs },
      success: () => { history.push('/product/list'); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  render() {
    const { editSpec, isShowAttrMOdal, specs } = this.state;
    const { product, loading, catalog, brand, upload, history } = this.props;
    const { total } = product;

    // 其他属性列
    const attrClomns = [{
      title: '序号',
      dataIndex: 'idx',
      key: 'idx',
      render: (text, record, idx) => (<span>{idx + 1}</span>),
    }, {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      render: (text, record, idx) => (
        <InputNumber
          defaultValue={text || idx + 1}
          min={1}
          onChange={(value) => { this.handleSpecChange(record.id, 'sort', value); }
          }
        />
      ),
    }, {
      title: '参数项',
      dataIndex: 'spec_name',
      key: 'spec_name',
      render: (text, record) => (<span>{text}{record.spec_unit ? `(${record.spec_unit})` : ''}</span>),
    }, {
      title: '是否必填',
      dataIndex: 'is_require',
      key: 'is_require',
      render: (text, record) => (
        <Checkbox
          defaultChecked={text}
          onChange={(e) => { this.handleSpecChange(record.id, 'is_require', e.target.checked >> 0); }}          
        />
      ),
    }, {
      title: '是否为筛选条件',
      dataIndex: 'is_search',
      key: 'is_search',
      render: (text, record) => (
        <Checkbox
          defaultChecked={text}
          onChange={(e) => { this.handleSpecChange(record.id, 'is_search', e.target.checked >> 0); }}          
        />
      ),
    }, {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => { this.handleEditOtherAttrFiled(record.id); }}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => { this.handleDeleteOtherAttrFiled(record.id); }}>删除</a>
        </Fragment>
      ),
    }];

    return (
      <PageHeaderLayout title="新建产品信息">
        <Card bordered={false} loading={loading.models.catalog} className={styles['new-product-wrap']}>
          {/* 添加其它属性Modal */}
          <Modal
            width="650px"
            visible={isShowAttrMOdal}
            title="新建参数项"
            onCancel={this.onCancel}
            onOk={this.onOk}
          >
            <AddAttrForm
              defaultValue={editSpec}
              handleValidate={this.validateForm}
            />
          </Modal>
          <SectionHeader
            title="产品基础信息"
          />
          <NewProductForm
            data={this.state.fields}
            brands={brand.all}
            onChange={this.handleFormChange}
            catalog={catalog.level}
            loading={loading}
            onAttrChange={this.handleProductAttr}
            uploadToken={upload.upload_token}
          />
          {/* 产品规格参数项 */}
          <SectionHeader
            title="产品规格参数项"
            extra={<Button style={{ marginLeft: 20 }} icon="plus" onClick={this.ShowAttrModal}>新建参数项</Button>}
          />
          <div style={{ width: 1000, maxWidth: '70%' }}>
            <Table
              className="attr-table"
              bordered
              pagination={false}
              columns={attrClomns}
              dataSource={specs}
              rowKey="id"
              locale={{
                emptyText: '请点击上面按钮添加新属性',
              }}
            />
          </div>
          <div className={styles['submit-btn-wrap']}>
            <Button onClick={() => { history.goBack(); }}>取消</Button>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
