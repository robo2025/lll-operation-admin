import { queryGoods, queryGoodDetail, modifyGoodStatus, modifyGoodInfo, addGood } from '../services/good';

export default {
  namespace: 'good',

  state: {
    list: [],
    detail: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryGoods);
      // console.log('服务器目录列表', response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchDetail({ goodId, callback }, { call, put }) {
      const response = yield call(queryGoodDetail, { goodId });
      if (response.rescode >> 0 === 10000) {
        if (callback) callback(response.data);
      }
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *add({ data, callback }, { call, put }) {
      yield call(addGood, { data });
      const response = yield call(queryGoods);
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
      if (callback) callback();
    },
    *modifyInfo({ goodId, data, callback }, { call, put }) {
      const res = yield call(modifyGoodInfo, { goodId, data });
      if (callback) callback(res);
      const response = yield call(queryGoods);
      yield put({
        type: 'modify',
        payload: response.data,
      });
    },
    *modifyGoodStatus({ goodId, goodStatus, callback }, { call, put }) {
      const res = yield call(modifyGoodStatus, { goodId, goodStatus });
      if (res.rescode >> 0 === 10000) {
        if (callback) callback(res);
      }
      const response = yield call(queryGoods);
      yield put({
        type: 'modify',
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
  },
};
