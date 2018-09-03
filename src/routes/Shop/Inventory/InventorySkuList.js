import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Button, InputNumber, message } from 'antd';
import styles from './InventorySkuList.less';

@connect(({ inventoryskulist, loading }) => ({
  inventoryskulist,
  loading: loading.effects['inventoryskulist/fetch'],
}))
export default class InventorySkuList extends Component {
  state = {};
  load() {
    const { match, dispatch } = this.props;
    const { params } = match;
    const payload = {
      id: params.id,
    };
    dispatch({
      type: 'inventoryskulist/fetch',
      payload,
    });
  }
  componentDidMount() {
    this.load();
  }
  turnDetail(e) {}
  //单规格入库
  inventoryHandle(e) {
    const { match, dispatch } = this.props;
    const id = match.params['id'];
    const item = document.getElementById(e.target.dataset['key']);
    let inventoryMaps = [];
    inventoryMaps.push({
      key: item.dataset.inventory,
      specName: item.dataset.name,
      value: item.value,
    });
    let payload = {
      data: {
        inventoryMaps: inventoryMaps,
      },
      id: id,
    };
    if (!inventoryMaps || !inventoryMaps[0]) return message.error('请选择入库的商品');
    dispatch({
      type: 'inventoryskulist/update',
      payload,
    });
  }
  //批量入库
  inventoryAllHandle() {
    const { match, dispatch } = this.props;
    const id = match.params['id'];
    let formQueue = document.querySelectorAll('input[data-inventory]');
    let inventoryMaps = [];
    formQueue &&
      formQueue[0] &&
      formQueue.forEach(item => {
        inventoryMaps.push({
          key: item.dataset.inventory,
          specName: item.dataset.name,
          value: item.value,
        });
      });
    let payload = {
      data: {
        inventoryMaps: inventoryMaps,
      },
      id: id,
    };
    if (!inventoryMaps || !inventoryMaps[0]) return message.error('请选择入库的商品');
    dispatch({
      type: 'inventoryskulist/update',
      payload,
    });
    // message.success('成功')
  }

  render() {
    const { inventoryskulist, dispatch } = this.props;
    const { productSpecs, loading, products } = inventoryskulist;
    let list = [];
    let firstSpecType = productSpecs && productSpecs[0];
    let secondSpecType = firstSpecType && firstSpecType.subSpecs && firstSpecType.subSpecs[0];
    let thirdSpecType = secondSpecType && secondSpecType.subSpecs && secondSpecType.subSpecs[0];
    if (firstSpecType && !secondSpecType) list = list.concat(firstSpecType);
    if (secondSpecType && !thirdSpecType) list = list.concat(firstSpecType).concat(secondSpecType);
    if (thirdSpecType)
      list = list
        .concat(firstSpecType)
        .concat(secondSpecType)
        .concat(thirdSpecType);
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
    const callbackList = () => {
      dispatch(routerRedux.push('/shop/inventorylist'));
    };

    const skuheadlayout = {
      style: {
        width: '200px',
        height: '40px',
        lineHeight: '40px',
        float: 'left',
        textAlign: 'center',
      },
    };
    const skubodylayout = {
      style: {
        width: '160px',
        minHeight: '40px',
        textAlign: 'center',
      },
    };
    const skuColLayout = {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    };
    const skuthead = () => (
      <div style={{ height: '40px', backgroundColor: '#eee' }}>
        {list.map((item, i) => (
          <div {...skuheadlayout} key={i}>
            {item.specType}
          </div>
        ))}
        <div {...skuheadlayout}>库存</div>
        <div {...skuheadlayout}>入库</div>
      </div>
    );
    const skutbody = () => {
      /*
      * @一层
      */
      if (firstSpecType && !secondSpecType) {
        return (
          <div style={{ minHeight: '40px' }}>
            {productSpecs.map((first, firstNum) => {
              first.keys = 'inventorykeys__' + first.id;
              return (
                <div className={styles.firstSkuCol} key={firstNum}>
                  <div className={styles.firstSkuColItem}>{first.specName}</div>
                  <div className={styles.thirdSkuColItem}>{first.inventory}</div>
                  <div className={styles.thirdSkuColItem}>
                    <InputNumber
                      id={first.keys}
                      data-name={first.specName}
                      data-inventory={first.id}
                      className={styles.inputnumber}
                      min={0}
                    />
                    <Button data-key={first.keys} onClick={e => this.inventoryHandle(e)}>
                      确定
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      /*
      * @二层
      */
      if (secondSpecType && !thirdSpecType) {
        return (
          <div style={{ minHeight: '40px' }}>
            {productSpecs.map((first, firstNum) => (
              <div className={styles.firstSkuCol} key={firstNum}>
                <div className={styles.firstSkuColItem}>{first.specName}</div>
                <div>
                  {first.subSpecs.map((second, secondNum) => {
                    second.keys = 'inventorykeys__' + second.id;
                    return (
                      <div className={styles.secondSkuCol} key={secondNum}>
                        <div className={styles.thirdSkuColItem}>{second.specName}</div>
                        <div className={styles.thirdSkuColItem}>{second.inventory}</div>
                        <div className={styles.thirdSkuColItem} style={{ display: 'flex' }}>
                          <InputNumber
                            id={second.keys}
                            data-name={second.specName}
                            data-inventory={second.id}
                            className={styles.inputnumber}
                            min={0}
                          />
                          <Button data-key={second.keys} onClick={e => this.inventoryHandle(e)}>
                            确定
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      }
      /*
      * @三层
      */
      if (thirdSpecType) {
        return (
          <div style={{ minHeight: '40px' }}>
            {productSpecs.map((first, firstNum) => (
              <div className={styles.firstSkuCol} key={firstNum}>
                <div className={styles.firstSkuColItem}>{first.specName}</div>
                <div>
                  {first.subSpecs.map((second, secondNum) => (
                    <div className={styles.secondSkuCol} key={secondNum}>
                      <div className={styles.secondSkuColItem}>{second.specName}</div>
                      <div>
                        {second.subSpecs.map((third, thirdNum) => {
                          third.keys = 'inventorykeys__' + third.id;
                          return (
                            <div className={styles.thirdSkuCol} key={thirdNum}>
                              <div className={styles.thirdSkuColItem}>{third.specName}</div>
                              <div className={styles.thirdSkuColItem}>{third.inventory}</div>
                              <div className={styles.thirdSkuColItem} style={{ display: 'flex' }}>
                                <InputNumber
                                  id={third.keys}
                                  data-name={third.specName}
                                  data-inventory={third.id}
                                  className={styles.inputnumber}
                                  min={0}
                                />
                                <Button
                                  data-key={third.keys}
                                  onClick={e => this.inventoryHandle(e)}
                                >
                                  确定
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }
    };

    return (
      <div>
        <div className={styles.section} style={{ display: 'flex' }}>
          <h2>{inventoryskulist.name}</h2>
          <div style={{ marginLeft: '20px' }}>
            <Button onClick={callbackList}>返回列表</Button>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.slideContent}>
            <div className={styles.tableSection}>
              <Button onClick={() => this.inventoryAllHandle()} loading={loading}>
                批量入库
              </Button>
            </div>
            <div className={styles.skuTable}>
              <div>{skuthead()}</div>
              <div>{skutbody()}</div>
            </div>
          </div>
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
