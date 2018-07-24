import lyRequest from '../utils/lyRequest';
import { USERS_SERVER } from '../constant/config';

export async function querySuppliers(params) {
  const { offset = 0, limit = 10, ...others } = params;
  return lyRequest(`${USERS_SERVER}/operation/audit`, {
    params: {
      offset,
      limit,
      ...others,
    },
  });
}
export async function queryDetail({ id }) {
  return lyRequest(`${USERS_SERVER}/operation/audit/${id}`);
}
