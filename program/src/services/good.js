import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';


/**
 *  获取服务器商品列表
 *
*/
export async function queryGoods() {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/goods`, {
    headers: {
      Authorization: acess_token,
    },
  });
}


/**
 * 添加商品信息
 *
 * @param {object} data 商品数据
*/
export async function addGood({ data }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/goods`, {
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
 * 修改商品信息
 *
 * @param {object} data 商品数据
 *
*/
export async function modifyGood({ data }) {
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
 * 获取商品详情
 *
 * @param {number} productId 商品id
*/
export async function queryProductDetail({ productId }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/product/${productId}`, {
    method: 'get',
    headers: {
      Authorization: acess_token,
    },
  });
}


/**
 * 删除商品
 *
 * @param {array} ids 商品id数组
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
