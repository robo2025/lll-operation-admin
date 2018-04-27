import {
  queryBrands,
  queryAllBrands,
  addBrand,
  modifyBrand,
  removeBrand,
  queryBrandDetail,
} from '../services/brand';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'brand',

  state: {
    all: [],
    list: [],
    detail: {},
    total: 0,
  },

  effects: {
    *fetch({ offset, limit, success, error, params }, { call, put }) {
      const response = yield call(queryBrands, { offset, limit, params });
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
    *fetchAll({ success, error }, { call, put }) {
      const response = yield call(queryAllBrands);
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(response);
      } else if (typeof error === 'function') { error(response); return; }

      const { headers } = response;
      yield put({
        type: 'saveAll',
        payload: response.data,
        headers,
      });
    },
    *fetchDetail({ bno, success, error }, { call, put }) {
      const response = yield call(queryBrandDetail, { bno });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(response);
      } else if (typeof error === 'function') { error(response); return; }
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *add({ data, success, error }, { call, put }) {
      const res = yield call(addBrand, { data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryBrands, {});
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *modify({ bno, data, success, error }, { call, put }) {
      const res = yield call(modifyBrand, { bno, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryBrands, {});
      const { headers } = response;
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *remove({ bno, success, error }, { call, put }) {
      const res = yield call(removeBrand, { bno });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(removeBrand, {});
      const { headers } = response;
      // console.log('服务器目录列表', response);
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
    saveAll(state, action) {
      return {
        ...state,
        all: action.payload,
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
