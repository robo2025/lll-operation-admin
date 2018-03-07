import { queryCatalog, addCatalog, modifyCatalog, modifyCatalogStatus, removeCatalog, queryCatalogLevel, sortCatalog } from '../services/catalog';
import { SUCCESS_STATUS } from '../constant/config.js';


export default {
  namespace: 'catalog',

  state: {
    list: [],
    level: [],
  },

  effects: {
    *fetch({ success, error }, { call, put }) {
      const res = yield call(queryCatalog);
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      yield put({
        type: 'save',
        payload: res.data,
      });
    },
    *fetchLevel({ success, error }, { call, put }) {
      const res = yield call(queryCatalogLevel);
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }
      // console.log('服务器目录列表', response);

      yield put({
        type: 'saveLevel',
        payload: res.data,
      });
    },
    *add({ pid, name, isActive, desc, success, error }, { call, put }) {
      const res = yield call(addCatalog, { pid, name, isActive, desc });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryCatalog);
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
    },
    *modifyInfo({ categoryId, name, isActive, desc, success, error }, { call, put }) {
      const res = yield call(modifyCatalog, { categoryId, name, isActive, desc });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryCatalog);
      yield put({
        type: 'modify',
        payload: response.data,
      });
    },
    *modifyStatus({ categoryId, isActive, success, error }, { call, put }) {
      const res = yield call(modifyCatalogStatus, { categoryId, isActive });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryCatalog);
      yield put({
        type: 'modify',
        payload: response.data,
      });
    },
    *removeOne({ categoryId, success, error }, { call, put }) {
      const res = yield call(removeCatalog, { categoryId });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); return; }

      const response = yield call(queryCatalog);
      yield put({
        type: 'remove',
        payload: response.data,
      });
    },
    *sortCatalogLevel({ level, data, success, error }, { call, put }) {
      const res = yield call(sortCatalog, { level, data });
      if (res.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(res);
      } else if (typeof error === 'function') { error(res); }

      const response = yield call(queryCatalog);
      yield put({
        type: 'save',
        payload: response.data,
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
    saveLevel(state, action) {
      return {
        ...state,
        level: action.payload,
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
