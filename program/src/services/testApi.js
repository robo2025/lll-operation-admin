import lyRequest from '../utils/lyRequest';

/**
 *  测试服务器延迟
*/
export async function testTimeout() {
  return lyRequest('http://unionpaytest.robo2025.com:8000/test?sleep_seconds=30');
}
