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
    const rawContent = this.props.defaultValue ? JSON.parse(this.props.defaultValue) : null; 
    const editorProps = {
      height: 500,
      placeholder: '请输入内容...',
      initialContent: rawContent,
      onChange: this.handleChange,
      onHTMLChange: this.handleHTMLChange,
      viewWrapper: '.demo',
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
        }, {
          type: 'dropdown',
          text: <span>下拉菜单</span>,
          component: <h1 style={{ width: 200, color: '#ffffff', padding: 10, margin: 0 }}>Hello World!</h1>,
        }, {
          type: 'modal',
          text: <span style={{ paddingRight: 10, paddingLeft: 10 }}>弹窗</span>,
          className: 'modal-button',
          modal: {
            id: 'test-modal',
            title: '这是一个弹出框',
            showClose: true,
            showCancel: true,
            showConfirm: true,
            confirmable: true,
            onConfirm: () => console.log(1),
            onCancel: () => console.log(2),
            onClose: () => console.log(3),
            children: (
              <div style={{ width: 480, height: 320, padding: 30 }}>
                {this.state.htmlContent}
              </div>
            ),
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
