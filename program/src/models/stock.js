import { queryGoodsStockList } from "../services/stock";
import { SUCCESS_STATUS } from '../constant/config.js';
export default {
    namespace: 'stock',
    state: {
        goodsStockList: {},
        total:0
    },
    effects: {
        *fetch({ offset, limit, params, success, error }, { call, put }) {
            const res = yield call(queryGoodsStockList,{ offset, limit, params });
            if (res.rescode >> 0 === SUCCESS_STATUS) {
                if (typeof success === 'function') { success(res);}
            } else if (typeof error === 'function') { error(res); return; }
            console.log(res,'res')
            const {headers} =res;
            yield put({
                type:"save",
                payload:res.data,
                headers,
            })
        }
    },
    reducers:{
        save(state,action){
            return {
                ...state,
                goodsStockList:action.payload,
                total:action.headers['x-content-total'] >>0
            }
        }
    }
}