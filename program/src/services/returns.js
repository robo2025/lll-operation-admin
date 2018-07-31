import qs from 'qs';
import { ORDERS_URL } from '../constant/config';
import lyRequest from '../utils/lyRequest';

const ORDER_SYS_URL = `${ORDERS_URL}/v1/chief`;

// ------------------ 请求订单信息---------------------

/**
 *  获取服务器退货订单列表
*/
export async function queryReturns({ offset = 0, limit = 10, params = {} }) {
  return lyRequest(`${ORDER_SYS_URL}/returns/order?offset=${offset}&limit=${limit}&${qs.stringify(params)}`);
}

/**
 * 请求退货单详情
 */
export async function queryReturnsDetail({ returnId }) {
  return lyRequest(`${ORDER_SYS_URL}/returns/order/${returnId}`);
}

/**
 * 退货审核
 * 
 */
export async function queryReturnsAudit({ returnId, data }) {
  return lyRequest(`${ORDER_SYS_URL}/returns/order/${returnId}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}
