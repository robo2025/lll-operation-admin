import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器品牌列表
 *
*/
export async function queryBrands({ params, offset = 0, limit = 10 }) {
  return lyRequest(`${API_URL}/brands?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}


/**
 * 添加品牌信息
 *
 * @param {object} data 产品数据
*/
export async function addBrand({ data }) {
  return lyRequest(`${API_URL}/brands`, {
    method: 'post',
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
  return lyRequest(`${API_URL}/brands/${bno}`, {
    method: 'put',
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
  return lyRequest(`${API_URL}/brands/${bno}`, {
    method: 'delete',
  });
}


/**
 * 获取品牌详情
 *
 * @param {string} bno 品牌id
*/
export async function queryBrandDetail({ bno }) {
  return lyRequest(`${API_URL}/brands/${bno}`);
}

// 获取所有品牌列表：不做分页限制
export async function queryAllBrands() {
  return lyRequest(`${API_URL}/brands/all_brands`);
}
