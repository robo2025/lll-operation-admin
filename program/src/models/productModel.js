import {
  queryProductModels,
  addProductModel,
  modifyProductModel,
  queryProductModelDetail,
} from '../services/productModel';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'productModel',

  state: {
    all: [],
    list: [],
    detail: {},
    total: 0,
  },

  effects: {
    *fetch({ offset, limit, success, error, params }, { call, put }) {
      const response = yield call(queryProductModels, { offset, limit, params });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(response);
      } else if (typeof error === 'function') { error(response); return; }

      const { headers } = response;
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *fetchDetail({ mno, success, error }, { call, put }) {
      const response = yield call(queryProductModelDetail, { mno });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(response);
      } else if (typeof error === 'function') { error(response); return; }
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *add({ data, success, error }, { call, put }) {
      const res = yield call(addProductModel, { data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryProductModels, {});
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *modify({ mno, data, success, error }, { call, put }) {
      const res = yield call(modifyProductModel, { mno, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryProductModels, {});
      const { headers } = response;
      yield put({
        type: 'save',
        payload: response.data,
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
    modify(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    remove(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
