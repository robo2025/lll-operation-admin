import { query } from '../services/log';

export default {
  namespace: 'log',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(query, { ...payload });
      const { rescode, data, msg, headers } = response;
      yield put({
        type: 'saveLogs',
        payload: { data, total: parseInt(headers['x-content-total'], 10) },
      });
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
    saveLogs(state, { payload }) {
      const { list, total } = payload;
      return {
        ...state,
        list,
        total,
      };
    },
  },
};
