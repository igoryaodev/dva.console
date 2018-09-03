import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ newticketdetail, loading }) => ({
  newticketdetail,
  loading: loading.effects['newticketdetail/fetch'],
}))
export default class TicketDetail extends Component {
  // componentDidMount(){
  //   // this
  // }

  render() {
    return <div>1</div>;
  }
}
