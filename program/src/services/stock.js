import lyRequest from '../utils/lyRequest';
import { STOCKLIST_URL } from '../constant/config';
import { queryString } from '../utils/tools';

export async function queryGoodsStockList({ params, offset = 0, limit = 10 }) {
    return lyRequest(`${STOCKLIST_URL}?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}