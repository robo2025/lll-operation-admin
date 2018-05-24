import {
  queryReturns,
  queryReturnsDetail,
  queryReturnsAudit,
} from '../services/returns';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'returns',

  state: {
    list: [],
    detail: {},
    offset: 0,
    limit: 15,
    total: 0,
  },

  effects: {
    *fetch({ offset, limit, params, success, error }, { call, put }) {
      const res = yield call(queryReturns, { params, offset, limit });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }
      const { headers } = res;
      yield put({
        type: 'save',
        payload: res.data,
        headers,
      });
    },
    *fetchDetail({ returnId, success, error }, { call, put }) {
      const res = yield call(queryReturnsDetail, { returnId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }
      const { headers } = res;
      yield put({
        type: 'saveDetail',
        payload: res.data,
        headers,
      });
    },
    *fetchAudit({ returnId, data, success, error }, { call, put }) {
      const res = yield call(queryReturnsAudit, { returnId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }
      const { headers } = res;
      yield put({
        type: 'saveDetail',
        payload: res.data,
        headers,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
        total: action.headers['x-content-total'] >> 0,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    saveSearch(state, action) {
      return {
        ...state,
        list: action.payload,
        exceptionList: action.payload,
      };
    },
  },
};
