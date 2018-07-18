import { queryContractList, querySupplierList } from "../services/contract";
import { SUCCESS_STATUS } from "../constant/config";
export default {
  namespace: "contract",
  state: {
    contractList: [],
    supplierList: [],
    contractTotal: 0,
    supplierTotal: 0
  },
  effects: {
    *fetch({ params, offset, limit, success, error }, { call, put }) {
      const res = yield call(queryContractList, { params, offset, limit });
      if (res.resCode >> 0 === SUCCESS_STATUS) {
        if (typeof success === "function") {
          success(res);
        }
      } else if (typeof error === "function") {
        error(res);
        return;
      }
      const { headers } = res;
      yield put({
        type: "save",
        payload: res.data,
        headers
      });
    },
    *fetchSupplierList(
      { params, offset, limit, success, error },
      { call, put }
    ) {
      const res = yield call(querySupplierList, { params, offset, limit });
      if (res.resCode >> 0 === SUCCESS_STATUS) {
        if (typeof success === "function") {
          success(res);
        } else if (typeof error === "function") {
          error(res);
          return;
        }
      }
      const { headers } = res;
      yield put({
        type: "saveSupplier",
        payload: res.data,
        headers
      });
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        contractList: action.payload,
        contractTotal: action.headers["x-content-total"] >> 0
      };
    },
    saveSupplier(state, action) {
      return {
        ...state,
        supplierList: action.payload,
        supplierTotal: action.headers["x-content-total"] >> 0
      };
    }
  }
};
