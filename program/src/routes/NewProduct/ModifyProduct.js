/*
 * @Author: lll
 * @Date: 2018-02-01 11:30:59
 * @Last Modified by: lll
 * @Last Modified time: 2018-05-22 14:41:16
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Button, Checkbox, Modal, Table, InputNumber, Divider, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModifyProductForm from '../../components/Form/ModifyProductForm';
import SectionHeader from '../../components/PageHeader/SectionHeader';
import AddAttrForm from '../../components/Form//AddAttrForm';
import { queryString, checkFile, handleServerMsgObj } from '../../utils/tools';
import { ACTION_FLAG } from '../../constant/statusList';
import styles from './modify-product.less';

const FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的文件类型
// 操作记录列
const actionColumns = [{
  title: '操作类型',
  dataIndex: 'action_flag',
  key: 'action_flag',
  render: val => <span>{ACTION_FLAG[val]}</span>,
}, {
  title: '说明',
  dataIndex: 'change_message',
  key: 'change_message',
}, {
  title: '操作员',
  dataIndex: 'creator',
  key: 'creator',
  render: (text, record) => (<span>{`${text}(${record.creator_id})`}</span>),
}, {
  title: '操作时间',
  dataIndex: 'created_time',
  key: 'created_time',
  render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
}];

// 修改产品信息
@connect(({ loading, product, logs, catalog, upload }) => ({
  product,
  catalog,
  logs,
  upload,
  loading,
}))
export default class ModifyProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowAttrMOdal: false,
      args: queryString.parse(window.location.href),
      fields: { pdf_url: [] },
      specs: [], // 用户自定义的其他属性
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { args } = this.state;
    // 请求产品列表
    dispatch({
      type: 'product/fetch',
    });
    // 请求产品详情
    dispatch({
      type: 'product/fetchDetail',
      pno: args.pno,
      success: (detail) => {
        this.setState({
          fields: {
            ...detail,
            bno: detail.brand.bno,
            category_id_1: detail.category.id, // 一级目录
            category_id_2: detail.category.children.id, // 二级目录
            category_id_3: detail.category.children.children.id, // 三级目录
            category_id_4: detail.category.children.children.children.id, // 四级目录
          },
          specs: detail.specs,
        });
      },
    });
    // 请求目录列表
    dispatch({
      type: 'catalog/fetchLevel',
    });
    // 获取upload_token
    dispatch({
      type: 'upload/fetch',
    });
    // 获取产品操作日志
    dispatch({
      type: 'logs/fetch',
      module: 'product',
      objectId: args.pno,
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
            specs: newSpecs,
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

  // 校验表单：传入的是this.props.form对象
  validateForm = (formObj) => {
    // 将子组件的this.props.form传给父组件，方便后面校验
    this.formObj = formObj;
  }

  ShowAttrModal = () => {
    this.setState({ isShowAttrMOdal: true, editSpec: {} });
  }

  /**
   * 编辑产品参数
   */
  handleEditOtherAttrFiled = (id) => {
    if (this.formObj) {
      this.formObj.resetFields();// 重置表单    
    }
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
 * 当产品其他属性被修改事件[产品概述、详情、FAQ,其他属性，图片]
 * 
 * @param {object} obj json对象，产品属性key=>value
 * 
 */
  handleProductAttr = (obj) => {
    const { fields } = this.state;
    if (obj.selectedCatalog) {
      this.setState({
        fields: {
          ...fields,
          category_id_1: obj.selectedCatalog[0], // 一级目录
          category_id_2: obj.selectedCatalog[1], // 二级目录
          category_id_3: obj.selectedCatalog[2], // 三级目录
          category_id_4: obj.selectedCatalog[3], // 四级目录
        },
      });
      return;
    }
    this.setState({
      fields: { ...this.state.fields, ...obj },
    });
    console.log('产品信息', { ...this.state.fields, ...obj });
  }

  // 当表单输入框被修改事件
  handleFormChange = (changedFields) => {
    const { fields } = this.state;
    if (changedFields.selectedCatalog) {
      this.setState({
        fields: {
          ...fields,
          category_id_1: changedFields.selectedCatalog[0], // 一级目录
          category_id_2: changedFields.selectedCatalog[1], // 二级目录
          category_id_3: changedFields.selectedCatalog[2], // 三级目录
          category_id_4: changedFields.selectedCatalog[3], // 四级目录
        },
      });
      return;
    }
    this.setState({
      fields: { ...fields, ...changedFields },
    });
  }

  /**
   * 添加产品其他属性项目
   * 
   * @param {string} key 属性key
   * @param {string} value 属性value
   * 
   */
  handleAddOtherAttrFiled = (fileds) => {
    const { newFiled } = this.state;
    this.setState({
      newFiled: { ...newFiled, ...fileds },
    });
  }


  /**
  * 添加产品其他属性内容
  * 
  * @param {string} id 其他属性的唯一id
  * @param {object} obj 其他属性的内容，如{attr_name:'形状'}
  * 
  */
  handleAddProductOtherAttr = (id, obj) => {
    const { otherAttrs } = this.state;
    let isExist = false;
    const newOtherAttrs = otherAttrs.map((val) => {
      if (val.id === id) {
        isExist = true;
        const newVal = { ...val, ...obj };
        return newVal;
      } else {
        return val;
      }
    });
    if (!isExist) {
      console.log('不存在', id, otherAttrs);
      this.setState({ otherAttrs: [...otherAttrs, { id, ...obj }] });
    } else {
      this.setState({ otherAttrs: newOtherAttrs });
      console.log('存在', id, newOtherAttrs);
    }
  }

  // 一键清除数据
  handleClearData = () => {
    const { fields } = this.state;
    this.setState({
      fields: {
        ...fields,
        category: '',
        product_name: '',
        partnumber: '',
        brand_name: '',
        english_name: '',
        prodution_place: '',
      },
    });
  }

  // 其他属性图片上传前处理：验证文件类型
  beforeUpload = (key, file) => {
    this.setState({ file });
    // console.log('before', file);
    if (checkFile(file.name, FILE_TYPES)) {
      this.setState({ isPicture: true });
    }
    if (!checkFile(file.name, FILE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      this.setState({ isPicture: false });
      return false;
    }
  }

  // 其他属性图片上传时处理
  handleUploaderChange = (key, fileList) => {
    const { isPicture } = this.state;
    if (!isPicture) { return; }
    // 上传成功，则将图片放入state里的pics数组内
    fileList.map((file) => {
      if (file.status === 'done') {
        message.success(`${file.name} 文件上传成功`);
        this.handleAddProductOtherAttr(key, { img_url: file.response.key });
      } else if (file.status === 'error') {
        message.error(`${file.name} 文件上传失败`);
      }
      return file;
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

  /**
   * 提交产品信息
   * 
   */
  handleSubmitProduct = () => {
    const {
      args,
      fields,
      specs,
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'product/modifyInfo',
      pno: args.pno,
      data: { ...fields, specs },
      success: () => { this.props.history.goBack(); },
      error: (res) => { message.error(handleServerMsgObj(res.msg)); },
    });
  }

  render() {
    const { isShowAttrMOdal, specs, editSpec } = this.state;
    const argsKey = Object.keys(this.state.args);
    const { loading, catalog, logs, upload } = this.props;

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
      render: (text, record) => (
        <InputNumber
          defaultValue={text}
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
      title: '已被产品关联次数',
      dataIndex: 'model_count',
      key: 'model_count',
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
          <a
            disabled={record.model_count > 0}
            onClick={() => { this.handleDeleteOtherAttrFiled(record.id); }}
          >
            删除
          </a>
        </Fragment>
      ),
    }];

    return (
      <PageHeaderLayout title={argsKey.includes('prdId') ? '修改产品信息' : '新建产品信息'}>
        <Card bordered={false} loading={loading.models.product} className={styles['modify-product']}>
          {/* 添加其它属性Modal */}
          <Modal
            width="650px"
            visible={isShowAttrMOdal}
            title="添加属性项"
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
          <ModifyProductForm
            data={this.state.fields}
            onChange={this.handleFormChange}
            catalog={catalog.level}
            loading={loading.models.product}
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
          <SectionHeader
            title="操作日志"
          />
          <Table
            loading={loading.models.logs}
            rowKey="id"
            columns={actionColumns}
            dataSource={logs.list}
          />
          <div className={styles['submit-btn-wrap']}>
            <Button onClick={() => { this.props.history.goBack(); }}>取消</Button>
            <Button type="primary" onClick={this.handleSubmitProduct}>提交</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
