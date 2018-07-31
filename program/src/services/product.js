import lyRequest from '../utils/lyRequest';
import { API_URL, OPERATION_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器产品列表
 *
*/
export async function queryProducts({ params, offset = 0, limit = 10 }) {
  return lyRequest(`${API_URL}/products?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

/**
 * 根据目录id,品牌id获取产品列表
 */
export async function queryProductsByParams({ params }) {
  return lyRequest(`${API_URL}/products/all?${queryString.toQueryString(params)}`);
}


/**
 * 添加产品信息
 *
 * @param {object} data 产品数据
*/
export async function addProduct({ data }) {
  return lyRequest(`${API_URL}/products`, {
    method: 'post',
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
  return lyRequest(`${API_URL}/products/${pno}`, {
    method: 'put',
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
  return lyRequest(`${API_URL}/products/${pno}`);
}


/**
 * 删除产品
 *
 * @param {array} ids 产品id数组
*/
export async function removeProducts({ pnos }) {
  return lyRequest(`${API_URL}/products`, {
    method: 'delete',
    data: {
      pnos,
    },
  });
}

/**
 * 供货信息
 *
 * @param {array} module 模块
*/
export async function querySupplyInfo({ productId }) {
  return lyRequest(`${API_URL}/goods?product_id=${productId}`);
}

/**
 * 产品操作日志
 *
 * @param {array} module 模块
*/
export async function queryOperationLog({ module, objectId, offset = 0, limit = 10 }) {
  return lyRequest(`${OPERATION_URL}/operationlogs?offset=${offset}&limit=${limit}&object_id=${objectId}`);
}

// 导出数据
export async function exportProduct({ params, fields }) {
  return lyRequest(`${API_URL}/product_reports?${queryString.toQueryString(params)}`, {
    method: 'post',
    data: {
      fields,
    },
  });
}
