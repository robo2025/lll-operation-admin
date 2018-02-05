import { queryProducts, addProduct, removeProducts, modifyProduct } from '../services/product';

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
    *add({ data, callback }, { call, put }) {
      yield call(addProduct, { data });
      const response = yield call(queryProducts);
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
      if (callback) callback();
    },
    *modifyInfo({ categoryId, name, isActive, desc, callback }, { call, put }) {
      const res = yield call(modifyProduct, { categoryId, name, isActive, desc });
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
    *removeOne({ categoryId, callback }, { call, put }) {
      const res = yield call(removeProducts, { categoryId });
      if (res.rescode !== 10000) {
        if (callback) callback(res.msg); 
        return;
      } 
      const response = yield call(queryProducts);
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
