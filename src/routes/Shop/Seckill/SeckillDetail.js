import { dateTimeFormat } from '../../../utils/utils';
import { queryUploadToken, addUploadUrl } from '../../../services/api';
import UploadImage from '../../../components/Upload/UploadImage';
import UploadImages from '../../../components/Upload/UploadImages';
import React, { Component } from 'react';
import { connect, message } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, DatePicker, Select, Button, Card, Col, Row, Modal } from 'antd';
import ReactQuill from 'react-quill';
import moment from 'moment';
// import Ueditors from '../../../components/Editor/Editor'

import 'react-quill/dist/quill.snow.css';
import styles from './SeckillDetail.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

@connect(({ seckilldetail, loading }) => ({
  seckilldetail,
}))
@Form.create()
export default class SeckillDetail extends Component {
  constructor(props) {
    super(props);
    this.handleQuillChange = this.handleQuillChange.bind(this);
  }
  state = {
    picUrl: '',
    skuType: 0,
    firstSku: '',
    firstProp: [],
    secondSku: '',
    secondProp: [],
    thirdSku: '',
    thirdProp: [],
    visible: false,
  };

  componentDidMount() {
    const { match, dispatch, seckilldetail } = this.props;
    const { params } = match;
    const payload = params;
    dispatch({
      type: 'seckilldetail/fetch',
      payload,
    });
    // 替换文件
    const insertToEditor = (that, url) => {
      const range = that.quillRef.getEditor().getSelection();
      that.quillRef.getEditor().insertEmbed(range.index, 'image', url);
    };
    // 上传到服务端
    const saveToServer = files => {
      let that = this;
      const _file = files;
      const { name } = _file;
      queryUploadToken(name).then(data => {
        const _token = data.token;
        const param = new FormData(); // 创建form对象
        param.append('file', _file, name); // 通过append向form对象添加数据
        param.append('token', _token); // 添加form表单中其他数据
        addUploadUrl(param).then(data => {
          const url = `http://7xkcpc.com2.z0.glb.qiniucdn.com/${data.url}`;
          insertToEditor(that, url);
        });
      });
    };

    // 图片校验
    const beforeUpload = (file, allType = ['jpg', 'png', 'jpeg'], maxSize = 5, type) => {
      let fileType = file.type;
      let { name } = file;
      if (!fileType) {
        fileType = name.split('.').pop();
      } else {
        fileType = fileType.split('/')[1];
      }
      const isJPG = allType.indexOf(fileType) > -1;
      if (!isJPG) {
        message.error('请上传正确的格式！');
        return false;
      }
      const isLt3M = file.size / 1024 / 1024 < maxSize;
      if (!isLt3M && isJPG) {
        message.error(`上传图片必须小于${maxSize}M!`);
        return false;
      }
      let isSuccess = isJPG && isLt3M;
      return isSuccess;
    };
    const imageHandler = (image, callback) => {
      const self = this;
      if (image) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.click();
        // Listen upload local image and save to server
        input.onchange = () => {
          const file = input.files[0];
          saveToServer(file);
        };
      }
    };
    const modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, true] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    };
    this.setState({
      id: params.id,
      modules: modules,
    });
  }

  skuEditHandle(e) {
    const _e = e.target;
    const _data = _e.dataset;
    const index = _data.index && Number(_data.index);
    const parent = _data.parent && Number(_data.parent);
    const grand = _data.grand && Number(_data.grand);
    const id = _data.id && Number(_data.id);
    const key = _data.key;
    const name = _data.name;
    let value = _e.value && Number(_e.value);
    const { seckilldetail } = this.props;
    const { productSpecs } = seckilldetail;
    let payload = seckilldetail;
    if (!key || !name) return;
    if (name === 'isEnable') {
      if (value === 1) value = true;
      else value = false;
    }
    switch (key) {
      case 'first':
        payload.productSpecs[index][name] = value;
        break;
      case 'second':
        payload.productSpecs[parent].subSpecs[index][name] = value;
        break;
      case 'third':
        payload.productSpecs[grand].subSpecs[parent].subSpecs[index][name] = value;
        break;
    }
    this.setState({
      seckilldetail: payload,
    });
  }

  routerBack(e) {
    this.props.dispatch(routerRedux.push('/shop/seckilllist'));
  }

  /*
  * @name
  */
  productTitle(e) {
    this.setState({
      name: e.target.value,
    });
  }
  /*
  * @上架时间
  */
  startTime(e) {
    if (!e || !e._d) return;

    const time = dateTimeFormat(e._d);
    this.setState({
      putawayTime: time,
    });
  }
  startTimeOk(e) {
    if (!e || !e._d) return;

    const time = dateTimeFormat(e._d);
    this.setState({
      putawayTime: time,
    });
  }
  /*
  * @下架时间
  */
  endTime(e) {
    if (!e || !e._d) return;
    const time = dateTimeFormat(e._d);
    this.setState({
      soldOutTime: time,
    });
  }
  endTimeOk(e) {
    if (!e || !e._d) return;

    const time = dateTimeFormat(e._d);
    this.setState({
      soldOutTime: time,
    });
  }
  /*
  * @
  *
  */
  showModal(e) {
    let _value = e.target.dataset.modal;
    this.setState({
      visible: _value,
    });
  }
  /*
  * @
  *
  */
  handleOk(e) {
    this.setState({
      visible: false,
    });
  }
  /*
  * @
  *
  */
  handleCancel(e) {
    this.setState({
      visible: false,
    });
  }
  /*
  * @配送方式
  */
  distributionHandle(e) {
    let { seckilldetail } = this.props;
    let value = Number(e.target.value);
    seckilldetail.distribution = value;
    this.setState({
      seckilldetail: seckilldetail,
    });
  }
  /*
  * @富文本
  */
  handleQuillChange(e) {
    this.setState({
      description: e,
    });
  }
  onQuillChange(e) {
    if (e) {
      let { seckilldetail } = this.props;
      seckilldetail.description = e;
      this.setState({
        seckilldetail: seckilldetail,
      });
    }
  }

  /*
  * @图片上传（单图）
  * @封面图
  */
  uploadChange(e) {
    const { seckilldetail } = this.props;
    if (e) {
      for (var attr in e) {
        seckilldetail[attr] = e[attr];
      }
      let obj = {
        seckilldetail,
      };
      Object.assign(obj, e);
      this.setState(obj);
    }
  }
  /*
  * @批量图片上传
  * @轮播图
  */
  uploadChanges(e) {
    if (e) {
      this.setState(e);
    }
  }
  /*
  * @图片上传（单图）
  * @规格标题图
  */
  uploadSkuSingleChange(obj) {
    if (!obj || !obj.urls) return;
    const { seckilldetail } = this.props;
    const { index, id, keys, name, parent, grand } = obj.props;
    if (!id || !keys || !name) return;
    let _urls = obj.urls[name];
    let payload = seckilldetail;
    let { productSpecs } = payload;
    switch (keys) {
      case 'first':
        productSpecs[index][name] = _urls;
        payload.productSpecs = productSpecs;
        return this.setState({ seckilldetail: payload });
      case 'second':
        productSpecs[parent].subSpecs[index][name] = _urls;
        payload.productSpecs = productSpecs;
        return this.setState({ seckilldetail: payload });
      case 'third':
        productSpecs[grand].subSpecs[parent].subSpecs[index][name] = _urls;
        payload.productSpecs = productSpecs;
        return this.setState({ seckilldetail: payload });
    }
  }
  /*
  * @批量图片上传
  * @规格轮播图
  */
  uploadSkuChanges(obj) {
    if (!obj || !obj.urls) return;
    const { seckilldetail } = this.props;
    const { index, id, keys, name, parent, grand } = obj.props;
    if (!id || !keys || !name) return;
    let _urls = obj.urls[name];
    if (_urls && _urls[[0]]) _urls = _urls.join(',');
    let payload = seckilldetail;
    let { productSpecs } = payload;
    switch (keys) {
      case 'first':
        productSpecs[index][name] = _urls;
        payload.productSpecs = productSpecs;
        return this.setState({ seckilldetail: payload });
      case 'second':
        productSpecs[parent].subSpecs[index][name] = _urls;
        payload.productSpecs = productSpecs;
        return this.setState({ seckilldetail: payload });
      case 'third':
        productSpecs[grand].subSpecs[parent].subSpecs[index][name] = _urls;
        payload.productSpecs = productSpecs;
        return this.setState({ seckilldetail: payload });
    }
  }
  /*
  * @新增规格
  * 新增主规格
  */
  addSkuHandle(e) {
    const { seckilldetail } = this.props;
    const { productSpecs } = seckilldetail;
    const firstSpecType = productSpecs && productSpecs[0];
    const secondSpecType = firstSpecType && firstSpecType.subSpecs && firstSpecType.subSpecs[0];
    const thirdSpecType = secondSpecType && secondSpecType.subSpecs && secondSpecType.subSpecs[0];
    if (!firstSpecType) this.setState({ skuType: 1 });
    if (firstSpecType && !secondSpecType) this.setState({ skuType: 2 });
    if (secondSpecType && !thirdSpecType) this.setState({ skuType: 3 });
  }
  /*
  * @新增规格
  * 新增规格属性
  */
  skuEditSubmit(e) {
    const { seckilldetail, params } = this.props;
    const { productSpecs } = seckilldetail;
    const firstSpecType = productSpecs && productSpecs[0];
    const secondSpecType = firstSpecType && firstSpecType.subSpecs && firstSpecType.subSpecs[0];
    const thirdSpecType = secondSpecType && secondSpecType.subSpecs && secondSpecType.subSpecs[0];
    const value = e.target.value;
    const key = e.target.dataset.key;
    const keynum = e.target.dataset.keynum && Number(e.target.dataset.keynum);
    let payload = seckilldetail;
    payload.productSpecs = payload.productSpecs || [];
    // debugger
    if (!key || !value) return;
    switch (key) { // 一层规格/主
      case 'firstSku':
        payload.productSpecs[0] = { specType: value };
        break;
      case 'first': // 一层规格/子
        if (!firstSpecType) return;
        if (!payload.productSpecs[0].specName) {
          // 新增
          payload.productSpecs[0].specName = value;
        } else {
          // 修改
          let cloneSpec, _subSpecs, __subSpecs;
          if (!secondSpecType) _subSpecs = null; // 一级规格
          if (secondSpecType && !thirdSpecType) {
            // 两级规格
            _subSpecs = [];
            for (var attr of firstSpecType.subSpecs) {
              _subSpecs.push({
                specName: attr.specName,
                specType: attr.specType,
              });
            }
          }
          if (secondSpecType && thirdSpecType) {
            // 三级规格
            __subSpecs = [];
            _subSpecs = [];
            for (var attr of secondSpecType.subSpecs) {
              __subSpecs.push({
                specName: attr.specName,
                specType: attr.specType,
              });
            }
            for (var attr of firstSpecType.subSpecs) {
              _subSpecs.push({
                specName: attr.specName,
                specType: attr.specType,
                subSpecs: __subSpecs,
              });
            }
          }
          cloneSpec = {
            specName: value,
            specType: firstSpecType.specType,
            subSpecs: _subSpecs,
          };
          payload.productSpecs.push(cloneSpec);
        }
        break;
      case 'secondSku':
        payload.productSpecs.forEach(e => (e.subSpecs = [{ specType: value }]));
        break;
      case 'second':
        payload.productSpecs.forEach(e => {
          if (e.subSpecs && e.subSpecs[0]) {
            if (!e.subSpecs[0].specName) {
              e.subSpecs[0].specName = value;
            } else {
              let cloneSpec,
                _subSpecs = null;
              if (thirdSpecType) {
                _subSpecs = [];
                for (var attr of secondSpecType.subSpecs) {
                  _subSpecs.push({
                    specName: attr.specName,
                    specType: attr.specType,
                  });
                }
              }
              cloneSpec = {
                specName: value,
                specType: secondSpecType.specType,
                subSpecs: _subSpecs,
              };
              if (e.subSpecs[0].specName) e.subSpecs.push(cloneSpec);
            }
          }
        });
        break;
      case 'thirdSku':
        payload.productSpecs.forEach(e => {
          e.subSpecs.forEach(item => (item.subSpecs = [{ specType: value }]));
        });
        break;
      case 'third':
        payload.productSpecs.forEach(e => {
          e.subSpecs.forEach(item => {
            if (item.subSpecs && item.subSpecs[0]) {
              if (!item.subSpecs[0].specName) {
                item.subSpecs[0].specName = value;
              } else {
                if (item.subSpecs[0].specName)
                  item.subSpecs.push({
                    specName: value,
                    specType: secondSpecType.specType,
                  });
              }
            }
          });
        });
        break;
    }
    this.setState({
      seckilldetail: payload,
    });
  }
  save(e) {
    e.preventDefault();
    const { seckilldetail, form, match, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;
    const { params } = match;
    const { id } = params;
    const { productSpecs, description } = seckilldetail;
    const that = this;
    validateFieldsAndScroll((err, value) => {
      value.putawayTime = value.putawayTime && dateTimeFormat(value.putawayTime);
      value.soldOutTime = value.soldOutTime && dateTimeFormat(value.soldOutTime);
      value.picUrl = that.state.picUrl;
      value.id = id;
      value.description = description;
      if (id && id > 0) {
        let payload = value;
        payload['productSpecs'] = productSpecs;
        dispatch({
          type: 'seckilldetail/update',
          payload,
        });
        // message.success("成功")
        // dispatch(routerRedux.push('/shop/seckilllist'));
      } else {
        let payload = value;
        payload['productSpecs'] = productSpecs;
        dispatch({
          type: 'seckilldetail/add',
          payload,
        });
        // message.success("成功")

        // dispatch(routerRedux.push('/shop/seckilllist'));
      }
    });
  }

  render() {
    const { seckilldetail, loading, form, match, dispatch } = this.props;
    const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll, getFieldsError } = form;
    const { params } = match;
    const { modules } = this.state;
    const dateFormat = 'YYYY/MM/DD HH:mm:ss';
    /*
    * @规格列表头部弹性部分
    */
    const { picUrl, productSpecs } = seckilldetail;
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
    // if(seckilldetail.distribution === 0 || seckilldetail.distribution === 1) seckilldetail.distribution = '"' + seckilldetail.distribution + '"'
    this.state.picUrl = picUrl; //同步商品图

    /*
    * @新增规格
    */
    // if(firstSpecType)

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    /*  
    * @规格编辑
    */
    const editSku = {
      xs: { span: 2, offset: 0 },
      xl: { span: 2, offset: 0 },
      lg: { span: 2, offset: 0 },
      md: { span: 2, offset: 0 },
      sm: { span: 2, offset: 0 },
      style: {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3c8dbc',
        margin: 10,
      },
    };
    const editSkuProp = {
      xs: { span: 2, offset: 0 },
      xl: { span: 2, offset: 0 },
      lg: { span: 2, offset: 0 },
      md: { span: 2, offset: 0 },
      sm: { span: 2, offset: 0 },
      style: {
        padding: '2px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00a65a',
        margin: 10,
        color: '#fff',
        borderRadius: 5,
        fontSize: 12,
      },
    };
    const addSkuProp = {
      xs: { span: 2, offset: 0 },
      xl: { span: 2, offset: 0 },
      lg: { span: 2, offset: 0 },
      md: { span: 2, offset: 0 },
      sm: { span: 2, offset: 0 },
      style: {
        padding: '2px 10px',
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f4',
        margin: 10,
        color: '#444',
        borderRadius: 5,
        fontSize: 12,
        border: '1px solid #ddd',
      },
    };
    const skuHeadLayout = {
      xs: { span: 2, offset: 0 },
      xl: { span: 2, offset: 0 },
      lg: { span: 2, offset: 0 },
      md: { span: 2, offset: 0 },
      sm: { span: 2, offset: 0 },
      style: {
        width: 160,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
        height: 53,
      },
    };
    const skuBodyLayout = {
      xs: { span: 2, offset: 0 },
      xl: { span: 2, offset: 0 },
      lg: { span: 2, offset: 0 },
      md: { span: 2, offset: 0 },
      sm: { span: 2, offset: 0 },
      style: {
        width: 160,
        border: '1px solid #eee',
        padding: 0,
        minHeight: 45,
        overFlow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
      },
    };
    const skuEditLayout = {
      xs: { span: 4, offset: 0 },
      xl: { span: 4, offset: 0 },
      lg: { span: 4, offset: 0 },
      md: { span: 4, offset: 0 },
      sm: { span: 4, offset: 0 },
      style: {
        width: 160,
        border: '1px solid #eee',
        padding: 0,
        minHeight: 45,
        overFlow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
      },
    };

    const skuEditCard = () => {
      firstSpecType;
      secondSpecType;
      thirdSpecType;
      return (
        <Col className={styles.skuEditCards}>
          {/*
            * @一层规格
            */}
          <Row gutter={16}>
            {firstSpecType && firstSpecType.specType ? (
              <Col {...editSku}>{firstSpecType.specType}</Col>
            ) : (
              this.state.skuType == 1 && (
                <Col {...skuEditLayout}>
                  <Input
                    placeholder="规格"
                    data-key="firstSku"
                    onBlur={e => this.skuEditSubmit(e)}
                  />
                </Col>
              )
            )}
          </Row>
          <Row gutter={16}>
            {firstSpecType &&
              firstSpecType.specName &&
              productSpecs.map((first, firstNum) => (
                <Col {...editSkuProp} key={firstNum}>
                  {first.specName}
                </Col>
              ))}
            <Col>
              {firstSpecType && (
                <Col {...skuEditLayout}>
                  <Input placeholder="规格" data-key="first" onBlur={e => this.skuEditSubmit(e)} />
                  {/*<a icon="plus">添加</a>*/}
                </Col>
              )}
            </Col>
          </Row>
          {/*
            * @二层规格
            */}
          <Row gutter={16}>
            {secondSpecType && secondSpecType.specType ? (
              <Col {...editSku}>{secondSpecType.specType}</Col>
            ) : (
              firstSpecType &&
              this.state.skuType === 2 && (
                <Col {...skuEditLayout}>
                  <Input
                    placeholder="规格"
                    data-key="secondSku"
                    onBlur={e => this.skuEditSubmit(e)}
                  />
                </Col>
              )
            )}
          </Row>
          <Row gutter={16}>
            {secondSpecType &&
              secondSpecType.specName &&
              firstSpecType.subSpecs.map((second, secondNum) => (
                <Col {...editSkuProp} key={secondNum}>
                  {second.specName}
                </Col>
              ))}

            <Col>
              {secondSpecType && (
                <Col {...skuEditLayout}>
                  <Input placeholder="规格" data-key="second" onBlur={e => this.skuEditSubmit(e)} />
                  <a icon="plus">添加</a>
                </Col>
              )}
            </Col>
          </Row>
          {/*
            * @三层规格
            */}
          <Row gutter={16}>
            {thirdSpecType && thirdSpecType.specType ? (
              <Col {...editSku}>{thirdSpecType.specType}</Col>
            ) : (
              secondSpecType &&
              this.state.skuType === 3 && (
                <Col {...skuEditLayout}>
                  <Input
                    placeholder="规格"
                    data-key="thirdSku"
                    onBlur={e => this.skuEditSubmit(e)}
                  />
                </Col>
              )
            )}
          </Row>
          <Row gutter={16}>
            {thirdSpecType &&
              thirdSpecType.specName &&
              secondSpecType.subSpecs.map((third, thirdNum) => (
                <Col {...editSkuProp} key={thirdNum}>
                  {third.specName}
                </Col>
              ))}
            <Col>
              {thirdSpecType && (
                <Col {...skuEditLayout}>
                  <Input placeholder="规格" data-key="third" onBlur={e => this.skuEditSubmit(e)} />
                  <a icon="plus">添加</a>
                </Col>
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            {(!firstSpecType || !secondSpecType || !thirdSpecType) && (
              <Col {...addSkuProp} onClick={e => this.addSkuHandle(e)}>
                新增
              </Col>
            )}
          </Row>
        </Col>
      );
    };
    const skuHead = () => {
      return (
        <div style={{ minHeight: '40px' }}>
          <div className={styles.firstSkuCol}>
            {list &&
              list[0] &&
              list.map((item, i) => (
                <div className={styles.thirdSkuColItem} key={i}>
                  {item.specType}
                </div>
              ))}
            <div className={styles.thirdSkuColItem}>价格</div>
            <div className={styles.thirdSkuColItem}>会员</div>
            <div className={styles.thirdSkuColItem}>活动价</div>
            <div className={styles.thirdSkuColItem}>运费</div>
            <div className={styles.thirdSkuColItem}>库存</div>
            <div className={styles.thirdSkuColItem}>状态</div>
            <div className={styles.thirdSkuColItem}>轮播图</div>
            <div className={styles.thirdSkuColItem}>标题图(200x200)</div>
          </div>
        </div>
      );
    };
    const skuBody = () => {
      /*
      * @一层规格
      */
      if (firstSpecType && !secondSpecType) {
        return (
          <div style={{ minHeight: '40px' }}>
            {productSpecs.map((first, firstNum) => {
              let swipers = [];
              let swipersLength = 0;
              let isEnable = 0;
              let firstmodal = 'first' + firstNum + first.id;
              if (first.isEnable) isEnable = 1;
              else isEnable = 0;
              if (first.picUrl && typeof first.picUrl == 'string')
                swipers = first.picUrl.split(',');
              swipersLength = swipers.length;
              return (
                <div className={styles.firstSkuCol} key={firstNum}>
                  <div className={styles.firstSkuColItem}>{first.specName}</div>
                  <div className={styles.thirdSkuColItem}>
                    <Input
                      data-skuedit
                      data-price
                      data-index={firstNum}
                      data-parent={0}
                      data-grand={0}
                      data-key="first"
                      data-name="price"
                      data-id={first.id}
                      onChange={e => this.skuEditHandle(e)}
                      className={styles.inputNumber}
                      defaultValue={first.price}
                    />
                  </div>
                  <div className={styles.thirdSkuColItem}>
                    <Input
                      data-skuedit
                      data-vipprice
                      data-index={firstNum}
                      data-parent={0}
                      data-grand={0}
                      data-key="first"
                      data-name="vipPrice"
                      data-id={first.id}
                      onChange={e => this.skuEditHandle(e)}
                      className={styles.inputNumber}
                      defaultValue={first.vipPrice}
                    />
                  </div>
                  <div className={styles.thirdSkuColItem}>
                    <Input
                      data-skuedit
                      data-activityprice
                      data-index={firstNum}
                      data-parent={0}
                      data-grand={0}
                      data-key="first"
                      data-name="activityPrice"
                      data-id={first.id}
                      onChange={e => this.skuEditHandle(e)}
                      className={styles.inputNumber}
                      defaultValue={first.activityPrice}
                    />
                  </div>
                  <div className={styles.thirdSkuColItem}>
                    <Input
                      data-skuedit
                      data-distributionprice
                      data-index={firstNum}
                      data-parent={0}
                      data-grand={0}
                      data-key="first"
                      data-name="distributionPrice"
                      data-id={first.id}
                      onChange={e => this.skuEditHandle(e)}
                      className={styles.inputNumber}
                      defaultValue={first.distributionPrice}
                    />
                  </div>
                  <div className={styles.thirdSkuColItem}>{first.inventory}</div>
                  <div className={styles.thirdSkuColItem}>
                    <select
                      className={styles.inputNumber}
                      data-skuedit
                      data-isenable
                      data-index={firstNum}
                      data-parent={0}
                      data-grand={0}
                      data-key="first"
                      data-name="isEnable"
                      data-id={first.id}
                      onChange={e => this.skuEditHandle(e)}
                      defaultValue={isEnable}
                    >
                      <option value="1">开启</option>
                      <option value="0">关闭</option>
                    </select>
                  </div>
                  <div className={styles.thirdSkuColItem}>
                    <div
                      style={{ color: '#1890ff', cursor: 'pointer' }}
                      data-modal={firstmodal}
                      onClick={e => this.showModal(e)}
                    >
                      详情({swipersLength})
                    </div>
                    <Modal
                      title={first.specName}
                      visible={firstmodal == this.state.visible ? true : false}
                      onCancel={e => this.handleCancel(e)}
                      footer={null}
                    >
                      <div>
                        <UploadImages
                          width="600"
                          height="288"
                          index={firstNum}
                          parent={0}
                          grand={0}
                          keys="first"
                          name="picUrl"
                          id={first.id}
                          uploads={swipers}
                          isSku="1"
                          onUploadSkuChange={e => this.uploadSkuChanges(e)}
                        />
                      </div>
                    </Modal>
                  </div>
                  <div className={styles.thirdSkuColItem}>
                    <UploadImage
                      index={firstNum}
                      parent={0}
                      grand={0}
                      keys="first"
                      id={first.id}
                      isSku="1"
                      miniImage="miniImage"
                      name="orderPicUrl"
                      width="200"
                      height="200"
                      uploads={first.orderPicUrl}
                      onUploadSkuChange={e => this.uploadSkuSingleChange(e)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      /*
      * @二层规格
      */
      if (secondSpecType && !thirdSpecType) {
        return (
          <div style={{ minHeight: '40px' }}>
            {productSpecs.map((first, firstNum) => (
              <div className={styles.firstSkuCol} key={firstNum}>
                <div className={styles.firstSkuColItem}>{first.specName}</div>
                <div>
                  {first.subSpecs.map((second, secondNum) => {
                    let swipers = [];
                    let swipersLength = 0;
                    let isEnable = 0;
                    let firstmodal = 'second' + secondNum + second.id;
                    if (second.isEnable) isEnable = 1;
                    else isEnable = 0;
                    if (second.picUrl && typeof second.picUrl == 'string')
                      swipers = second.picUrl.split(',');
                    swipersLength = swipers.length;
                    return (
                      <div className={styles.secondSkuCol} key={secondNum}>
                        <div className={styles.thirdSkuColItem}>{second.specName}</div>
                        <div className={styles.thirdSkuColItem}>
                          <Input
                            data-skuedit
                            data-price
                            data-index={secondNum}
                            data-parent={firstNum}
                            data-grand={0}
                            data-key="second"
                            data-name="price"
                            data-id={second.id}
                            onChange={e => this.skuEditHandle(e)}
                            className={styles.inputNumber}
                            defaultValue={second.price}
                          />
                        </div>
                        <div className={styles.thirdSkuColItem}>
                          <Input
                            data-skuedit
                            data-vipprice
                            data-index={secondNum}
                            data-parent={firstNum}
                            data-grand={0}
                            data-key="second"
                            data-name="vipPrice"
                            data-id={second.id}
                            onChange={e => this.skuEditHandle(e)}
                            className={styles.inputNumber}
                            defaultValue={second.vipPrice}
                          />
                        </div>
                        <div className={styles.thirdSkuColItem}>
                          <Input
                            data-skuedit
                            data-activityprice
                            data-index={secondNum}
                            data-parent={firstNum}
                            data-grand={0}
                            data-key="second"
                            data-name="activityPrice"
                            data-id={second.id}
                            onChange={e => this.skuEditHandle(e)}
                            className={styles.inputNumber}
                            defaultValue={second.activityPrice}
                          />
                        </div>
                        <div className={styles.thirdSkuColItem}>
                          <Input
                            data-skuedit
                            data-distributionprice
                            data-index={secondNum}
                            data-parent={firstNum}
                            data-grand={0}
                            data-key="second"
                            data-name="distributionPrice"
                            data-id={second.id}
                            onChange={e => this.skuEditHandle(e)}
                            className={styles.inputNumber}
                            defaultValue={second.distributionPrice}
                          />
                        </div>
                        <div className={styles.thirdSkuColItem}>{second.inventory}</div>
                        <div className={styles.thirdSkuColItem}>
                          <select
                            className={styles.inputNumber}
                            data-skuedit
                            data-isenable
                            data-index={secondNum}
                            data-parent={firstNum}
                            data-grand={0}
                            data-key="second"
                            data-name="isEnable"
                            data-id={second.id}
                            onChange={e => this.skuEditHandle(e)}
                            defaultValue={isEnable}
                          >
                            <option value="1">开启</option>
                            <option value="0">关闭</option>
                          </select>
                        </div>
                        <div className={styles.thirdSkuColItem}>
                          <div
                            style={{ color: '#1890ff', cursor: 'pointer' }}
                            data-modal={firstmodal}
                            onClick={e => this.showModal(e)}
                          >
                            详情({swipersLength})
                          </div>
                          <Modal
                            title={second.specName}
                            visible={firstmodal == this.state.visible ? true : false}
                            onCancel={e => this.handleCancel(e)}
                            footer={null}
                          >
                            <div>
                              <UploadImages
                                width="600"
                                height="288"
                                index={secondNum}
                                parent={firstNum}
                                grand={0}
                                keys="second"
                                name="picUrl"
                                id={second.id}
                                uploads={swipers}
                                isSku="1"
                                onUploadSkuChange={e => this.uploadSkuChanges(e)}
                              />
                            </div>
                          </Modal>
                        </div>
                        <div className={styles.thirdSkuColItem}>
                          <UploadImage
                            index={secondNum}
                            parent={firstNum}
                            grand={0}
                            keys="second"
                            id={second.id}
                            isSku="1"
                            miniImage="miniImage"
                            name="orderPicUrl"
                            width="200"
                            height="200"
                            uploads={second.orderPicUrl}
                            onUploadSkuChange={e => this.uploadSkuSingleChange(e)}
                          />
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
      * @三层规格
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
                          let swipers = [];
                          let swipersLength = 0;
                          let isEnable = 0;
                          let firstmodal = 'third' + thirdNum + third.id;
                          if (third.isEnable) isEnable = 1;
                          else isEnable = 0;
                          if (third.picUrl && typeof third.picUrl == 'string')
                            swipers = third.picUrl.split(',');
                          swipersLength = swipers.length;
                          return (
                            <div className={styles.thirdSkuCol} key={thirdNum}>
                              <div className={styles.thirdSkuColItem}>{third.specName}</div>

                              <div className={styles.thirdSkuColItem}>
                                <Input
                                  data-skuedit
                                  data-price
                                  data-index={thirdNum}
                                  data-parent={secondNum}
                                  data-grand={firstNum}
                                  data-key="third"
                                  data-name="price"
                                  data-id={third.id}
                                  onChange={e => this.skuEditHandle(e)}
                                  className={styles.inputNumber}
                                  defaultValue={third.price}
                                />
                              </div>
                              <div className={styles.thirdSkuColItem}>
                                <Input
                                  data-skuedit
                                  data-vipprice
                                  data-index={thirdNum}
                                  data-parent={secondNum}
                                  data-grand={firstNum}
                                  data-key="third"
                                  data-name="vipPrice"
                                  data-id={third.id}
                                  onChange={e => this.skuEditHandle(e)}
                                  className={styles.inputNumber}
                                  defaultValue={third.vipPrice}
                                />
                              </div>
                              <div className={styles.thirdSkuColItem}>
                                <Input
                                  data-skuedit
                                  data-activityprice
                                  data-index={thirdNum}
                                  data-parent={secondNum}
                                  data-grand={firstNum}
                                  data-key="third"
                                  data-name="activityPrice"
                                  data-id={third.id}
                                  onChange={e => this.skuEditHandle(e)}
                                  className={styles.inputNumber}
                                  defaultValue={third.activityPrice}
                                />
                              </div>
                              <div className={styles.thirdSkuColItem}>
                                <Input
                                  data-skuedit
                                  data-distributionprice
                                  data-index={thirdNum}
                                  data-parent={secondNum}
                                  data-grand={firstNum}
                                  data-key="third"
                                  data-name="distributionPrice"
                                  data-id={third.id}
                                  onChange={e => this.skuEditHandle(e)}
                                  className={styles.inputNumber}
                                  defaultValue={third.distributionPrice}
                                />
                              </div>
                              <div className={styles.thirdSkuColItem}>{third.inventory}</div>
                              <div className={styles.thirdSkuColItem}>
                                <select
                                  className={styles.inputNumber}
                                  data-skuedit
                                  data-isenable
                                  data-index={thirdNum}
                                  data-parent={secondNum}
                                  data-grand={firstNum}
                                  data-key="third"
                                  data-name="isEnable"
                                  data-id={third.id}
                                  onChange={e => this.skuEditHandle(e)}
                                  defaultValue={isEnable}
                                >
                                  <option value="1">开启</option>
                                  <option value="0">关闭</option>
                                </select>
                              </div>
                              <div className={styles.thirdSkuColItem} style={{ display: 'flex' }}>
                                <div
                                  style={{ color: '#1890ff', cursor: 'pointer' }}
                                  data-modal={firstmodal}
                                  onClick={e => this.showModal(e)}
                                >
                                  详情({swipersLength})
                                </div>
                                <Modal
                                  title={third.specName}
                                  visible={firstmodal == this.state.visible ? true : false}
                                  onCancel={e => this.handleCancel(e)}
                                  footer={null}
                                >
                                  <div>
                                    <UploadImages
                                      width="600"
                                      height="288"
                                      index={thirdNum}
                                      parent={secondNum}
                                      grand={firstNum}
                                      keys="third"
                                      name="picUrl"
                                      id={third.id}
                                      uploads={swipers}
                                      isSku="1"
                                      onUploadSkuChange={e => this.uploadSkuChanges(e)}
                                    />
                                  </div>
                                </Modal>
                              </div>
                              <div className={styles.thirdSkuColItem}>
                                <UploadImage
                                  index={thirdNum}
                                  parent={secondNum}
                                  grand={firstNum}
                                  keys="third"
                                  id={third.id}
                                  isSku="1"
                                  miniImage="miniImage"
                                  name="orderPicUrl"
                                  width="200"
                                  height="200"
                                  uploads={third.orderPicUrl}
                                  onUploadSkuChange={e => this.uploadSkuSingleChange(e)}
                                />
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
        <div className={styles.section}>
          <div className={styles.headContent}>
            <span className={styles.title}>{seckilldetail.name}</span>
            <Button type="default" onClick={e => this.routerBack(e)}>
              返回列表
            </Button>
          </div>
        </div>
        <div className={styles.section}>
          <div>
            <Card bordered={false}>
              <Card className={styles.card} bordered={false}>
                <Form
                  layout="vertical"
                  onSubmit={this.handleSubmit}
                  hideRequiredMark
                  style={{ marginTop: 8 }}
                >
                  <Row gutter={16}>
                    <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                      <FormItem label="名称">
                        {getFieldDecorator('name', {
                          initialValue: seckilldetail.name,
                          rules: [{ required: true, message: '请输入名称' }],
                        })(<Input placeholder="请输入名称" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                      <FormItem label="上架时间">
                        {getFieldDecorator('putawayTime', {
                          initialValue:
                            seckilldetail.putawayTime &&
                            moment(seckilldetail.putawayTime, dateFormat),
                        })(
                          <DatePicker
                            showTime
                            placeholder="请输入上架时间"
                            format={dateFormat}
                            onChange={e => this.startTime(e)}
                            onOk={e => this.startTimeOk(e)}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                      <FormItem label="下架时间">
                        {getFieldDecorator('soldOutTime', {
                          initialValue:
                            seckilldetail.soldOutTime &&
                            moment(seckilldetail.soldOutTime, dateFormat),
                        })(
                          <DatePicker
                            showTime
                            placeholder="请输入下架时间"
                            format={dateFormat}
                            onChange={e => this.endTime(e)}
                            onOk={e => this.endTimeOk(e)}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                      <FormItem label="名称">
                        <select
                          value={seckilldetail.distribution}
                          onChange={e => this.distributionHandle(e)}
                        >
                          <option value="0">二维码</option>
                          <option value="1">配送</option>
                        </select>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <FormItem label="规格">{skuEditCard()}</FormItem>
                  </Row>
                  {/*<Row>
                    <FormItem label="批量操作">
                      <div>
                        <UploadImages 
                        name="urls"
                        width="600"
                        height="288"
                        uploads={this.state.urls}
                        onUploadChange={e => this.uploadChanges(e)}
                        />
                      </div>
                    </FormItem>
                  </Row>*/}
                  <Row className={styles.table} gutter={16}>
                    <Col className={styles.tableRow}>
                      <Row gutter={16}>
                        <Col>
                          <FormItem>{skuHead()}</FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <FormItem>{skuBody()}</FormItem>
                      </Row>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col className={styles.imageWrap}>
                      <FormItem label="封面图">
                        <UploadImage
                          name="picUrl"
                          width="600"
                          height="288"
                          uploads={this.state.picUrl}
                          onUploadChange={e => this.uploadChange(e)}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col>
                      <FormItem label="描述">
                        {/*getFieldDecorator('description', {
                          initialValue: seckilldetail.description || '',
                        })(<ReactQuill
                            value={richValue} 
                            onChange={this.handleChange.bind(this)}
                            className="quillMail"
                            modules={modules} 
                            formats={formats} />)
                        */}
                        <ReactQuill
                          onChange={e => this.onQuillChange(e)}
                          className="quillMail"
                          modules={modules}
                          ref={el => (this.quillRef = el)}
                          formats={formats}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col>
                      <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                        <Button
                          type="primary"
                          onClick={e => this.save(e)}
                          loading={loading}
                          style={{ with: '100%' }}
                        >
                          提交
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
