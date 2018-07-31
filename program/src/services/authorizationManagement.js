import lyRequest from '../utils/lyRequest';
import { OPERATION_URL } from '../constant/config';


export async function queryList(params) {
  const { offset = 0, limit = 10, ...others } = params;
  return lyRequest(`${OPERATION_URL}/operation/authorization`, {
    params: {
      offset,
      limit,
      ...others,
    },
  });
}
export async function queryDetail({ id }) {
  return lyRequest(`${OPERATION_URL}/operation/authorization/${id}`);
}

