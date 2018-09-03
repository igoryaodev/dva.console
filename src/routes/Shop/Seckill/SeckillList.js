import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { dateTimeFormat1 } from '../../../utils/utils';

import styles from './SeckillList.less';

@connect(({ seckilllist, loading }) => ({
  seckilllist,
  loading: loading.effects['seckilllist/fetch'],
}))
export default class SeckillList extends Component {
  state = {};

  componentDidMount() {
    const payload = {
      pagesize: 30,
      pageindex: 1,
    };
    setTimeout(() => {
      this.props.dispatch({
        type: 'seckilllist/fetch',
        payload,
      });
    }, 2000);
  }
  newSeckill() {
    this.props.dispatch(routerRedux.push('/shop/seckilldetail/0'));
  }
  turnDetail(e) {
    this.props.dispatch(routerRedux.push(`/shop/seckilldetail/${e.target.dataset.id}`));
  }

  render() {
    const { seckilllist } = this.props;
    const { products, loading } = seckilllist;
    const pagination = {
      pageSize: 30,
    };
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'id',
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
        dataIndex: 'id',
        key: 'ids',
        render: id => (
          <a data-id={id} onClick={e => this.turnDetail(e)}>
            详情
          </a>
        ),
      },
    ];
    const dataSource = products;
    return (
      <div>
        <div className={styles.section}>
          <h2>秒杀活动</h2>
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
              rowKey={record => record.id}
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
