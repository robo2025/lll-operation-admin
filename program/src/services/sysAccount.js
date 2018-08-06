import lyRequest from '../utils/lyRequest';
import { USERS_SERVER } from '../constant/config';

export async function queryPositionList() {
    return lyRequest(`${USERS_SERVER}/operation/positions`);
}

export async function editPosition({ params }) {
    return lyRequest(`${USERS_SERVER}/operation/positions`, {
        method: 'post',
        data: { data: params },
    });
}

export async function deletePosition({ positionId }) {
    return lyRequest(`${USERS_SERVER}/operation/positions/${positionId}`, {
        method: 'delete',
    });
}

export async function queryDepartmentList() {
    return lyRequest(`${USERS_SERVER}/operation/depts`);
}
