import { queryProducts, addProduct, removeProducts, modifyProduct, queryProductDetail, queryOperationLog } from '../services/product';

export default {
  namespace: 'product',

  state: {
    list: [],
    detail: {},
    logs: [],
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
      const res = yield call(addProduct, { data });
      if (res.rescode >> 0 === 10000) {
        if (callback) callback(res);
      } else {
        alert(res.msg);
        return;                      
      };
      const response = yield call(queryProducts);
      
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
        alert(res.msg.split(':')[1]);        
        return;
      } else if (callback) callback(res);
      const response = yield call(queryProducts);
      yield put({
        type: 'remove',
        payload: response.data,
      });
    },
    *queryLogs({ module }, { call, put }) {
      const res = yield call(queryOperationLog, { module });
      yield put({
        type: 'logs',
        payload: res.data,
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
    logs(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },
  },
};
