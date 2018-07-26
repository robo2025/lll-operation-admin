import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Radio,
  Icon,
  Upload,
  Modal,
  message,
  Checkbox,
  Cascader,
  Spin,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { QINIU_SERVER, FILE_SERVER } from '../../constant/config';
import {
  checkFile,
  getFileSuffix,
} from '../../utils/tools';
import options from '../../utils/cascader-address-options';

import styles from './index.less';

export const IMAGE_TYPES = ['jpg', 'png', 'gif', 'jpeg'];
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ upload, supAudit, loading }) => ({
  upload,
  profile: supAudit.profile,
  loading: loading.effects['supAudit/fetchDetail'],
}))
@Form.create({
  mapPropsToFields(props) {
    const { profile } = props;
    const { basic_info, qualifications } = profile;
    if (!basic_info) {
      return {};
    }
    let formData = {};
    Object.keys(basic_info).map((item) => {
      formData = {
        ...formData,
        [item]: Form.createFormField({ value: basic_info[item] }),
      };
      return null;
    });
    // 日期
    let dateData = {};
    qualifications.map((item) => {
      dateData = {
        ...dateData,
        [`${item.qualifi_name}_date`]: Form.createFormField({
          value: [
            moment.unix(item.effective_date),
            moment.unix(item.expire_date),
          ],
        }),
        [item.qualifi_name]: Form.createFormField({
          value: item.qualifi_url,
        }),
      };
      return null;
    });
    formData = {
      ...formData,
      ...dateData,
      place: Form.createFormField({
        value: [
          `${basic_info.province_id}`,
          `${basic_info.city_id}`,
          `${basic_info.district_id}`,
        ],
      }),
    };
    const licenseData = qualifications.filter(
      item => item.qualifi_name === 'license'
    );
    if (!licenseData.length) {
      return {
        ...formData,
      };
    }
    return {
      ...formData,
      ...dateData,
      qualifi_code: Form.createFormField({
        value: licenseData[0].qualifi_code,
      }),
      date: Form.createFormField({
        value: [
          moment.unix(licenseData[0].effective_date),
          moment.unix(licenseData[0].expire_date),
        ],
      }),
    };
  },
})
export default class EditableProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      previewVisible: false,
      file: { uid: '', name: '' },
      previewImage: '',
      photos: [],
      agency: [],
      integrator: [],
      taxpayer: [],
      production: [],
      certification: [],
      other: [],
      isFlag: false, // 是否立即上传产品资质
      companyType: '', // 公司性质
      isGeneralTaxpayer: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'upload/fetch',
    });
    dispatch({
      type: 'supAudit/fetchDetail',
      payload: location.href.split('=').pop(),
      callback: (success, data) => {
        if (success) {
          const { basic_info, qualifications } = data;
          this.setState({ companyType: basic_info.company_type });
          const flagArray = qualifications.filter(
            item =>
              item.qualifi_name === 'production' ||
              item.qualifi_name === 'certification' ||
              item.qualifi_name === 'other'
          );
          if (flagArray.length > 0) {
            this.setState({
              isFlag: true,
            });
          }
          // 一般纳税人照片
          const isGeneralTaxpayerArray = qualifications.filter(
            item => item.qualifi_name === 'taxpayer'
          );
          if (isGeneralTaxpayerArray.length > 0) {
            this.setState({
              isGeneralTaxpayer: true,
            });
          }
          qualifications.map((item) => {
            this.setState({
              [item.qualifi_name]: [
                {
                  uid: item.effective_date + item.qualifi_url, // 时间+url做为ID
                  status: 'done',
                  url: FILE_SERVER + item.qualifi_url,
                  response: {
                    key: item.qualifi_url,
                  },
                },
              ],
            });
            return null;
          });
          let licenseData = [];
          if (qualifications) {
            licenseData = qualifications.filter(
              item => item.qualifi_name === 'license'
            );
          }
          if (licenseData.length) {
            this.setState({
              photos: [
                {
                  uid:
                    licenseData[0].effective_date + licenseData[0].qualifi_url, // 时间+url做为ID
                  status: 'done',
                  url: FILE_SERVER + licenseData[0].qualifi_url,
                  response: {
                    key: licenseData[0].qualifi_url,
                  },
                },
              ],
            });
          }
        }
      },
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onCheckboxChange = (key, e) => {
    this.setState({ [key]: e.target.checked });
  };

  // 文件上传时处理
  handleBeforeUpload = (key, file) => {
    this.setState({ file });
    if (!checkFile(file.name, IMAGE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      return false;
    }
  };

  // 文件上传状态改变时处理
  handleUploadChange = (key, fileList) => {
    this.setState({ [key]: fileList });
    // 删除license的值触发表单校验
    if (key === 'photos' && !fileList.length) {
      this.props.form.setFieldsValue({ license: undefined });
    }
  };

  // 图片预览
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  // 提交注册
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      photos,
      production,
      certification,
      other,
      agency,
      integrator,
      taxpayer,
      isFlag,
    } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('校验出错:', err, values);
        return;
      }
      const qualifications = []; // 资质证书
      // 营业执照
      const license = {
        qualifi_name: 'license', //  //证书名称  (license:营业执照 production:生产许可证 certification:产品合格证 other:其他证书)
        qualifi_code: values.qualifi_code, // 证书编码
        qualifi_url: photos[0].status === 'done' ? photos[0].response.key : '', // url
        effective_date: values.date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
        expire_date: values.date[0].format('YYYY-MM-DD'), // 失效期
      };
      const place = {
        province_id: values.place[0],
        city_id: values.place[1],
        district_id: values.place[2], // 区 (可选)
      };
      qualifications.push(license);
      if (values.agency) {
        // 代理商相关证明
        const agencyObj = {
          qualifi_name: 'agency',
          qualifi_code: null, // 证书编码
          qualifi_url:
            agency[0].status === 'done' ? agency[0].response.key : '', // url
          effective_date: values.agency_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
          expire_date: values.agency_date[1].format('YYYY-MM-DD'), // 失效期
        };
        qualifications.push(agencyObj);
      }
      if (values.integrator) {
        // 集成商相关证明
        const integratorObj = {
          qualifi_name: 'integrator',
          qualifi_code: null, // 证书编码
          qualifi_url:
            integrator[0].status === 'done' ? integrator[0].response.key : '', // url
          effective_date: values.integrator_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
          expire_date: values.integrator_date[1].format('YYYY-MM-DD'), // 失效期
        };
        qualifications.push(integratorObj);
      }
      if (values.taxpayer) {
        // 一般纳税人相关证明
        const taxpayerObj = {
          qualifi_name: 'taxpayer',
          qualifi_code: null, // 证书编码
          qualifi_url:
            taxpayer[0].status === 'done' ? taxpayer[0].response.key : '', // url
          effective_date: values.taxpayer_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
          expire_date: values.taxpayer_date[1].format('YYYY-MM-DD'), // 失效期
        };
        qualifications.push(taxpayerObj);
      }
      if (isFlag) {
        // 如果立即上传产品资质
        if (values.production) {
          // 生产许可证
          const productionObj = {
            qualifi_name: 'production', //  //证书名称  (license:营业执照 production:生产许可证 certification:产品合格证 other:其他证书)
            qualifi_code: null, // 证书编码
            qualifi_url:
              production[0].status === 'done' ? production[0].response.key : '', // url
            effective_date: values.production_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
            expire_date: values.production_date[1].format('YYYY-MM-DD'), // 失效期
          };
          qualifications.push(productionObj);
        }
        if (values.certification) {
          // 产品合格证
          const certificationObj = {
            qualifi_name: 'certification', //  //证书名称  (license:营业执照 production:生产许可证 certification:产品合格证 other:其他证书)
            qualifi_code: null, // 证书编码
            qualifi_url:
              certification[0].status === 'done'
                ? certification[0].response.key
                : '', // url
            effective_date: values.certification_date[0].format('YYYY-MM-DD'), // 有效期 （格式：2018-04-02）
            expire_date: values.certification_date[1].format('YYYY-MM-DD'), // 失效期
          };
          qualifications.push(certificationObj);
        }
        if (values.other) {
          // 其他证书
          const otherObj = {
            qualifi_name: 'other', //  //证书名称  (license:营业执照 production:生产许可证 certification:产品合格证 other:其他证书)
            qualifi_code: null, // 证书编码
            qualifi_url:
              other[0].status === 'done' ? other[0].response.key : '', // url
            effective_date: null, // 有效期 （格式：2018-04-02）
            expire_date: null, // 失效期
          };
          qualifications.push(otherObj);
        }
      }
      console.log(
        '校验通过:',
        {
          ...values,
          qualifications,
          ...place,
        },
        qualifications
      );

      this.props.handleSubmit({
        ...values,
        qualifications,
        ...place,
      });
    });
  };

  // 公司性质单选框改变时
  handleCompanyTypeChange = (e) => {
    this.setState({ companyType: e.target.value });
  };

  // 是否为一般纳税人改变
  handleTaxpayerChange = (e) => {
    this.setState({ isGeneralTaxpayer: Boolean(e.target.value) });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { upload, type, loading } = this.props;
    const {
      previewVisible,
      previewImage,
      isFlag,
      file,
      photos,
      production,
      certification,
      other,
      agency,
      integrator,
      taxpayer,
      companyType,
      isGeneralTaxpayer,
    } = this.state;
    // console.log('用户注册state', this.state);

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const content = (
      <Spin spinning={loading}>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <Card
            title="基本信息"
            bordered={false}
            className={styles['register-wrap']}
          >
            <FormItem {...formItemLayout} label="帐户名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入帐户名',
                  },
                ],
              })(<Input placeholder="请输入帐户名" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                  {
                    len: 11,
                    message: '请输入正确的手机号码',
                  },
                ],
              })(<Input disabled={type === 'update'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系邮箱',
                  },
                  {
                    type: 'email',
                    message: '邮箱地址格式错误！',
                  },
                ],
              })(<Input />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="企业名称"
              help="请填写与企业营业执照或三证合一证件保持一致"
            >
              {getFieldDecorator('company', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业名称',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="企业地址">
              {getFieldDecorator('place', {
                rules: [{ required: true, message: '请选择省市区' }],
              })(
                <Cascader
                  options={options}
                  changeOnSelect
                  style={{ width: '100%' }}
                  placeholder="请选择省市区"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业地址',
                  },
                ],
              })(<Input placeholder="请填写详细地址" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="法人"
              help="请填写与企业营业执照或三证合一证件保持一致"
            >
              {getFieldDecorator('legal', {
                rules: [
                  {
                    required: true,
                    message: '请输入公司法人',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="固定电话">
              {getFieldDecorator('telephone', {
                rules: [
                  {
                    required: true,
                    message: '请输入固定电话',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Card>
          <Card title="资质信息" bordered={false} style={{ marginTop: 35 }}>
            <FormItem {...formItemLayout} label="营业执照注册号">
              {getFieldDecorator('qualifi_code', {
                rules: [
                  {
                    required: true,
                    message: '请输入营业执照注册号',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="营业执照照片">
              {getFieldDecorator('license', {
                rules: [
                  {
                    required: true,
                    message: '请上传营业执照照片',
                  },
                ],
              })(
                <div>
                  <Upload
                    name="file"
                    action={QINIU_SERVER}
                    listType="picture-card"
                    className="avatar-uploader"
                    fileList={this.state.photos}
                    beforeUpload={currFile =>
                      this.handleBeforeUpload('photos', currFile)
                    }
                    onChange={({ fileList }) => {
                      this.handleUploadChange('photos', fileList);
                    }}
                    onPreview={this.handlePreview}
                    data={{
                      token: upload.upload_token,
                      key: `supplier/qualification/images/${
                        file.uid
                      }.${getFileSuffix(file.name)}`,
                    }}
                  >
                    {photos && photos.length >= 1 ? null : uploadButton}
                  </Upload>

                  <FormItem label="有效期">
                    {getFieldDecorator('date', {
                      rules: [
                        {
                          required: true,
                          message: '请选择起止日期',
                        },
                      ],
                    })(
                      <RangePicker
                        style={{ width: '350px' }}
                        placeholder={['开始日期', '结束日期']}
                      />
                    )}
                  </FormItem>
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="企业性质">
              {getFieldDecorator('company_type', {
                rules: [
                  {
                    required: true,
                    message: '请选择企业性质',
                  },
                ],
                initialValue: 'supplier',
              })(
                <Radio.Group onChange={this.handleCompanyTypeChange}>
                  <Radio value="supplier">厂家</Radio>
                  <Radio value="agency">代理商</Radio>
                  <Radio value="integrator">集成商</Radio>
                  <Radio value="other">其他</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {companyType === 'agency' ? (
              <FormItem
                {...formItemLayout}
                label="代理商相关证书"
                help="证书照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('agency', {
                  rules: [
                    {
                      required: false,
                      message: '请上传代理商相关证书照片',
                    },
                  ],
                })(
                  <div>
                    {this.state.agency.length ? (
                      <Fragment>
                        <img
                          src={this.state.agency[0].url}
                          alt="代理商相关证书"
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: '3%',
                          }}
                        />
                        <a
                          style={{ marginLeft: 30 }}
                          onClick={() => {
                            Modal.confirm({
                              content: '确认删除这张图片？',
                              onOk: () => this.setState({ agency: [] }),
                            });
                          }}
                        >
                          删除
                        </a>
                      </Fragment>
                    ) : (
                      <Upload
                        name="file"
                        action={QINIU_SERVER}
                        listType="picture-card"
                        className="avatar-uploader"
                        beforeUpload={currFile =>
                          this.handleBeforeUpload('agency', currFile)
                        }
                        onChange={({ fileList }) => {
                          this.handleUploadChange('agency', fileList);
                        }}
                        onPreview={this.handlePreview}
                        data={{
                          token: upload.upload_token,
                          key: `supplier/qualification/images/${
                            file.uid
                          }.${getFileSuffix(file.name)}`,
                        }}
                      >
                        {agency && agency.length >= 1 ? null : uploadButton}
                      </Upload>
                    )}

                    <FormItem label="有效期">
                      {getFieldDecorator('agency_date', {
                        rules: [
                          {
                            required: agency && agency.length > 0,
                            message: '请选择起止日期',
                          },
                        ],
                      })(
                        <RangePicker
                          style={{ width: '350px' }}
                          placeholder={['开始日期', '结束日期']}
                        />
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            ) : null}
            {companyType === 'integrator' ? (
              <FormItem
                {...formItemLayout}
                label="集成商相关证书"
                help="证书照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('integrator', {
                  rules: [
                    {
                      required: false,
                      message: '请上传集成商相关证书照片',
                    },
                  ],
                })(
                  <div>
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      listType="picture-card"
                      className="avatar-uploader"
                      fileList={this.state.integrator}
                      beforeUpload={currFile =>
                        this.handleBeforeUpload('integrator', currFile)
                      }
                      onChange={({ fileList }) => {
                        this.handleUploadChange('integrator', fileList);
                      }}
                      onPreview={this.handlePreview}
                      data={{
                        token: upload.upload_token,
                        key: `supplier/qualification/images/${
                          file.uid
                        }.${getFileSuffix(file.name)}`,
                      }}
                    >
                      {integrator && integrator.length >= 1
                        ? null
                        : uploadButton}
                    </Upload>

                    <FormItem label="有效期">
                      {getFieldDecorator('integrator_date', {
                        rules: [
                          {
                            required: integrator && integrator.length > 0,
                            message: '请选择起止日期',
                          },
                        ],
                      })(
                        <RangePicker
                          style={{ width: '350px' }}
                          placeholder={['开始日期', '结束日期']}
                        />
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            ) : null}
            <FormItem {...formItemLayout} label="一般纳税人">
              <Radio.Group
                onChange={this.handleTaxpayerChange}
                value={this.state.isGeneralTaxpayer}
              >
                <Radio value={false}>否</Radio>
                <Radio value>是</Radio>
              </Radio.Group>
            </FormItem>
            <div
              style={
                isGeneralTaxpayer ? { display: 'block' } : { display: 'none' }
              }
            >
              <FormItem
                {...formItemLayout}
                label="一般纳税人证明"
                help="照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('taxpayer', {
                  rules: [
                    {
                      required: false,
                      message: '请上传一般纳税人证明照片',
                    },
                  ],
                })(
                  <div>
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      fileList={this.state.taxpayer}
                      listType="picture-card"
                      className="avatar-uploader"
                      beforeUpload={currFile =>
                        this.handleBeforeUpload('taxpayer', currFile)
                      }
                      onChange={({ fileList }) => {
                        this.handleUploadChange('taxpayer', fileList);
                      }}
                      onPreview={this.handlePreview}
                      data={{
                        token: upload.upload_token,
                        key: `supplier/qualification/images/${
                          file.uid
                        }.${getFileSuffix(file.name)}`,
                      }}
                    >
                      {taxpayer && taxpayer.length >= 1 ? null : uploadButton}
                    </Upload>

                    <FormItem label="有效期">
                      {getFieldDecorator('taxpayer_date', {
                        rules: [
                          {
                            required: taxpayer && taxpayer.length > 0,
                            message: '请选择起止日期',
                          },
                        ],
                      })(
                        <RangePicker
                          style={{ width: '350px' }}
                          placeholder={['开始日期', '结束日期']}
                        />
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
            </div>{' '}
            <FormItem
              {...formItemLayout}
              label="产品资质"
              help="完善产品资质信息将有利于您的账号优先审核，加快入驻合作"
            >
              <Checkbox
                onChange={(e) => {
                  this.onCheckboxChange('isFlag', e);
                }}
                checked={this.state.isFlag}
              >
                立即上传
              </Checkbox>
            </FormItem>
            <div style={isFlag ? { display: 'block' } : { display: 'none' }}>
              <FormItem
                style={{ marginBottom: 30 }}
                {...formItemLayout}
                label="产品生产许可证"
                help="证书照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('production', {
                  rules: [
                    {
                      required: false,
                      message: '请上传产品生产许可证照片',
                    },
                  ],
                })(
                  <div>
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      listType="picture-card"
                      fileList={this.state.production}
                      className="avatar-uploader"
                      beforeUpload={currFile =>
                        this.handleBeforeUpload('production', currFile)
                      }
                      onChange={({ fileList }) => {
                        this.handleUploadChange('production', fileList);
                      }}
                      onPreview={this.handlePreview}
                      data={{
                        token: upload.upload_token,
                        key: `supplier/qualification/images/${
                          file.uid
                        }.${getFileSuffix(file.name)}`,
                      }}
                    >
                      {production && production.length >= 1
                        ? null
                        : uploadButton}
                    </Upload>

                    <FormItem label="有效期">
                      {getFieldDecorator('production_date', {
                        rules: [
                          {
                            required: production && production.length > 0,
                            message: '请选择起止日期',
                          },
                        ],
                      })(
                        <RangePicker
                          style={{ width: '350px' }}
                          placeholder={['开始日期', '结束日期']}
                        />
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                style={{ marginBottom: 30 }}
                label="产品合格证"
                help="证书照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('certification', {
                  rules: [
                    {
                      required: false,
                      message: '请上传产品合格证照片',
                    },
                  ],
                })(
                  <div>
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      fileList={this.state.certification}
                      listType="picture-card"
                      className="avatar-uploader"
                      beforeUpload={currFile =>
                        this.handleBeforeUpload('certification', currFile)
                      }
                      onChange={({ fileList }) => {
                        this.handleUploadChange('certification', fileList);
                      }}
                      onPreview={this.handlePreview}
                      data={{
                        token: upload.upload_token,
                        key: `supplier/qualification/images/${
                          file.uid
                        }.${getFileSuffix(file.name)}`,
                      }}
                    >
                      {certification && certification.length >= 1
                        ? null
                        : uploadButton}
                    </Upload>

                    <FormItem label="有效期">
                      {getFieldDecorator('certification_date', {
                        rules: [
                          {
                            required: certification && certification.length > 0,
                            message: '请选择起止日期',
                          },
                        ],
                      })(
                        <RangePicker
                          style={{ width: '350px' }}
                          placeholder={['开始日期', '结束日期']}
                        />
                      )}
                    </FormItem>
                  </div>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                style={{ marginBottom: 30 }}
                label="其他证书"
                help="证书照片(图片小于1M，支持格式jpg\png)"
              >
                {getFieldDecorator('other', {
                  rules: [
                    {
                      required: false,
                      message: '请上传营业执照照片',
                    },
                  ],
                })(
                  <div>
                    <Upload
                      name="file"
                      action={QINIU_SERVER}
                      fileList={this.state.other}
                      listType="picture-card"
                      className="avatar-uploader"
                      beforeUpload={currFile =>
                        this.handleBeforeUpload('other', currFile)
                      }
                      onChange={({ fileList }) => {
                        this.handleUploadChange('other', fileList);
                      }}
                      onPreview={this.handlePreview}
                      data={{
                        token: upload.upload_token,
                        key: `supplier/qualification/images/${
                          file.uid
                        }.${getFileSuffix(file.name)}`,
                      }}
                    >
                      {other && other.length >= 3 ? null : uploadButton}
                    </Upload>
                  </div>
                )}
              </FormItem>
            </div>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={false}
                size="large"
              >
                {this.props.buttonText}
              </Button>
            </FormItem>
            {/* 图片预览 */}
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Card>
        </Form>
      </Spin>
    );
    if (type === 'update') {
      return content;
    }
    return <PageHeaderLayout title="企业用户信息">{content}</PageHeaderLayout>;
  }
}
