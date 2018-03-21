import React from 'react';
import Cookies from 'js-cookie';
import { connect } from 'dva';
import { verifyLogin } from '../../utils/tools';
import { HOME_PAGE } from '../../constant/config';

@connect((state) => {
  return { ...state };
})
class Test extends React.Component {
  componentDidMount() {
    console.log('测试页面加载好了!');
    verifyLogin();
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
      success: (res) => { 
        Cookies.set('userinfo', JSON.stringify(res.data), { expires: 7 });        
        window.location.href = HOME_PAGE; 
      },
    });
  }

  render() {
    console.log(this.props);
    return (
      <div>跳转中...</div>
    );
  }
}
export default Test;
