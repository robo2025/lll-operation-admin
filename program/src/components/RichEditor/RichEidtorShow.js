import React, { Component } from 'react';

import styles from './richEditorShow.less';

export default class RichEditorShow extends Component {
  render() {
    const { content } = this.props;
    const isHtml = /<\/\S+>/.test(content);
    return (
      <div
        className={styles['rich-text']}
        dangerouslySetInnerHTML={{ __html: isHtml ? content : `<pre>${content}</pre>` }}
      />
    );
  }
}
