import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';

const ORDER_SYS_URL = 'http://192.168.4.6:8008/v1/chief';

// ------------------ 请求订单信息---------------------

/**
 *  获取服务器客户订单列表
*/
export async function queryOrders() {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order`, {
    headers: {
      Authorization: accessToken,
    },
  });
}

/**
 * 获取服务器异常订单列表
 */
export async function queryExceptionOrders() {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order?is_type=1`, {
    headers: {
      Authorization: accessToken,
    },
  });
}

/**
 * 获取服务器订单详情
 */
export async function queryOrderDetail({ orderId }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}

