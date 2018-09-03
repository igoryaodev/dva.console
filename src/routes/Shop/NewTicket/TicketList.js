import React, { Component } from 'react';
import { connect } from 'dva';
// import { Row, Col, Icon, Table, Tooltip } from 'antd';
import { Table } from 'antd';
import styles from './TicketList.less';

@connect(({ newTicketList, loading }) => ({
  newTicketList,
  loading: loading.effects['chart/fetch'],
}))
export default class newTicketList extends Component {
  componentDidMount() {
    const payload = {
      page: 1,
      isActivity: false,
    };
    this.props.dispatch({
      type: 'newTicketList/fetch',
      payload,
    });
  }
  onPageChange(e) {
    const payload = {
      page: e.current,
      isActivity: false,
    };
    this.props.dispatch({
      type: 'newTicketList/fetch',
      payload,
    });
  }

  // 名称 起始时间 SKU 价格 商品分类 库存 规格 条形码 状态 操作
  // const { list, pageNumber, pageSize, totalPages, totalRecords } = ticketData
  render() {
    const { newTicketList } = this.props;
    const { ticketData, loading } = newTicketList;
    const { list, pageNumber, pageSize, totalPages, totalRecords } = ticketData;
    const paginations = { pageSize: pageSize, current: pageNumber, total: totalRecords };
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'id',
      },
      {
        title: '起始时间',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: 'SKU',
        dataIndex: 'sku',
        key: 'sku',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '商品分类',
        dataIndex: 'categoryName',
        key: 'productCategory',
      },
      {
        title: '库存',
        dataIndex: 'safeStock',
        key: 'safeStock',
      },
      {
        title: '规格',
        dataIndex: 'printString',
        key: 'printString',
      },
      {
        title: '条形码',
        dataIndex: 'SKU',
        key: 'printCode',
        render: text => <div>{text}:checkbox</div>,
      },
      {
        title: '状态',
        dataIndex: 'isEnable',
        key: 'isEnable',
        render: text => <span>{text ? '开启' : '关闭'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'ids',
      },
    ];
    return (
      <div>
        <div className={styles.section}>
          <h2>票务活动</h2>
        </div>
        <div className={styles.section}>
          <div className={styles.slideContent}>
            <Table
              loading={loading}
              dataSource={list}
              rowKey={record => record.id}
              columns={columns}
              pagination={paginations}
              onChange={e => this.onPageChange(e)}
            />
          </div>
        </div>
      </div>
    );
  }
}
