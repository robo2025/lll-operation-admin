import React, { Component } from 'react';
import { Input, Table, Checkbox, Button } from 'antd';
import styles from './FilterContent.less';

/**
 * 产品目录筛选项弹出层
 */

const { Search } = Input;


export default class FilterContent extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    }, {
      title: '参数项名称',
      dataIndex: 'spec_name',
      key: 'spec_name',
      align: 'center',
    }, {
      title: '单位',
      dataIndex: 'spec_unit',
      key: 'spec_unit',
      align: 'center',
    }, {
      title: '参数值',
      dataIndex: 'spec_values',
      key: 'spec_values',
      align: 'center',
      render: text => (<span>{text.join(',')}</span>),
    }, {
      title: '已有产品使用条数',
      dataIndex: 'product_count',
      key: 'product_count',
      align: 'center',
    },
    {
      title: '是否为筛选条件项',
      dataIndex: 'is_search',
      key: 'is_search',
      align: 'center',
      render: (text, record) => (
        <Checkbox
          defaultChecked={text}
          onChange={e => this.handleFilter(record, e.target.checked)}
        />
      ),
    }];
  }

  showTotal = () => {
    return (
      <span className="total-text">
        查询到{this.props.total}条数据
      </span>
    );
  }

  handleFilter = (record, isChecked) => {
    const { onFilterClick } = this.props;
    onFilterClick({
      categoryId: record.category_id,
      specId: record.id,
      data: {
        is_search: isChecked >> 0,
        sort: record.sort,
      },
    });
  }

  render() {
    const paginationProps = {
      showTotal: this.showTotal,
    };
    const { specsData, data, onRefreshSpecs, loading } = this.props;

    return (
      <div className={styles['filter-wrap']}>
        <div className="tools">
          <div>
            参数项目名称：
            <Search
              placeholder="请输入你要搜索的参数"
              onSearch={(value) => { onRefreshSpecs(data.id, { spec_name: value }); }}
              enterButton
              style={{ width: 260 }}
            />
          </div>
          <Button type="primary" onClick={() => { onRefreshSpecs(data.id); }}>刷新</Button>
        </div>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={specsData}
          columns={this.columns}
          pagination={paginationProps}
        />
      </div>
    );
  }
}
