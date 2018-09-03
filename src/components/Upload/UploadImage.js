import React, { Component } from 'react';
import { message } from 'antd';
import styles from './UploadImage.less';
import { queryUploadToken, addUploadUrl } from '../../services/api';

export default class UploadImage extends Component {
  state = {};

  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  createElementFile() {
    const input = document.createElement('input');
    const { onUploadChange, width, height, onUploadSkuChange, isSku } = this.props;
    const _props = this.props;
    const _key = this.props.name;
    input.setAttribute('type', 'file');
    input.click();
    input.onchange = () => {
      const _file = input.files[0];
      const { name } = _file;
      if (!_file || !name) return;
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
          let obj = {};
          obj[_key] = url;
          if (isSku == 1) {
            onUploadSkuChange({ props: _props, urls: obj });
          } else {
            onUploadChange(obj);
          }
        });
      });
    };
  }

  render() {
    const { uploads, width, height, miniImage } = this.props; // uploads => url
    let title = width ? `${width}x${height}` : '任意尺寸';
    let _class = styles.imageUpload;
    if (miniImage) {
      _class = styles.miniImage;
      title = width;
    }
    return (
      <div>
        <div className={_class} onClick={() => this.createElementFile()}>
          <span>{title}</span>
          <div>
            {uploads && (
              <img style={{ display: uploads ? 'block' : 'none' }} src={uploads} alt="封面图" />
            )}
          </div>
        </div>
      </div>
    );
  }
}
