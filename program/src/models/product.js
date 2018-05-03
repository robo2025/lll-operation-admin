import { queryProducts, queryProductsByParams, addProduct, removeProducts, modifyProduct, queryProductDetail, querySupplyInfo, queryOperationLog, exportProduct } from '../services/product';
import { SUCCESS_STATUS } from '../constant/config.js';

export default {
  namespace: 'product',

  state: {
    all: [],
    list: [],
    detail: {},
    logs: [],
    supplierList: [],
    total: 0,
    export: '',
  },

  effects: {
    *fetch({ offset, limit, success, error, params }, { call, put }) {
      const response = yield call(queryProducts, { offset, limit, params });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(response.data);
      } else if (typeof error === 'function') { error(response); return; }
      
      const { headers } = response;
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *fetchByParams({ params, success, error }, { call, put }) {
      const response = yield call(queryProductsByParams, { params });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(response);
      } else if (typeof error === 'function') { error(response); return; }
      
      yield put({
        type: 'saveAll',
        payload: response.data,
      });
    },
    *fetchDetail({ pno, success, error }, { call, put }) {
      const response = yield call(queryProductDetail, { pno });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(response.data);
      } else if (typeof error === 'function') { error(response); return; }
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *add({ data, success, error }, { call, put }) {
      const res = yield call(addProduct, { data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res.data);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryProducts, {});
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *modifyInfo({ pno, data, success, error }, { call, put }) {
      const res = yield call(modifyProduct, { pno, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res.data);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryProducts, {});
      const { headers } = response;      
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *modifyStatus({ categoryId, isActive, success, error }, { call, put }) {
      const res = yield call(modifyProduct, { categoryId, isActive });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res.data);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryProducts, {});
      const { headers } = response;      
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *remove({ ids, success, error }, { call, put }) {
      const res = yield call(removeProducts, { ids });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res.data);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryProducts, {});
      const { headers } = response;      
      // console.log('服务器目录列表', response);
      yield put({
        type: 'save',
        payload: response.data,
        headers,
      });
    },
    *querySupplyInfo({ productId, success, error }, { call, put }) {
      const res = yield call(querySupplyInfo, { productId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res.data);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'supplyInfo',
        payload: res.data,
      });
    },
    *queryLogs({ module, productId, success, error }, { call, put }) {
      const res = yield call(queryOperationLog, { module, productId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res.data);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'logs',
        payload: res.data,
      });
    },
    *queryExport({ fields, success, error }, { call, put }) {
      const res = yield call(exportProduct, { fields });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res.data);
      } else if (typeof error === 'function') { error(res); return; }
      
      yield put({
        type: 'export',
        payload: res.data,
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
    saveOne(state, action) {
      return {
        ...state,
        list: action.payload,
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
    supplyInfo(state, action) {
      return {
        ...state,
        supplierList: action.payload,
      };
    },
    logs(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },
    export(state, action) {
      return {
        ...state,
        export: action.payload,
      };
    },
  },
};
