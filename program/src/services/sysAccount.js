import lyRequest from '../utils/lyRequest';
import { USERS_SERVER } from '../constant/config';
import { queryString } from '../utils/tools';
// 获取职位列表
export async function queryPositionList() {
    return lyRequest(`${USERS_SERVER}/operation/positions`);
}
// 编辑或新增职位
export async function editPosition({ params }) {
    return lyRequest(`${USERS_SERVER}/operation/positions`, {
        method: 'post',
        data: { data: params },
    });
}

// 删除职位
export async function deletePosition({ positionId }) {
    return lyRequest(`${USERS_SERVER}/operation/positions/${positionId}`, {
        method: 'delete',
    });
}

// 获取部门列表
export async function queryDepartmentList() {
    return lyRequest(`${USERS_SERVER}/operation/depts`);
}
// 编辑或新增部门
export async function editDepartment({ params }) {
    return lyRequest(`${USERS_SERVER}/operation/depts`, {
        method: 'post',
        data: { data: params },
    });
}

// 修改部门名称
export async function editDepartmentName({ id, name }) {
    return lyRequest(`${USERS_SERVER}/operation/depts/${id}`, {
        method: 'put',
        data: { name },
    });
}

// 删除部门
export async function deleteDepartment({ id }) {
    return lyRequest(`${USERS_SERVER}/operation/depts/${id}`, {
        method: 'delete',
    });
}
// 部门联动,用于角色列表的部门选择框
export async function queryDeptLevel() {
    return lyRequest(`${USERS_SERVER}/operation/depts/level_selection`);
}
// 角色列表
export async function queryRoleList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${USERS_SERVER}/operation/groups?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}
// 获取角色详情
export async function queryRoleDetail({ groupid }) {
    return lyRequest(`${USERS_SERVER}/operation/groups/${groupid}`);
}
// 角色列表新增角色
export async function addRole({ params }) {
    return lyRequest(`${USERS_SERVER}/operation/groups`, {
        method: 'post',
        data: params,
    });
}
// 角色列表修改角色
export async function editRole({ params, groupid }) {
    return lyRequest(`${USERS_SERVER}/operation/groups/${groupid}`, {
        method: 'put',
        data: params,
    });
}
// 删除角色
export async function deleteRole({ groupid }) {
    return lyRequest(`${USERS_SERVER}/operation/groups/${groupid}`, {
        method: 'delete',
    });
}

// 账号列表
export async function queryAccountList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${USERS_SERVER}/operation/accounts`, {
        params: {
            ...params,
            offset,
            limit,
        },
    });
}
// 账号详情
export async function queryAccountDetail({ userid }) {
    return lyRequest(`${USERS_SERVER}/operation/accounts/${userid}`);
}

// 新增账号
export async function addAccount({ params }) {
    return lyRequest(`${USERS_SERVER}/operation/accounts`, {
        method: 'post',
        data: params,
    });
}
// 修改账号
export async function editAccount({ params, userid }) {
    return lyRequest(`${USERS_SERVER}/operation/accounts/${userid}`, {
        method: 'put',
        data: params,
    });
}
// 删除账号
export async function deleteAccount({ userid }) {
    return lyRequest(`${USERS_SERVER}/operation/accounts/${userid}`, {
        method: 'delete',
    });
}

// 角色联动
export async function queryRoleLevel() {
    return lyRequest(`${USERS_SERVER}/operation/groups/level_selection`);
}
// 禁用或者启用帐号
export async function accountChangeActive({ userid, active_status }) {
    return lyRequest(`${USERS_SERVER}/operation/accounts/${userid}/active_status`, {
        method: 'put',
        data: {
            active_status,
        },
    });
}

// 修改密码
export async function modifyPassword({ userid, password }) {
    return lyRequest(`${USERS_SERVER}/operation/accounts/${userid}/password`, {
        method: 'put',
        data: {
            password,
        },
    });
}
