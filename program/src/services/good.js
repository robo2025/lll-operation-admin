import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL, OPERATION_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器商品列表
 *
*/
export async function queryGoods({ params, offset = 0, limit = 10 }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`, {
    headers: {
      Authorization: acessToken,
    },
  });
}

/**
 * 商品上上下架
 * @param {string=} gno 商品ID
 * @param {string=} GoodStatus 商品状态 [0,下架，1,上架]
 * 
 */
export async function modifyGoodStatus({ gno, params }) {
    console.log('params',params);
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods/${gno}/publish_status`, {
    method: 'put',
    headers: {
      Authorization: acessToken,
    },
    data:params,
  });
}


/**
 * 修改商品信息[审核]
 *
 * @param {string} gno 商品唯一ID
 * @param {object} data 商品数据
 *
*/
export async function modifyGoodInfo({ gno, data }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods/${gno}`, {
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
 * 获取商品详情
 *
 * @param {number} gno 商品id
*/
export async function queryGoodDetail({ gno }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods/${gno}`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}


/**
 * 商品操作日志
 *
 * @param {array} ids 商品id数组
*/
export async function queryOperationLog({ module, gno }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${API_URL}/operationlogs?module=${module}&object_id=${gno}`, {
    method: 'get',
    headers: {
      Authorization: acessToken,
    },
  });
}

// 导出数据
export async function exportGood({ params,fields }) {
  const acessToken = Cookies.get('access_token');
  return lyRequest(`${OPERATION_URL}/operation/goods_reports?${queryString.toQueryString(params)}`, {
    method: 'post',
    headers: {
      Authorization: acessToken,
    },
    data: {
      fields,
    },
  });
}
