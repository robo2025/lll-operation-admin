import {
  queryList,
  queryDetail,
  queryUserInfo,
  querySuppliers,
  handleAssigned,
} from '../services/solution';
import { getSupplierInfo } from '../services/user';

export default {
  namespace: 'solution',
  state: {
    list: [],
    profile: {},
    pagination: { current: 1, pageSize: 10 },
    suppliers: [],
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select((state) => {
        return state.solution.pagination;
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
      if (rescode === 10000) {
        const dataWithKey = data.map((item) => {
          return { ...item, key: item.sln_no };
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
      const response = yield call(queryDetail, { sln_no: payload });
      let userInfo = {};
      let supplierInfo = {};
      if (response.rescode === 10000) {
        if (response.data.customer) {
          const res = yield call(queryUserInfo, {
            id: response.data.customer.sln_basic_info.customer_id,
          });
          userInfo = res.data;
          if (callback) {
            callback(response.data);
          }
        }
        if (response.data.supplier) {
          const res = yield call(
            getSupplierInfo,
            response.data.supplier.sln_supplier_info.user_id
          );
          supplierInfo = res.data;
          if (callback) {
            callback(response.data);
          }
        }
      }
      yield put({
        type: 'saveSolutionOrder',
        payload: { ...response.data, userInfo, supplierInfo },
      });
    },
    *fetchSuppliers({ payload, callback }, { call, put }) {
      const response = yield call(querySuppliers, { ...payload });
      const { data, msg, rescode } = response;
      if (rescode === '10000') {
        const dataWithKey = data.map((item) => { return { ...item, key: item.id }; });
        yield put({
          type: 'saveSuppliers',
          payload: dataWithKey,
        });
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
          callback(false, msg);
        }
    },
    *handleAssigned({ payload, callback }, { call, put }) {
      const response = yield call(handleAssigned, { ...payload });
      const { msg, rescode } = response;
      if (rescode === 10000) {
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
        list: payload,
      };
    },
    savePagination(state, { payload }) {
      return {
        ...state,
        pagination: payload,
      };
    },
    saveSolutionOrder(state, { payload }) {
      return {
        ...state,
        profile: payload,
      };
    },
    saveSuppliers(state, { payload }) {
      return {
        ...state,
        suppliers: payload,
      };
    },
  },
};
