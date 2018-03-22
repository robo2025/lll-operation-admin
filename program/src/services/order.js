import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';

const ORDER_SYS_URL = 'http://192.168.4.4:8009/v1/chief';
const SUPPLIER_SYS_URL = 'http://192.168.4.4:8009/v1/supplier';
const ORDER_URL = 'http://192.168.4.4:8009/v1/order';

// ------------------ 请求订单信息---------------------

/**
 *  获取服务器客户订单列表
*/
export async function queryOrders({ offset = 0, limit = 10 }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}


/**
 * 获取服务器异常订单列表
 */
export async function queryExceptionOrders({ offset = 0, limit = 10 }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order?is_type=1&offset=${offset}&limit=${limit}`, {
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

/**
 * 取消订单接口
 */
export async function queryCancelOrder({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'delete',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}

/**
 * 无货同意并退款接口
 */
export async function queryAgreeNoGood({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
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
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}


// 同意延期接口
export async function queryAgreeDelay({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}

// 驳回延期接口
export async function queryRejectDelay({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}

/**
 * 搜索接口
 * 
 */
export async function querySearchResults({ 
  guest_order_sn, pay_status, order_status, supplier_name, guest_company_name, start_time, end_time,
 }) {
  const guestOrderSN = guest_order_sn || '';
  const orderStatus = order_status || '';
  const payStatus = pay_status || '';
  const supplierName = supplier_name || '';
  const guestCompanyName = guest_company_name || '';
  const startTime = start_time || '';
  const endTime = end_time || '';

  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order?
  guest_order_sn=${guestOrderSN}&pay_status=${payStatus}&order_status=${orderStatus}&supplier_name=${supplierName}&guest_company_name=${guestCompanyName}&start_time=${startTime}&end_time=${endTime}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}
