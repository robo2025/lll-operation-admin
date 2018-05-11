import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';

/**
 *  测试服务器延迟
*/
export async function testTimeout() {
  const accessToken = Cookies.get('access_token');
  return lyRequest('http://unionpaytest.robo2025.com:8000/test?sleep_seconds=30', {
    headers: {
      Authorization: accessToken,
    },
  });
}
