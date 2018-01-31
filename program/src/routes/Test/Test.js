import React from 'react';
import { verifyLogin } from '../../utils/tools';

class Test extends React.Component {
  componentDidMount() {
    console.log('测试页面加载好了!');
    verifyLogin();
  }

  render() {
    return (
      <div>跳转中...</div>
    );
  }
}
export default Test;
