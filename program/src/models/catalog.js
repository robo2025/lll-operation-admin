import {
  queryCatalog,
  addCatalog, modifyCatalog,
  modifyCatalogStatus,
  removeCatalog,
  queryCatalogLevel,
  sortCatalog,
  getCatalogSpecs,
  modifyCatalogSpecs,
} from '../services/catalog';
import { SUCCESS_STATUS } from '../constant/config.js';


export default {
  namespace: 'catalog',

  state: {
    list: [],
    level: [],
    specs: [],
    total: 0,
  },

  effects: {
    *fetch({ pid, success, error }, { call, put }) {
      const res = yield call(queryCatalog, { pid });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'save',
        payload: res.data,
      });
    },
    *fetchLevel({ pid, success, error }, { call, put }) {
      const res = yield call(queryCatalogLevel, { pid });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }
      // console.log('服务器目录列表', response);

      yield put({
        type: 'saveLevel',
        payload: res.data,
      });
    },
    *fetchSpecs({ categoryId, params, success, error }, { call, put }) {
      const res = yield call(getCatalogSpecs, { categoryId, params });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }
      // console.log('服务器目录列表', response);
      const { headers } = res;
      yield put({
        type: 'saveSpecs',
        payload: res.data,
        headers,
      });
    },
    *modifySpecs({ categoryId, specId, data, success, error }, { call, put }) {
      const res = yield call(modifyCatalogSpecs, { categoryId, specId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); }
      // console.log('服务器目录列表', response);
    },
    *add({ data, success, error }, { call, put }) {
      const res = yield call(addCatalog, { data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); }
    },
    *modifyInfo({ categoryId, data, success, error }, { call, put }) {
      const res = yield call(modifyCatalog, { categoryId, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); }
      // yield put({
      //   type: 'modify',
      //   payload: response.data,
      // });
    },
    *modifyStatus({ categoryId, isActive, success, error }, { call, put }) {
      const res = yield call(modifyCatalogStatus, { categoryId, isActive });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); }

      // const response = yield call(queryCatalog);
      // yield put({
      //   type: 'modify',
      //   payload: response.data,
      // });
    },
    *removeOne({ categoryId, success, error }, { call, put }) {
      const res = yield call(removeCatalog, { categoryId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); }
    },
    *sortCatalogLevel({ level, data, success, error }, { call, put }) {
      const res = yield call(sortCatalog, { level, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveLevel(state, action) {
      return {
        ...state,
        level: action.payload,
      };
    },
    saveSpecs(state, action) {
      return {
        ...state,
        specs: action.payload,
        total: action.headers['x-content-total'] >> 0,        
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
  },
};
