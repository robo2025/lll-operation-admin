import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';


/**
 *  获取服务器产品列表
 *
*/
export async function queryProducts() {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/products`, {
    headers: {
      Authorization: acess_token,
    },
  });
}


/**
 * 添加产品信息
 *
 * @param {object} data 产品数据
*/
export async function addProduct({ data }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/products`, {
    method: 'post',
    headers: {
      Authorization: acess_token,
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
export async function modifyProduct({ data }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/products`, {
    method: 'put',
    headers: {
      Authorization: acess_token,
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
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/products/${productId}`, {
    method: 'get',
    headers: {
      Authorization: acess_token,
    },
  });
}


/**
 * 删除产品
 *
 * @param {array} ids 产品id数组
*/
export async function removeProducts({ ids }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/products`, {
    method: 'delete',
    headers: {
      Authorization: acess_token,
    },
    data: {
      ids,
    },
  });
}
