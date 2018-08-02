import { USERS_SERVER } from '../constant/config';
import lyRequest from '../utils/lyRequest';
import { queryString } from '../utils/tools';

// 获取客户列表
export async function queryAccountList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${USERS_SERVER}/operation/customers?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}
// 获取客户详情
export async function queryAccountDetail({ userId }) {
    return lyRequest(`${USERS_SERVER}/operation/customers/${userId}`);
}
// 获取客户子账号列表
export async function querySubAccountList({ userId, offset = 0, limit = 10 }) {
    return lyRequest(`${USERS_SERVER}/operation/customers/${userId}/subusers?offset=${offset}&limit=${limit}`);
}

// 修改子账号信息
 export async function editSubInfo({ userId, subUserId, params }) {
     return lyRequest(`${USERS_SERVER}/operation/customers/${userId}/subusers/${subUserId}`, {
         method: 'put',
         data: params,
     });
 }
