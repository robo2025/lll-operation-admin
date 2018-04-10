import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器产品列表
 *
*/
export async function queryProducts({ params, offset = 0, limit = 10 }) {
  console.log('剩余参数--', params, queryString.toQueryString(params));
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`, {
    headers: {
      Authorization: acessToken,
    },
  });
}


/**
 * 添加产品信息
 *
 * @param {object} data 产品数据
*/
export async function addProduct({ data }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products`, {
    method: 'post',
    headers: {
      Authorization: acessToken,
    },
    data: {
      ...data,
    },
  });
}


/**
 * 修改产品信息
 *
 * @param {object} data 产品数据
 *
*/
export async function modifyProduct({ prdId, data }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products/${prdId}`, {
    method: 'put',
    headers: {
      Authorization: acessToken,
    },
    data: {
      ...data,
    },
  });
}

/**
 * 获取产品详情
 *
 * @param {number} productId 产品id
*/
export async function queryProductDetail({ productId }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products/${productId}`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}


/**
 * 删除产品
 *
 * @param {array} ids 产品id数组
*/
export async function removeProducts({ ids }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products`, {
    method: 'delete',
    headers: {
      Authorization: acessToken,
    },
    data: {
      ids,
    },
  });
}

/**
 * 供货信息
 *
 * @param {array} module 模块
*/
export async function querySupplyInfo({ productId }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods?product_id=${productId}`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}

/**
 * 产品操作日志
 *
 * @param {array} module 模块
*/
export async function queryOperationLog({ module, productId }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/operationlogs?module=${module}&object_id=${productId}`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}

// 导出数据
export async function exportProduct({ fields }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/product_reports`, {
    method: 'post',
    headers: {
      Authorization: acessToken,
    },
    data: {
      fields,
    },
  });
}
