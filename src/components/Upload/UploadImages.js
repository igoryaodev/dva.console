import React, { Component } from 'react';
import { message, Button } from 'antd';
import styles from './UploadImages.less';
import { queryUploadToken, addUploadUrl } from '../../services/api';

export default class UploadImages extends Component {
  state = {};

  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  createElementFile() {
    const input = document.createElement('input');
    const { uploads, onUploadChange, onUploadSkuChange, isSku, width, height } = this.props;
    const _props = this.props;
    const _key = this.props.name;
    let images = [];
    input.setAttribute('type', 'file');
    input.click();
    input.onchange = () => {
      const files = input.files;
      for (var i = 0; i < files.length; i++) {
        const _file = files[i];
        const name = _file && _file.name;
        if (!_file || !name) continue;
        queryUploadToken(name).then(data => {
          const _token = data.token;
          const param = new FormData(); // 创建form对象
          param.append('file', _file, name); // 通过append向form对象添加数据
          param.append('token', _token); // 添加form表单中其他数据
          addUploadUrl(param).then(data => {
            if (width) {
              if (width !== data.w) return message.error('上传图片尺寸（宽）有误');
              if (height !== data.h) return message.error('上传图片尺寸（高）有误');
            }
            const url = `http://7xkcpc.com2.z0.glb.qiniucdn.com/${data.url}`;
            images.push(url);
            let obj = {};
            obj[_key] = uploads || [];
            obj[_key] = obj[_key].concat(images);
            if (isSku == 1) {
              onUploadSkuChange({ props: _props, urls: obj });
            } else {
              onUploadChange(obj);
            }
          });
        });
      }
    };
  }
  /*
  * @
  */
  remove(e) {
    const { uploads, onUploadChange, onUploadSkuChange, isSku } = this.props;
    const _props = this.props;
    const _key = this.props.name;
    const data = e.target.dataset;
    let i = data.index;
    if (i == undefined) return;
    i = Number(i);
    let obj = {};
    obj[_key] = uploads || [];
    obj[_key] = obj[_key].splice(1, i);
    if (isSku == 1) {
      onUploadSkuChange({ props: _props, urls: obj });
    } else {
      onUploadChange(obj);
    }
  }

  render() {
    const { uploads, width, height } = this.props; // uploads => url
    const title = width ? `${width}x${height}` : '任意尺寸';
    const layout = {
      width: width ? width / 4 + 'px' : '150px',
      height: height ? height / 4 + 'px' : '150px',
    };

    return (
      <div className={styles.imageUpload}>
        <div className={styles.upload} style={layout} onClick={() => this.createElementFile()}>
          <span>{title}</span>
        </div>
        <div className={styles.imageswrap}>
          {uploads &&
            uploads[0] &&
            uploads.map((e, i) => (
              <div
                key={i}
                className={styles.imagesItem}
                style={{ display: e ? 'inline-block' : 'none' }}
              >
                <img style={{ width: '150px' }} src={e} alt="图" />
                <Button
                  className={styles.close}
                  size="small"
                  type="danger"
                  shape="circle"
                  icon="close"
                  data-index={i}
                  onClick={e => this.remove(e)}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }
}
