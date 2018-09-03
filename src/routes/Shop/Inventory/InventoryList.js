import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Table, Button } from 'antd';
import styles from './InventoryList.less';

@connect(({ inventorylist, loading }) => ({
  inventorylist,
  loading: loading.effects['inventorylist/fetch'],
}))
export default class InventoryList extends Component {
  state = {};
  load() {
    const payload = {
      pagesize: 30,
      pageindex: 1,
    };
    this.props.dispatch({
      type: 'inventorylist/fetch',
      payload,
    });
  }
  componentDidMount() {
    this.load();
  }
  turnDetail(e) {
    this.props.dispatch(routerRedux.push(`/shop/inventoryskulist/${e.target.dataset.id}`));
  }

  render() {
    const { inventorylist } = this.props;
    const { products, loading, paginationInfo } = inventorylist;
    const pagesize = 30;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'id',
      },
      {
        title: '入库',
        dataIndex: 'inInventory',
        key: 'inInventory',
      },
      {
        title: '出库',
        dataIndex: 'outInventory',
        key: 'outInventory',
      },
      {
        title: '库存',
        dataIndex: 'inventory',
        key: 'inventory',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'ids',
        render: id => (
          <a data-id={id} onClick={e => this.turnDetail(e)}>
            详情
          </a>
        ),
      },
    ];
    return (
      <div>
        <div className={styles.section}>
          <h2>库存</h2>
        </div>

        <div className={styles.section}>
          <div className={styles.slideContent}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={products}
              columns={columns}
              pagination={pagesize}
            />
          </div>
        </div>
      </div>
    );
  }
}
