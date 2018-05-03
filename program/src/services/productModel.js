import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器产品型号列表
 *
*/
export async function queryProductModels({ params, offset = 0, limit = 10 }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/product_models?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`, {
    headers: {
      Authorization: acessToken,
    },
  });
}

/**
 * 新增产品型号
 *
 * @param {object} data 产品型号数据
*/
export async function addProductModel({ data }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/product_models`, {
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
 * 修改产品型号信息
 *
 * @param {object} data 产品信号数据
 *
*/
export async function modifyProductModel({ mno, data }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/product_models/${mno}`, {
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
 * --删除品牌
 *
 * @param {array} ids 产品型号数组
*/
export async function removeBrand({ bno }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/product_models/${bno}`, {
    method: 'delete',
    headers: {
      Authorization: acessToken,
    },
  });
}


/**
 * 获取产品型号详情
 *
 * @param {string} bno 品牌id
*/
export async function queryProductModelDetail({ mno }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/product_models/${mno}`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}
