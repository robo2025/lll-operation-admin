import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';


// 获取服务器目录信息
export async function queryCatalog() {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/product_categories`, {
    headers: {
      Authorization: acess_token,
    },
  });
}

// 获取级联目录
export async function queryCatalogLevel() {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/product_categories/level_selection`, {
    headers: {
      Authorization: acess_token,
    },
  });  
}

/**
 * 添加目录信息
 *
 * @param {number} pid 父目录id (一级目录为 0)
 * @param {string} name 目录名称
 * @param {number} isActive 是否启用 （0:禁用 1:启用）
 * @param  {string=} desc 目录说明(可选)
*/
export async function addCatalog({ pid, name, isActive, desc }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/product_categories`, {
    method: 'post',
    headers: {
      Authorization: acess_token,
    },
    data: {
      pid,
      category_name: name,
      is_active: isActive,
      description: desc,
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
export async function modifyCatalog({ categoryId, name, isActive, desc }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/product_categories/${categoryId}`, {
    method: 'put',
    headers: {
      Authorization: acess_token,
    },
    data: {
      category_name: name,
      is_active: isActive,
      description: desc,
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
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/product_categories/${categoryId}/active_status`, {
    method: 'put',
    headers: {
      Authorization: acess_token,
    },
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
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/api/product_categories/${categoryId}`, {
    method: 'delete',
    headers: {
      Authorization: acess_token,
    },
  });
}
