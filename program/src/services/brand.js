import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器品牌列表
 *
*/
export async function queryBrands({ params, offset = 0, limit = 10 }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/brands?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`, {
    headers: {
      Authorization: acessToken,
    },
  });
}


/**
 * 添加品牌信息
 *
 * @param {object} data 产品数据
*/
export async function addBrand({ data }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/brands`, {
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
 * 修改品牌信息
 *
 * @param {object} data 品牌数据
 *
*/
export async function modifyBrand({ bno, data }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/brands/${bno}`, {
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
 * 删除品牌
 *
 * @param {array} ids 产品id数组
*/
export async function removeBrand({ bno }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/brands/${bno}`, {
    method: 'delete',
    headers: {
      Authorization: acessToken,
    },
  });
}


/**
 * 获取品牌详情
 *
 * @param {string} productId 品牌id
*/
export async function queryBrandDetail({ bno }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/brands/${bno}`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}

// 获取所有品牌列表：不做分页限制
export async function queryAllBrands() {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/brands/all_brands`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}
