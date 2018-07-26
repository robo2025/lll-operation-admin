import lyRequest from '../utils/lyRequest';
import { USERS_SERVER, SOLUTION_URL } from '../constant/config';

export async function queryList(params) {
  const { offset = 0, limit = 10, is_type = 'all', ...others } = params;
  return lyRequest(`${SOLUTION_URL}/v1/sln`, {
    params: {
      offset,
      limit,
      is_type,
      role: 'admin',
      ...others,
    },
  });
}

export async function queryDetail({ sln_no }) {
  return lyRequest(`${SOLUTION_URL}/v1/sln/${sln_no}?role=admin`);
}

export async function queryUserInfo({ id }) {
  return lyRequest(USERS_SERVER + '/service/customers/' + id);
}

export async function querySuppliers(params) {
  const { company } = params;
  return lyRequest(`${USERS_SERVER}/service/suppliers/all`, {
    method: 'get',
    params: { company },
  });
}

export async function handleAssigned({ supplier_id, sln_no }) {
  return lyRequest(`${SOLUTION_URL}/v1/assign`, {
    method: 'put',
    data: {
      sln_assign: {
        supplier_id,
        sln_no,
      },
    },
  });
}

export async function queryOperationLog({sln_no}) {
    return lyRequest(`${SOLUTION_URL}/v1/log?sln_no=${sln_no}`)
}

export async function queryOfferOperation({sln_no}) {
    return lyRequest(`${SOLUTION_URL}/v1/offer-operation?sln_no=${sln_no}&sbm_no=1`)
}