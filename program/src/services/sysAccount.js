import lyRequest from '../utils/lyRequest';
import { USERS_SERVER } from '../constant/config';

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

