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
