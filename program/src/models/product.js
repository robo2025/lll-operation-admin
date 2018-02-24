import { queryProducts, addProduct, removeProducts, modifyProduct, queryProductDetail } from '../services/product';

export default {
  namespace: 'product',

  state: {
    list: [],
    detail: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryProducts);
      // console.log('服务器目录列表', response);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *fetchDetail({ productId, callback }, { call, put }) {
      const response = yield call(queryProductDetail, { productId });
      if (response.rescode >> 0 === 10000) {
        if (callback) callback(response.data);
      }
      console.log('产品详情:', response);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *add({ data, callback }, { call, put }) {
      yield call(addProduct, { data });
      const response = yield call(queryProducts);
      alert(1);
      if (response.status === 10000) {
        if (callback) callback();
      }
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
    },
    *modifyInfo({ prdId, data, callback }, { call, put }) {
      const res = yield call(modifyProduct, { prdId, data });
      const response = yield call(queryProducts);
      yield put({
        type: 'modify',
        payload: response.data,
      });
      if (callback) callback();
    },
    *modifyStatus({ categoryId, isActive, callback }, { call, put }) {
      yield call(modifyProduct, { categoryId, isActive });
      const response = yield call(queryProducts);
      yield put({
        type: 'modify',
        payload: response.data,
      });
      if (callback) callback();
    },
    *remove({ ids, callback }, { call, put }) {
      const res = yield call(removeProducts, { ids });
      if (res.rescode >> 0 !== 10000) {
        if (callback) callback(res.msg);
        return;
      }
      const response = yield call(queryProducts);
      console.log('新的产品列表', response);
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
