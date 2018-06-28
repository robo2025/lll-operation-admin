import lyRequest from '../utils/lyRequest';
import { SLN_ORDER_URL, SOLUTION_URL, USERS_SERVER } from '../constant/config';

export async function queryOrders(params) {
    const { offset = 0, limit = 10, is_type = 0, ...others } = params;
    return lyRequest(`${SLN_ORDER_URL}/v1/chief/order`, {
        params: {
            offset,
            limit,
            is_type,
            ...others,
        },
    });
}

export async function queryDetail(params) {
    const { plan_order_sn } = params;
    return lyRequest(`${SLN_ORDER_URL}/v1/chief/order/${plan_order_sn}`);
}


export async function querySolutionDetail(plan_order_sn) {
    return lyRequest(`${SOLUTION_URL}/v1/sln/${plan_order_sn}?role=admin`);
}
