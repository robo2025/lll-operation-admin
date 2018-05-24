import Cookies from 'js-cookie';
import qs from 'qs';
import { ORDERS_URL } from '../constant/config';
import lyRequest from '../utils/lyRequest';

const ORDER_SYS_URL = `${ORDERS_URL}/v1/chief`;

// ------------------ 请求订单信息---------------------

/**
 *  获取服务器退货订单列表
*/
export async function queryReturns({ offset = 0, limit = 10, params = {} }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/returns/order?offset=${offset}&limit=${limit}&${qs.stringify(params)}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}

/**
 * 请求退货单详情
 */
export async function queryReturnsDetail({ returnId }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/returns/order/${returnId}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}

/**
 * 退货审核
 * 
 */
export async function queryReturnsAudit({ returnId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/returns/order/${returnId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}
