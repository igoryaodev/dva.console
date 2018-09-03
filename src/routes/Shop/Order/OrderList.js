import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Button, Input } from 'antd';
import styles from './OrderList.less';

@connect(({ orderlist, loading }) => ({
  orderlist,
}))
export default class OrderList extends Component {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderlist/fetch',
    });
  }

  routeHandle(e) {
    const { dispatch } = this.props;
    const id = Number(e.target.dataset.id);
    dispatch(routerRedux.push(`/shop/orderdetail/${id}`));
  }
  changePage(e) {
    const { dispatch } = this.props;
    let payload = {
      pageIndex: e.current,
      pageSize: e.pageSize,
    };
    dispatch({
      type: 'orderlist/fetch',
      payload,
    });
  }
  render() {
    const { orderlist, loading } = this.props;
    const { orders, paginationInfo } = orderlist;
    const dateFormat = 'YYYY/MM/DD HH:mm:ss';
    const pagination = {
      total: paginationInfo && paginationInfo.totalItems,
      pageSize: 20,
    };
    //商品  会员  收货信息  物流单号  分销  支付方式  订单渠道  第三方渠道 订单状态  订单金额  备注  操作
    const columns = [
      {
        title: '商品',
        dataIndex: 'orderNo',
        key: 'pid',
      },
      {
        title: '会员',
        dataIndex: 'orderNo',
        key: 'balance',
      },
      {
        title: '收货信息',
        dataIndex: 'orderNo',
        key: 'createdTime',
      },
      {
        title: '物流单号',
        dataIndex: 'orderNo',
        key: 'createdBy',
      },
      {
        title: '支付方式',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
      },
      {
        title: '订单金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render: id => (
          <div>
            <a data-id={id} onClick={e => this.routeHandle(e)}>
              {' '}
              详情
            </a>
            <a className="delete"> 删除</a>
          </div>
        ),
      },
    ];

    return (
      <div>
        <div className={styles.section}>
          <h2>订单</h2>
        </div>

        <div className={styles.section}>
          <div className={styles.slideContent}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={orders}
              columns={columns}
              pagination={pagination}
              onChange={e => this.changePage(e)}
            />
          </div>
        </div>
      </div>
    );
  }
}
