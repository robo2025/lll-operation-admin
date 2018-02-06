import { queryCatalog, addCatalog, modifyCatalog, modifyCatalogStatus, removeCatalog, queryCatalogLevel } from '../services/catalog';

export default {
  namespace: 'catalog',

  state: {
    list: [],
    level: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryCatalog);
      // console.log('服务器目录列表', response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchLevel(_, { call, put }) {
      const response = yield call(queryCatalogLevel);
      // console.log('服务器目录列表', response);
      yield put({
        type: 'saveLevel',
        payload: response.data,
      });
    },
    *add({ pid, name, isActive, desc, callback }, { call, put }) {
      yield call(addCatalog, { pid, name, isActive, desc });
      const response = yield call(queryCatalog);
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
      if (callback) callback();
    },
    *modifyInfo({ categoryId, name, isActive, desc, callback }, { call, put }) {
      const res = yield call(modifyCatalog, { categoryId, name, isActive, desc });
      const response = yield call(queryCatalog);
      yield put({
        type: 'modify',
        payload: response.data,
      });
      if (callback) callback();
    },
    *modifyStatus({ categoryId, isActive, callback }, { call, put }) {
      yield call(modifyCatalogStatus, { categoryId, isActive });
      const response = yield call(queryCatalog);
      yield put({
        type: 'modify',
        payload: response.data,
      });
      if (callback) callback();
    },
    *removeOne({ categoryId, callback }, { call, put }) {
      const res = yield call(removeCatalog, { categoryId });
      if (res.rescode !== 10000) {
        if (callback) callback(res.msg);
        return;
      }
      const response = yield call(queryCatalog);
      yield put({
        type: 'remove',
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
