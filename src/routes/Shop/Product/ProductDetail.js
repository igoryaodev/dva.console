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
import styles from './ProductDetail.less';
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

@connect(({ productdetail, loading }) => ({
  productdetail,
}))
@Form.create()
export default class ProductDetail extends Component {
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
    const { match, dispatch, productdetail } = this.props;
    const { params } = match;
    let payload = params;
    if(payload.id === 'undefined') return
    dispatch({
      type: 'productdetail/fetch',
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
          alert('qiniu');
          // const url = `http://7xkcpc.com2.z0.glb.qiniucdn.com/${data.url}`;
          // insertToEditor(that, url);
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

  routerBack(e) {
    this.props.dispatch(routerRedux.push('/shop/productlist'));
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
    let { productdetail } = this.props;
    let value = Number(e.target.value);
    productdetail.distribution = value;
    this.setState({
      productdetail: productdetail,
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
      let { productdetail } = this.props;
      productdetail.description = e;
      this.setState({
        productdetail: productdetail,
      });
    }
  }

  /*
  * @图片上传（单图）
  * @封面图
  */
  uploadChange(e) {
    const { productdetail } = this.props;
    if (e) {
      for (var attr in e) {
        productdetail[attr] = e[attr];
      }
      let obj = {
        productdetail,
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

  save(e) {
    e.preventDefault();
    const { productdetail, form, match, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;
    const { params } = match;
    const { id } = params;
    const { productSpecs, description } = productdetail;
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
          type: 'productdetail/update',
          payload,
        });
        // message.success("成功")
        // dispatch(routerRedux.push('/shop/seckilllist'));
      } else {
        let payload = value;
        payload['productSpecs'] = productSpecs;
        dispatch({
          type: 'productdetail/add',
          payload,
        });
        // message.success("成功")

        // dispatch(routerRedux.push('/shop/seckilllist'));
      }
    });
  }

  render() {
    const { productdetail, loading, form, match, dispatch } = this.props;
    console.log(JSON.stringify(productdetail));
    const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll, getFieldsError } = form;
    const { params } = match;
    const { modules } = this.state;
    const dateFormat = 'YYYY/MM/DD HH:mm:ss';
    const { result } = productdetail || '';
    /*
    * @规格列表头部弹性部分
    */
    const picUrl = '123';
    this.state.picUrl = picUrl || ''; //同步商品图

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

    return (
      <div>
        {result &&
          result.name && (
            <div>
              <div className={styles.section}>
                <div className={styles.headContent}>
                  <span className={styles.title}>{result.name}</span>
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
                          <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <FormItem label="状态">
                              <select value={result.status}>
                                <option value="0">下架</option>
                                <option value="1">上架</option>
                                <option value="2">上架不上线</option>
                              </select>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="名称">
                              {getFieldDecorator('name', {
                                initialValue: result.name,
                                rules: [{ required: true, message: '请输入名称' }],
                              })(<Input placeholder="请输入名称" />)}
                            </FormItem>
                          </Col>
                          <Col
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="name">
                              {getFieldDecorator('name', {
                                initialValue: result.nameEn,
                                rules: [{ required: true, message: 'name' }],
                              })(<Input placeholder="name" />)}
                            </FormItem>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <FormItem label="上架时间">
                              {getFieldDecorator('putawayTime', {
                                initialValue:
                                  result.putawayTime && moment(result.putawayTime, dateFormat),
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
                                  result.soldOutTime && moment(result.soldOutTime, dateFormat),
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
                          <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <FormItem label="配送方式">
                              <select
                                value={result.distribution}
                                onChange={e => this.distributionHandle(e)}
                              >
                                <option value="0">二维码</option>
                                <option value="1">配送</option>
                              </select>
                            </FormItem>
                          </Col>
                          <Col xl={{ span: 6 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <FormItem label="关联机构">
                              <select
                                value={result.distribution}
                                onChange={e => this.distributionHandle(e)}
                              >
                                <option value="0">二维码</option>
                                <option value="1">配送</option>
                              </select>
                            </FormItem>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col
                            className={styles.imageWrap}
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
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
                          <Col
                            className={styles.imageWrap}
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="标题图">
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
                          <Col
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="简介">
                              {getFieldDecorator('name', {
                                initialValue: result.brief,
                                rules: [{ required: true, message: '请输入简介' }],
                              })(<textarea className={styles.formControl} placeholder="简介" />)}
                            </FormItem>
                          </Col>
                          <Col
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="brief">
                              {getFieldDecorator('name', {
                                initialValue: result.briefEn,
                                rules: [{ required: true, message: 'brief' }],
                              })(<textarea className={styles.formControl} placeholder="brief" />)}
                            </FormItem>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="描述">
                              {/*getFieldDecorator('description', {
                              initialValue: productdetail.description || '',
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
                          <Col
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="description">
                              {/*getFieldDecorator('description', {
                              initialValue: productdetail.description || '',
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
                          <Col
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="温馨提示">
                              {getFieldDecorator('name', {
                                initialValue: result.prompt,
                                rules: [{ message: '请输入温馨提示' }],
                              })(<textarea className={styles.formControl} placeholder="简介" />)}
                            </FormItem>
                          </Col>
                          <Col
                            xl={{ span: 12, offset: 0 }}
                            lg={{ span: 12 }}
                            md={{ span: 12 }}
                            sm={24}
                          >
                            <FormItem label="prompt">
                              {getFieldDecorator('name', {
                                initialValue: result.promptEn,
                                rules: [{ message: 'prompt' }],
                              })(<textarea className={styles.formControl} placeholder="prompt" />)}
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
          )}
      </div>
    );
  }
}
