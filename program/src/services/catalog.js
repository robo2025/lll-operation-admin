import qs from 'qs';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';

// 获取服务器目录信息
export async function queryCatalog({ pid = 0 }) {
  return lyRequest(`${API_URL}/product_categories?pid=${pid}`);
}

// 获取级联目录
export async function queryCatalogLevel({ pid = 0 }) {
  return lyRequest(`${API_URL}/product_categories/level_selection?pid=${pid}`);  
}

/**
 * 添加目录信息
 *
 * @param {number} pid 父目录id (一级目录为 0)
 * @param {string} name 目录名称
 * @param {number} isActive 是否启用 （0:禁用 1:启用）
 * @param  {string=} desc 目录说明(可选)
*/
export async function addCatalog({ data }) {
  return lyRequest(`${API_URL}/product_categories`, {
    method: 'post',
    data: {
      ...data,
    },
  });
}


/**
 * 修改目录信息
 *
 * @param {number} categoryId 目录id (一级目录为 0)
 * @param {string} name 目录名称
 * @param {number} isActive 是否启用 （0:禁用 1:启用）
 * @param  {string=} desc 目录说明(可选)
*/
export async function modifyCatalog({ categoryId, data }) {
  return lyRequest(`${API_URL}/product_categories/${categoryId}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}

/**
 * 更改目录状态，是否启用
 *
 * @param {number} categoryId 目录id (一级目录为 0)
 * @param {number} isActive 是否启用 （0:禁用 1:启用）
*/
export async function modifyCatalogStatus({ categoryId, isActive }) {
  return lyRequest(`${API_URL}/product_categories/${categoryId}/active_status`, {
    method: 'put',
    data: {
      is_active: isActive,
    },
  });
}


/**
 * 删除目录
 *
 * @param {number} categoryId 目录id (一级目录为 0)
*/
export async function removeCatalog({ categoryId }) {
  return lyRequest(`${API_URL}/product_categories/${categoryId}`, {
    method: 'delete',
  });
}


/**
 * 修改目录排序号
 *
 * @param {string} level 目录级别
 * @param {object} data  排序号 （按升序排序）
*/
export async function sortCatalog({ level, data }) {
  return lyRequest(`${API_URL}/product_categories/level_sort`, {
    method: 'put',
    data: {
      level, 
      data,
    },
  });
}

// 请求目录参数列表
export async function getCatalogSpecs({ categoryId, params = {} }) {
  return lyRequest(`${API_URL}/product_categories/${categoryId}/specs?${qs.stringify(params)}`);  
}

// 修改产品目录参数
export async function modifyCatalogSpecs({ categoryId, specId, data }) {
  return lyRequest(`${API_URL}/product_categories/${categoryId}/specs/${specId}`, {
    method: 'put',
    data: {
      ...data,
    },
  });  
}

