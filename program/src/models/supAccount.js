import {
  querySuppliers,
  queryDetail,
  disableAccount,
  disableSubAccount,
  passwordChange,
  fetchSubAccounts,
  hanldeSubAccountDelete,
  addSubAccount,
  modifySubAccount,
} from '../services/supAccount';

export default {
  namespace: 'supAccount',

  state: {
    supplierList: [],
    subAccountList: [],
    profile: {},
    pagination: { current: 1, pageSize: 10 },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select((state) => {
        return state.supAccount.pagination;
      });
      const { current, pageSize } = pagination;
      const params = {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      };
      const response = yield call(querySuppliers, {
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
    *disableAccount({ payload, callback }, { call }) {
      const response = yield call(disableAccount, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *disableSubAccount({ payload, callback }, { call }) {
      const response = yield call(disableSubAccount, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *passwordChange({ payload, callback }, { call }) {
      const response = yield call(passwordChange, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *fetchSubAccounts({ payload, callback }, { call, put }) {
      const response = yield call(fetchSubAccounts, { ...payload });
      const { rescode, data, msg } = response;
      yield put({
        type: 'saveSubAccounts',
        payload: data,
      });
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *hanldeSubAccountDelete({ payload, callback }, { call }) {
      const response = yield call(hanldeSubAccountDelete, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *addSubAccount({ payload, callback }, { call }) {
      const response = yield call(addSubAccount, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *modifySubAccount({ payload, callback }, { call }) {
      const response = yield call(modifySubAccount, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
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
    saveSubAccounts(state, { payload }) {
      return {
        ...state,
        subAccountList: payload,
      };
    },
  },
};
