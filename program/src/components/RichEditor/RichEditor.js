import React from 'react';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import styles from './rich-editor.less';

export default class RichEditor extends React.Component {
  state = {
    htmlContent: '',
  }

  handleChange = (content) => {
    // this.setState({ content });    
    console.log('content', content);
    if (this.props.onChange) {
      this.props.onChange(JSON.stringify(content));
    }
  }

  handleHTMLChange = (html) => {
    this.setState({ htmlContent: html });
    console.log('html', html);
  }

  render() {
    // 编辑器的初始内容,raw字符串
    const rawContent = this.props.defaultValue ? this.props.defaultValue : '""';
    const editorProps = {
      height: 500,
      placeholder: '请输入内容...',
      initialContent: rawContent.replace(/^("?)|("?)$/g, ''),
      onChange: this.handleChange,
      onHTMLChange: this.handleHTMLChange,
      contentFormat: 'html',
      viewWrapper: '.demo',
      disabled: this.props.disabled ? this.props.disabled : false,
      media: {
        image: true, // 开启图片插入功能
        video: true, // 开启视频插入功能
        audio: true, // 开启音频插入功能
      },
      // 增加自定义预览按钮
      extendControls: [
        {
          type: 'split',
        },
        {
          type: 'button',
          text: '预览',
          className: 'preview-button',
          onClick: () => {
            window.open().document.write(this.state.htmlContent);
          },
        },
      ],
    };

    return (
      <div className={`demo ${styles.demo}`}>
        <BraftEditor {...editorProps} />
      </div>
    );
  }
}
