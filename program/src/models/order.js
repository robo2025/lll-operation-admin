import {
  queryOrders,
  queryExceptionOrders,
  queryOrderDetail,
  querySearchResults,
  queryCancelOrder,
  queryNoGoodReject,
  queryAgree,
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
  },

  effects: {
    *fetch({ offset, limit, success, error }, { call, put }) {
      const res = yield call(queryOrders, { offset, limit });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'save',
        payload: res.data,
      });
    },
    *fetchExptionOrders({ success, error }, { call, put }) {
      const res = yield call(queryExceptionOrders);
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'saveException',
        payload: res.data,
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
      const res = yield call(queryNoGoodReject, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryOrders);      
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchNoGoodReject({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryCancelOrder, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryExceptionOrders);      
      yield put({
        type: 'saveException',
        payload: response.data,
      });
    },
    *fetchAgreeReturns({ orderId, data, success, error }, { call, put }) {
      const res = yield call(queryAgree, { orderId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryExceptionOrders);      
      yield put({
        type: 'saveException',
        payload: response.data,
      });
    },
    *fetchSearch({ data, success, error }, { call, put }) {
      const res = yield call(querySearchResults, { ...data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'saveSearch',
        payload: res.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveException(state, action) {
      return {
        ...state,
        exceptionList: action.payload,
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
