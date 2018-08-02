import {
  queryAccountList,
  queryAccountDetail,
  querySubAccountList,
  editSubInfo,
} from '../services/userCenter';

export default {
  namespace: 'userCenter',
  state: {
    accountList: [],
    accountTotal: 0,
    accountDetail: {},
    subList: [],
    subTotal: 0,
  },
  effects: {
    *fetchList({ params, offset, limit, success, error }, { call, put }) {
      const res = yield call(queryAccountList, { params, offset, limit });
      const { rescode, headers } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveList',
        payload: res.data,
        headers,
      });
    },
    *fetchDetail({ userId, success, error }, { call, put }) {
      const res = yield call(queryAccountDetail, { userId });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveDetail',
        payload: res.data,
      });
    },
    *fetchSubList({ userId, offset, limit, success, error }, { call, put }) {
      const res = yield call(querySubAccountList, { userId, offset, limit });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveSubList',
        payload: res.data,
      });
    },
    *fetchEditSubInfo({ userId, subUserId, params, success, error }, { call }) {
      const res = yield call(editSubInfo, { params, userId, subUserId });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        accountList: action.payload,
        accountTotal: action.headers['x-content-total'] >> 0,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        accountDetail: action.payload,
      };
    },
    saveSubList(state, action) {
      return {
        ...state,
        subList: action.payload,
        subTotal: action.subTotal,
      };
    },
  },
};
