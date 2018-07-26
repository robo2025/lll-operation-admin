import lyRequest from '../utils/lyRequest';
import { OPERATION_URL } from '../constant/config';

export async function query({ module, object_id, platform, offset = 0, limit = 10 }) {
  return lyRequest(`${OPERATION_URL}/operationlogs`, {
    params: {
        module,
        object_id,
        platform,
        offset,
        limit,
    },
  });
}
