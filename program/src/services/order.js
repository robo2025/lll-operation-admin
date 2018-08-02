import qs from 'qs';
import { ORDERS_URL } from '../constant/config';
import lyRequest from '../utils/lyRequest';

const ORDER_SYS_URL = `${ORDERS_URL}/v1/chief`;
// ------------------ 请求订单信息---------------------

/**
 *  获取服务器客户订单列表
*/
export async function queryOrders({ offset = 0, limit = 10 }) {
  return lyRequest(`${ORDER_SYS_URL}/order?offset=${offset}&limit=${limit}`);
}


/**
 * 获取服务器异常订单列表
 */
export async function queryExceptionOrders({ offset = 0, limit = 10 }) {
  return lyRequest(`${ORDER_SYS_URL}/order?is_type=1&offset=${offset}&limit=${limit}`);
}


/**
 * 获取服务器订单详情
 */
export async function queryOrderDetail({ orderId }) {
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`);
}

/**
 * 取消订单接口
 */
export async function queryCancelOrder({ orderId, data }) {
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'delete',
    data: {
      ...data,
    },
  });
}

/**
 * 无货同意并退款接口
 */
export async function queryAgreeNoGood({ orderId, data }) {
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}

/**
 * 无货驳回接口
 * 
 */
export async function queryRejectNoGood({ orderId, data }) {
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}


// 同意延期接口
export async function queryAgreeDelay({ orderId, data }) {
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}

// 驳回延期接口
export async function queryRejectDelay({ orderId, data }) {
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}

/**
 * 搜索接口
 * 
 */
export async function querySearchResults({ offset = 0, limit = 10, params }) {
  return lyRequest(`${ORDER_SYS_URL}/order?offset=${offset}&limit=${limit}&${qs.stringify(params)}`);
}
