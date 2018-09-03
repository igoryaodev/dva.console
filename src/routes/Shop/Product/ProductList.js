import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { dateTimeFormat1 } from '../../../utils/utils';

import styles from './ProductList.less';

@connect(({ productlist, loading }) => ({
  productlist,
  // loading: loading.effects['productlist/fetch'],
}))
export default class Productlist extends Component {
  state = {};

  componentDidMount() {
    const payload = {
      pagesize: 30,
      page: 1,
    };
    setTimeout(() => {
      this.props.dispatch({
        type: 'productlist/fetch',
        payload,
      });
    }, 2000);
  }
  newSeckill() {
    this.props.dispatch(routerRedux.push('/shop/productdetail/0'));
  }
  turnDetail(e, _id) {
    if(!_id) return message.error('出错了！')
    this.props.dispatch(routerRedux.push(`/shop/productdetail/${_id}`));
  }

  render() {
    const { productlist: { list, totalPage, loading } } = this.props;

    const pagination = {
      pageSize: 30,
    };
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: '_id',
      },
      {
        title: '上架时间',
        dataIndex: 'putawayTime',
        key: 'putawayTime',
        render: text => <span>{dateTimeFormat1(text)}</span>,
      },
      {
        title: '下架时间',
        dataIndex: 'soldOutTime',
        key: 'soldOutTime',
        render: text => <span>{dateTimeFormat1(text)}</span>,
      },
      {
        title: '状态',
        dataIndex: 'isPutaway',
        key: 'isPutaway',
        render: text => <span>{text ? '开启' : '关闭'}</span>,
      },
      {
        title: '操作',
        dataIndex: '_id',
        key: 'ids',
        render: _id => (
          <a data-id={_id} onClick={e => this.turnDetail(e, _id)}>
            详情
          </a>
        ),
      },
    ];
    const dataSource = list;
    return (
      <div>
        <div className={styles.section}>
          <h2>商品列表</h2>
        </div>
        <div className={styles.section}>
          <div className={styles.slideContent}>
            <Button
              className={styles.rightBtn}
              type="default"
              icon="plus"
              onClick={() => this.newSeckill()}
            >
              新增
            </Button>
            <div className={styles.clear} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.slideContent}>
            <Table
              loading={loading}
              rowKey={record => record._id}
              dataSource={dataSource}
              columns={columns}
              pagination={pagination}
            />
          </div>
        </div>
      </div>
    );
  }
}
