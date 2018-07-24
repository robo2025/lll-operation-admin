import React, { Fragment } from 'react';
import moment from 'moment';
import { Card, Table } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import { getAreaBycode } from '../../utils/cascader-address-options';

const { Description } = DescriptionList;

const coreDeviceTableColumns = [
  {
    title: '组成部分',
    dataIndex: 'device_component',
    key: 'device_component',
  },
  {
    title: '商品名称',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: '型号',
    dataIndex: 'device_model',
    key: 'device_model',
  },
  {
    title: '品牌',
    dataIndex: 'brand_name',
    key: 'brand_name',
  },
  {
    title: '数量',
    dataIndex: 'device_num',
    key: 'device_num',
  },
  {
    title: '单价（元）',
    dataIndex: 'device_price',
    key: 'device_price',
  },
  {
    title: '小计（元）',
    key: 'total_price',
    render: row => <span>{row.device_num * row.device_price}</span>,
  },
  {
    title: '备注',
    key: 'device_note',
    dataIndex: 'device_note',
    render: text => (text === '' ? '无' : text),
  },
];
const adiDeviceTableColumns = [
  {
    title: '所属类型',
    dataIndex: 'device_component',
    key: 'device_component',
  },
  {
    title: '商品名称',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: '型号',
    dataIndex: 'device_model',
    key: 'device_model',
  },
  {
    title: '品牌',
    dataIndex: 'brand_name',
    key: 'brand_name',
  },
  {
    title: '数量',
    dataIndex: 'device_num',
    key: 'device_num',
  },
  {
    title: '单价（元）',
    dataIndex: 'device_price',
    key: 'device_price',
  },
  {
    title: '小计（元）',
    key: 'total_price',
    render: row => <span>{row.device_num * row.device_price}</span>,
  },
  {
    title: '备注',
    key: 'device_note',
    dataIndex: 'device_note',
    render: text => (text === '' ? '无' : text),
  },
];
class SupplierOrder extends React.Component {
  render() {
    const { profile } = this.props;
    const { supplier, supplierInfo, customer } = profile;
    if (!supplier || !supplierInfo) {
      return <div>暂无数据</div>;
    }
    const {
      sln_supplier_info,
      welding_tech_param,
      sln_support,
      sln_device,
    } = supplier;
    const { sewage_info } = customer;
    const coreDeviceTableData = sln_device.filter(
      item => item.device_type === '核心设备'
    );
    const aidDeviceTableData = sln_device.filter(
      item => item.device_type === '辅助设备'
    );
    return (
      <Fragment>
        <Card title="供应商信息">
          <DescriptionList size="small" col="3">
            <Description term="公司名称">
              {supplierInfo.profile.company}
            </Description>
            <Description term="联系人">{supplierInfo.username}</Description>
            <Description term="联系电话">{supplierInfo.mobile}</Description>
            <Description term="公司所在地">
              {getAreaBycode(`${supplierInfo.profile.district_id}`)}
            </Description>
          </DescriptionList>
        </Card>
        {coreDeviceTableData.length ? (
          <Card title="核心设备清单" style={{ marginTop: 30 }}>
            <Table
              columns={coreDeviceTableColumns}
              dataSource={coreDeviceTableData.map((item) => {
                return { ...item, key: item.device_id };
              })}
              pagination={false}
            />
          </Card>
        ) : null}
        {/* <Card title="核心设备清单" style={{ marginTop: 30 }}>
                    <Table
                        columns={coreDeviceTableColumns}
                        dataSource={coreDeviceTableData.map((item) => {
                            return { ...item, key: item.device_id };
                        })}
                        pagination={false}
                    />
                </Card> */}
        {aidDeviceTableData.length ? (
          <Card title="辅助设备" style={{ marginTop: 30 }}>
            <Table
              columns={adiDeviceTableColumns}
              dataSource={aidDeviceTableData.map((item) => {
                return { ...item, key: item.device_id };
              })}
              pagination={false}
            />
          </Card>
        ) : null}
        {/*  <Card title="辅助设备" style={{ marginTop: 30 }}>
                   <Table
                      columns={adiDeviceTableColumns}
                       dataSource={aidDeviceTableData.map((item) => {
                            return { ...item, key: item.device_id };
                       })}
                        pagination={false}
                    />
                </Card> */}
        {/* <Card style={{ marginTop: 30 }} title="技术支持">
                    <DescriptionList size="small" col="2">
                        {sln_support
                            ? sln_support.map((item) => {
                                return (
                                    <Description term={item.name}>
                                        ￥{item.price}元<span style={{ marginLeft: 35 }}>
                                            备注：{item.note}
                                        </span>
                                    </Description>
                                );
                            })
                            : null}
                    </DescriptionList>
                </Card> */}
        {sln_support.length ? (
          <Card style={{ marginTop: 30 }} title="技术支持">
            <DescriptionList size="small" col="2">
              {sln_support.map((item, index) => {
                return (
                  <Description term={item.name} key={index}>
                    ￥{item.price}元<span style={{ marginLeft: 35 }}>
                      备注：{item.note}
                                  </span>
                  </Description>
                );
              })}
            </DescriptionList>
          </Card>
        ) : null}
        {welding_tech_param.length ? (
          <Card style={{ marginTop: 30 }} title="技术参数">
            <DescriptionList size="small" col="2">
              {welding_tech_param.map((item, index) => {
                return (
                  <Description term={item.name} key={index}>
                    {item.value}
                    <span style={{ marginLeft: 5 }}>{item.unit_name}</span>
                  </Description>
                );
              })}
            </DescriptionList>
          </Card>
        ) : null}
        {/* <Card style={{ marginTop: 30 }} title="技术参数">
                    <DescriptionList size="small" col="2">
                        {welding_tech_param
                            ? welding_tech_param.map((item) => {
                                return (
                                    <Description term={item.name}>
                                        {item.value}
                                        <span style={{ marginLeft: 5 }}>{item.unit_name}</span>
                                    </Description>
                                );
                            })
                            : null}
                    </DescriptionList>
                </Card> */}
        {customer.sln_basic_info.sln_status === 'M' ? (
          <Card style={{ marginTop: 30 }} title="报价信息">
            <DescriptionList size="small" col="3">
              <Description term="付款比例">
                <span>首付：{sln_supplier_info.pay_ratio}% </span>
                <span>尾款：{100 - sln_supplier_info.pay_ratio}%</span>
              </Description>
              <Description term="运费">
                ￥{sln_supplier_info.freight_price}元
              </Description>
              <Description term="方案总价">
                ￥{sln_supplier_info.total_price}元（含运费）
              </Description>
              <Description term="报价有效期">
                {moment
                  .unix(sln_supplier_info.expired_date)
                  .format('YYYY年MM月DD日')}
              </Description>
              <Description term="方案发货期">
                {sln_supplier_info.delivery_date}
              </Description>
              <Description term="方案介绍">
                {sln_supplier_info.sln_desc}
              </Description>
              <Description term="备注">
                {sln_supplier_info.sln_note}
              </Description>
            </DescriptionList>
          </Card>
        ) : null}
      </Fragment>
    );
  }
}

export default SupplierOrder;
