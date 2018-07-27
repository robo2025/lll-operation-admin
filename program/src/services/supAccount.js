import { sha256 } from 'js-sha256';
import lyRequest from '../utils/lyRequest';
import { USERS_SERVER } from '../constant/config';


export async function querySuppliers(params) {
  const { offset = 0, limit = 10, ...others } = params;
  return lyRequest(`${USERS_SERVER}/operation/suppliers`, {
    params: {
      offset,
      limit,
      ...others,
    },
  });
}
export async function queryDetail({ id }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${id}`);
}

export async function disableAccount({ id, active_status }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${id}/active_status`, {
    method: 'put',
    data: { active_status },
  });
}
export async function disableSubAccount({ main_user_id, subuserid, active_status }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${main_user_id}/subusers/${subuserid}/active_status`, {
    method: 'put',
    data: { active_status },
  });
}

export async function passwordChange({ id, password }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${id}/password`, {
    method: 'put',
    data: { password: sha256(password) },
  });
}
export async function fetchSubAccounts({ id }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${id}/subusers`);
}
export async function hanldeSubAccountDelete({ main_user_id, subuserid }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${main_user_id}/subusers/${subuserid}`, {
    method: 'delete',
  });
}
export async function addSubAccount({ formData, id }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${id}/subusers`, {
    method: 'post',
    data: { ...formData },
  });
}
export async function modifySubAccount({ formData, id, subuserid }) {
  return lyRequest(`${USERS_SERVER}/operation/suppliers/${id}/subusers/${subuserid}`, {
    method: 'put',
    data: { ...formData },
  });
}
