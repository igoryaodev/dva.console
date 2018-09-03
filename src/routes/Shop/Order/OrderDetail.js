import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import styles from './OrderDetail.less';

@connect(({ orderdetail, loading }) => ({
  orderdetail,
}))
export default class OrderDetail extends Component {
  state = {};

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { id } = params;
    let payload = {
      id: id,
    };
    dispatch({
      type: 'orderdetail/fetch',
      payload,
    });
  }

  render() {
    return <div>OrderDetail</div>;
  }
}
