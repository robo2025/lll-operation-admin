import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器产品列表
 *
*/
export async function queryProducts({ params, offset = 0, limit = 10 }) {
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
export async function modifyProduct({ pno, data }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products/${pno}`, {
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
 * @param {number} pno 产品ID编号
*/
export async function queryProductDetail({ pno }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products/${pno}`, {
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
