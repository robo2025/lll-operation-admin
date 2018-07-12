import React, { Component } from 'react';
import { Form, Cascader, message, Input, Row, Col, Upload, Icon, Modal, Button, Tabs, Select } from 'antd';
import RichEditor from '../../components/RichEditor/RichEditor';
import { checkFile, getFileSuffix, removeObjFromArr, replaceObjFromArr } from '../../utils/tools';
import { QINIU_SERVER, FILE_SERVER } from '../../constant/config';
import styles from './product-info.less';

const FILE_CDN = FILE_SERVER;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const IMAGE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的图片文件类型
const CAD_TYPES = ['doc', 'docx', 'pdf', 'dwt', 'dxf', 'dxb'];// 支持的CAD文件格式
function getStanrdCatalog(data) {
    data.forEach((val) => {
        val.value = val.id;
        val.label = val.category_name;
        if (val.children && val.children.length > 0 && val.level < 3) {
            getStanrdCatalog(val.children);
        } else {
            delete val.children;
        }
    });
}
const mapImageType = {// 图片类型：正面、反面、侧面、包装图
    a: '1',
    b: '2',
    c: '3',
    d4: '4',
    d5: '5',
    d6: '6',
};
// 拼凑单个商品图片数据
function getPic(key, pics) {
    if (!Array.isArray(pics)) {
        throw new Error('传参必须是一个数组');
    }
    const pic = pics.filter(val => (val.img_type === key));
    if (pic.length > 0) {
        return [{
            id: pic[0].id,
            uid: pic[0].id,
            name: pic[0].img_type,
            url: /\/\//.test(pic[0].img_url) ? pic[0].img_url : FILE_CDN + pic[0].img_url,
        }];
    } else {
        return [];
    }
}
function getCAD(cads) {
    if (cads) {
        return cads.map((val, idx) => ({
            uid: idx,
            name: val,
            status: 'complete',
            reponse: '200', // custom error message to show
            url: val,
        }));
    } else {
        return [];
    }
}

