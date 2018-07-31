import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';
import { queryString } from '../utils/tools';

/**
 *  获取服务器产品型号列表
 *
 */
export async function queryProductModels({ params, offset = 0, limit = 10 }) {
  return lyRequest(
    `${API_URL}/product_models?offset=${offset}&limit=${limit}&${queryString.toQueryString(
      params
    )}`
  );
}

/**
 * 新增产品型号
 *
 * @param {object} data 产品型号数据
 */
export async function addProductModel({ data }) {
  return lyRequest(`${API_URL}/product_models`, {
    method: 'post',
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
  return lyRequest(`${API_URL}/product_models/${mno}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}

/**
 * --删除产品型号
 *
 * @param {array} mnos 产品型号数组
 */
export async function removeProductModels({ mnos }) {
  return lyRequest(`${API_URL}/product_models`, {
    method: 'delete',
    data: {
      mnos,
    },
  });
}

/**
 * 获取产品型号详情
 *
 * @param {string} bno 品牌id
 */
export async function queryProductModelDetail({ mno }) {
  return lyRequest(`${API_URL}/product_models/${mno}`);
}

// 导出产品型号数据

export async function exportProductModal({ params, fields }) {
  return lyRequest(
    `${API_URL}/product_model_reports?${queryString.toQueryString(params)}`,
    {
      method: 'post',
      data: {
        fields,
      },
    }
  );
}
