import {
  queryOrders,
  queryExceptionOrders,
  queryOrderDetail,
  querySearchResults,
  queryCancelOrder,
  queryAgreeNoGood,
  queryRejectNoGood,
  queryAgreeDelay,
  queryRejectDelay,
} from '../services/order';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'orders',

  state: {
    list: [],
    exceptionList: [],
    detail: {},
    offset: 0,
    limit: 15,
    total: 0,
  },

  effects: {
    *fetch({ offset, limit, success, error }, { call, put }) {
      const res = yield call(queryOrders, { offset, limit });
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
    *fetchExptionOrders({ offset, limit, success, error }, { call, put }) {
      const res = yield call(queryExceptionOrders, { offset, limit });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }
      
      const { headers } = res;
      yield put({
        type: 'saveException',
        payload: res.data,
        headers,        
      });
    },
    *fetchDetail({ orderId, success, error }, { call, put }) {
      const res = yield call(queryOrderDetail, { orderId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'saveDetail',
        payload: res.data,
      });
    },
    *fetchCancel({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryCancelOrder, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      // const response = yield call(queryOrders, {});
      // const { headers } = response;      
      // yield put({
      //   type: 'save',
      //   payload: response.data,
      //   headers,
      // });
    },
    *fetchAgreeNoGood({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryAgreeNoGood, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      // const response = yield call(queryExceptionOrders, {});
      // const { headers } = response;      
      // yield put({
      //   type: 'saveException',
      //   payload: response.data,
      //   headers,
      // });
    },
    *fetchRejectNoGood({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryRejectNoGood, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      // const response = yield call(queryExceptionOrders, {});
      // const { headers } = response;            
      // yield put({
      //   type: 'saveException',
      //   payload: response.data,
      //   headers,
      // });
    },
    *fetchAgreeDelay({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryAgreeDelay, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      // const response = yield call(queryExceptionOrders, {});
      // const { headers } = response;            
      // yield put({
      //   type: 'saveException',
      //   payload: response.data,
      //   headers,
      // });
    },
    *fetchRejectDelay({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryRejectDelay, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      // const response = yield call(queryExceptionOrders, {});
      // const { headers } = response;            
      // yield put({
      //   type: 'saveException',
      //   payload: response.data,
      //   headers,
      // });
    },
    *fetchSearch({ offset, limit, params, success, error }, { call, put }) {
      const res = yield call(querySearchResults, { offset, limit, params });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }
      const { headers } = res;            
      
      yield put({
        type: 'saveSearch',
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
    saveException(state, action) {
      return {
        ...state,
        exceptionList: action.payload,
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
        total: action.headers['x-content-total'] >> 0,        
      };
    },
  },
};