@Form.create({
    onValuesChange(props, values) {
        // const { form } = props;
        // form.validateFields((err,values) => {
        //     console.log(123)
        //     if(err) {
        //         return
        //     }
            props.onChange(values);
        // })
        
    },
})
class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.state = {
            previewVisible: false,
            previewImage: '',
            file: { uid: '', name: '' },
            pics: [], // 产品图片集合
            cad_urls: [], // 产品cad文件集合
            cadUrl: [], // 产品cad文件集合      
            a: [],
            b: [],
            c: [],
            d4: [],
            d5: [],
            d6: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        const { pics, cad_urls } = nextProps.data;
        if (pics) {
            this.setState({
                pics,
                cad_urls: cad_urls || [],
                cadUrl: getCAD(cad_urls),
                a: getPic('1', pics),
                b: getPic('2', pics),
                c: getPic('3', pics),
                d4: getPic('4', pics),
                d5: getPic('5', pics),
                d6: getPic('6', pics),

            });
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    // 输入框有改变时
    handleChange(key, value) {
        console.log('输入内容', value);
        const tempJson = {};
        tempJson[key] = value;
        this.props.onAttrChange(tempJson);
    }

    // 图片上传前处理：验证文件类型
    beforeUpload(key, file) {
        this.setState({ file });
        // console.log('before', file);
        if (key === 'cadUrl') {
            if (!checkFile(file.name, CAD_TYPES)) {
                message.error(`${file.name} 暂不支持上传`);
                return false;
            }
        } else if (!checkFile(file.name, IMAGE_TYPES)) {
            message.error(`${file.name} 暂不支持上传`);
            return false;
        }
    }

    // cad和图片上传时处理
    handleUploaderChange(key, fileList) {
        console.log('文件上传列表：', key, fileList);
        const { pics, cad_urls, cadUrl } = this.state;
        const { onAttrChange } = this.props;
        // 如果上传的是cad文件
        if (key === 'cadUrl') {
            const tempJson = {};
            tempJson[key] = fileList;
            this.setState(tempJson);
            fileList.slice(-1).forEach((file) => {
                console.log('CAD文件：', file);
                if (file.status === 'done') {
                    this.setState({
                        cadUrl: [
                            ...cadUrl,
                            {
                                uid: cadUrl.length - 100,
                                name: file.name,
                                status: 'done',
                                reponse: '200', // custom error message to show
                                url: FILE_CDN + file.response.key,
                            },
                        ],
                    });
                    onAttrChange({ cad_urls: [...cad_urls, file.response.key] });
                } else if (file.status === 'complete') {
                    const completeCADS = fileList.filter(val => val.status === 'complete');
                    this.setState({
                        cadUrl: completeCADS,
                    });
                    onAttrChange({ cad_urls: completeCADS.map(val => (val.url)) });
                } else if (!file.status || file.status === 'error') {
                    this.setState({
                        cadUrl: [
                            ...cadUrl,
                            {
                                uid: cadUrl.length - 100,
                                name: file.name,
                                status: 'error',
                                reponse: '不支持的文件类型', // custom error message to show
                                url: '',
                            },
                        ],
                    });
                }
            });
            return;
        }
        // 如果上传的是图片
        if (key !== 'cadUrl') {
            console.log('图片状态改变-----------', key, fileList);
            const tempJson = {};
            tempJson[key] = fileList;
            this.setState(tempJson);
            // 上传成功，则将图片放入state里的pics数组内
            if (fileList.length === 0) {
                this.setState({ pics: removeObjFromArr({ img_type: mapImageType[key] }, pics, 'img_type') });
                onAttrChange({ pics: removeObjFromArr({ img_type: mapImageType[key] }, pics, 'img_type') });
            }
            fileList.map((file) => {
                if (file.status === 'done') {
                    message.success(`${file.name} 文件上传成功`);
                    // that.setState({ file_url: file.response.key });
                    if (key === 'a') {
                        this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '1', img_url: file.response.key }, pics, 'img_type') });
                        onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '1', img_url: file.response.key }] });
                    } else if (key === 'b') {
                        this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '2', img_url: file.response.key }, pics, 'img_type') });
                        onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '2', img_url: file.response.key }] });
                    } else if (key === 'c') {
                        this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: '3', img_url: file.response.key }, pics, 'img_type') });
                        onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: '3', img_url: file.response.key }] });
                    } else if (key.substr(0, 1) === 'd') {
                        const idx = key.substr(1, 1);
                        this.setState({ pics: replaceObjFromArr({ id: pics.length - 100, img_type: idx, img_url: file.response.key }, pics, 'img_type') });
                        onAttrChange({ pics: [...pics, { id: pics.length - 100, img_type: idx, img_url: file.response.key }] });
                    }
                } else if (file.status === 'error') {
                    message.error(`${file.name} 文件上传失败`);
                }
                return file;
            });
        } else if (key === 'cad_urls') {
            console.log('cad fileList', fileList);
        }
    }

    removeCAD = (file) => {
        console.log('移除文件', file);
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        };

        const { getFieldDecorator } = this.props.form;
        const { data, catalog, uploadToken, brands, } = this.props;
        const { previewVisible, previewImage, a, b, c, d4, d5, d6, file, cadUrl } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        getStanrdCatalog(catalog);// 将服务器目录结构转换成组件标准结构    

        return (
            <div className={styles['product-info-wrap']} >
                {/* 产品主要属性 */}
                <div style={{ float: 'left', width: '50%' }}>
                    <Form layout="horizontal" >
                        <FormItem
                            label="所属类目"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('category', {
                                rules: [{
                                    required: true,
                                    message: '请选择分类！',
                                }],
                            })(
                                <Cascader
                                    options={catalog}
                                    placeholder="请您选择类目"
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="品牌"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('bno', {
                                rules: [{
                                    required: true,
                                    message: '请填写产品品牌',
                                }],
                            })(
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="请选择一个品牌"
                                >
                                    {
                                        brands.map(val => (
                                            <Option value={val.bno} key={val.bno}>{val.brand_name}</Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="英文名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('english_name', {
                                rules: [{
                                    required: false,
                                    message: '请填写产品英文名',
                                }],
                                initialValue: data.english_name || '',
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                        <FormItem
                            label="产地"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('registration_place', {
                                rules: [{
                                    required: true,
                                    message: '请完善产品产地',
                                }],
                                initialValue: data.registration_place || '',
                            })(
                                <Input disabled />
                            )}
                        </FormItem>
                        <FormItem
                            label="产品名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('product_name', {
                                rules: [{
                                    required: true,
                                    message: '请填写产品名称',
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <Row gutter={24}>
                            <Col span={24}>
                                <FormItem
                                    label="CAD图"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 12 }}
                                >
                                    <Upload
                                        name="file"
                                        action={QINIU_SERVER}
                                        fileList={cadUrl}
                                        beforeUpload={currFile => (this.beforeUpload('cadUrl', currFile))}
                                        onChange={({ fileList }) => { this.handleUploaderChange('cadUrl', fileList); }}
                                        onRemove={(currFile) => { this.removeCAD(currFile); }}
                                        data={
                                            {
                                                token: uploadToken,
                                                key: `product/attachment/cad/${file.uid}.${getFileSuffix(file.name)}`,
                                            }
                                        }
                                    >
                                        <Button icon="upload">上传</Button>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div >
                {/* 商品图片 */}
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal >
                <div style={{ float: 'left', maxWidth: 360, position: 'relative', top: -60 }}>
                    <div style={{ marginBottom: 20 }}>
                        <h3>产品图片</h3>
                        <small>暂时支持格式：JPG/PNG/GIF/BMG/JPGE,文件大小请保持在100KB以内；</small>
                    </div>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Upload
                                name="file"
                                action={QINIU_SERVER}
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                fileList={a}
                                beforeUpload={currFile => (this.beforeUpload('a', currFile))}
                                onChange={({ fileList }) => { this.handleUploaderChange('a', fileList); }}
                                data={
                                    {
                                        token: uploadToken,
                                        key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                                    }
                                }
                            >
                                {a.length >= 1 ? null : uploadButton}
                            </Upload>
                            <p className="upload-pic-desc">正面</p>
                        </Col>
                        <Col span={8}>
                            <Upload
                                name="file"
                                action={QINIU_SERVER}
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                fileList={b}
                                beforeUpload={currFile => (this.beforeUpload('b', currFile))}
                                onChange={({ fileList }) => { this.handleUploaderChange('b', fileList); }}
                                data={
                                    {
                                        token: uploadToken,
                                        key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                                    }
                                }
                            >
                                {b.length >= 1 ? null : uploadButton}
                            </Upload>
                            <p className="upload-pic-desc">反面</p>
                        </Col>
                        <Col span={8}>
                            <Upload
                                name="file"
                                action={QINIU_SERVER}
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                fileList={c}
                                beforeUpload={currFile => (this.beforeUpload('c', currFile))}
                                onChange={({ fileList }) => { this.handleUploaderChange('c', fileList); }}
                                data={
                                    {
                                        token: uploadToken,
                                        key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                                    }
                                }
                            >
                                {c.length >= 1 ? null : uploadButton}
                            </Upload>
                            <p className="upload-pic-desc">侧面</p>
                        </Col>
                        <Col span={8}>
                            <Upload
                                name="file"
                                action={QINIU_SERVER}
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                fileList={d4}
                                beforeUpload={currFile => (this.beforeUpload('d4', currFile))}
                                onChange={({ fileList }) => { this.handleUploaderChange('d4', fileList); }}
                                data={
                                    {
                                        token: uploadToken,
                                        key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                                    }
                                }
                            >
                                {d4.length >= 1 ? null : uploadButton}
                            </Upload>
                            <p className="upload-pic-desc">包装图1</p>
                        </Col>
                        <Col span={8}>
                            <Upload
                                name="file"
                                action={QINIU_SERVER}
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                fileList={d5}
                                beforeUpload={currFile => (this.beforeUpload('d5', currFile))}
                                onChange={({ fileList }) => { this.handleUploaderChange('d5', fileList); }}
                                data={
                                    {
                                        token: uploadToken,
                                        key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                                    }
                                }
                            >
                                {d5.length >= 1 ? null : uploadButton}
                            </Upload>
                            <p className="upload-pic-desc">包装图2</p>
                        </Col>
                        <Col span={8}>
                            <Upload
                                name="file"
                                action={QINIU_SERVER}
                                listType="picture-card"
                                onPreview={this.handlePreview}
                                fileList={d6}
                                beforeUpload={currFile => (this.beforeUpload('d6', currFile))}
                                onChange={({ fileList }) => { this.handleUploaderChange('d6', fileList); }}
                                data={
                                    {
                                        token: uploadToken,
                                        key: `product/images/show/${file.uid}.${getFileSuffix(file.name)}`,
                                    }
                                }
                            >
                                {d6.length >= 1 ? null : uploadButton}
                            </Upload>
                            <p className="upload-pic-desc">包装图3</p>
                        </Col>
                    </Row>
                </div>
                {/* 商品描述、详情 */}
                <div style={{ clear: 'both' }} />
                <div className="good-desc">
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab="*产品概述" key="1">
                            {/* <RichEditor
                onChange={(html) => { this.handleChange('summary', html); }}
                token={uploadToken}
              /> */}
                            <TextArea
                                style={{ height: 500 }}
                                defaultValue=""
                                onChange={(e) => { this.handleChange('summary1', e.target.value); }}
                            />
                        </TabPane>
                        <TabPane tab="*产品详情" key="2">
                            <RichEditor
                                onChange={(html) => { this.handleChange('description', html); }}
                                token={uploadToken}
                            />
                        </TabPane>
                        <TabPane tab="学堂" key="3">
                            <RichEditor
                                onChange={(html) => { this.handleChange('description', html); }}
                                token={uploadToken}
                            />
                        </TabPane>
                        <TabPane tab="视频详解" key="4">
                            <RichEditor
                                onChange={(html) => { this.handleChange('description', html); }}
                                token={uploadToken}
                            />
                        </TabPane>
                        <TabPane tab="常见问题FAQ" key="5" >
                            <RichEditor
                                onChange={(html) => { this.handleChange('faq', html); }}
                                token={uploadToken}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div >
        );
    }
}

export default ProductForm;

