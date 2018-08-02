import {
  queryList,
  queryDetail,
  queryAuthorizationList,
  handleAuthorize,
  handleCancelAuthorize,
  queryCatalogLevel,
} from '../services/authorizationManagement';

export default {
  namespace: 'authorizationManagement',

  state: {
    supplierList: [],
    profile: {},
    authorizationList: [],
    level: [],
    authorizationListPagination: { current: 1, pageSize: 10 },
    pagination: { current: 1, pageSize: 10 },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select((state) => {
        return state.authorizationManagement.pagination;
      });
      const { current, pageSize } = pagination;
      const params = {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      };
      const response = yield call(queryList, {
        ...payload,
        ...params,
      });
      const { data, headers, rescode } = response;
      if (rescode === '10000') {
        const dataWithKey = data.map((item) => {
          return { ...item, key: item.id };
        });
        yield put({
          type: 'save',
          payload: dataWithKey,
        });
      } else {
        yield put({
          type: 'save',
          payload: data,
        });
      }
      const newPagination = {
        ...pagination,
        total: parseInt(headers['x-content-total'], 10),
      };
      yield put({
        type: 'savePagination',
        payload: newPagination,
      });
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryDetail, { id: payload });
      yield put({
        type: 'saveProfile',
        payload: { ...response.data },
      });
      const { rescode, data, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, data);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *fetchAuthorizationList({ payload }, { call, put, select }) {
      const pagination = yield select((state) => {
        return state.authorizationManagement.authorizationListPagination;
      });
      const { current, pageSize } = pagination;
      const params = {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      };
      const response = yield call(queryAuthorizationList, {
        ...payload,
        ...params,
      });
      const { data, headers, rescode } = response;
      if (rescode === '10000') {
        const dataWithKey = data.map((item) => {
          return { ...item, key: item.id };
        });
        yield put({
          type: 'saveAuthorizationList',
          payload: dataWithKey,
        });
      } else {
        yield put({
          type: 'saveAuthorizationList',
          payload: data,
        });
      }
      const newPagination = {
        ...pagination,
        total: parseInt(headers['x-content-total'], 10),
      };
      yield put({
        type: 'saveAuthorizationListPagination',
        payload: newPagination,
      });
    },
    *handleAuthorize({ payload, callback }, { call }) {
      const response = yield call(handleAuthorize, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *handleCancelAuthorize({ payload, callback }, { call }) {
      const response = yield call(handleCancelAuthorize, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *fetchLevel({ payload, callback }, { call, put }) {
      const response = yield call(queryCatalogLevel, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
      yield put({
        type: 'saveLevel',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        supplierList: payload,
      };
    },
    savePagination(state, { payload }) {
      return {
        ...state,
        pagination: payload,
      };
    },
    saveProfile(state, { payload }) {
      return {
        ...state,
        profile: payload,
      };
    },
    saveAuthorizationList(state, { payload }) {
      return {
        ...state,
        authorizationList: payload,
      };
    },
    saveAuthorizationListPagination(state, { payload }) {
      return {
        ...state,
        authorizationListPagination: payload,
      };
    },
    saveLevel(state, { payload }) {
      return {
        ...state,
        level: payload,
      };
    },
  },
};
