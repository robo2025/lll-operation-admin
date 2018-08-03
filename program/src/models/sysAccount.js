import { queryPositionList, editPosition } from '../services/sysAccount';

export default {
  namespace: 'sysAccount',
  state: {
    positionList: [],
  },

  effects: {
    *fetchPositions({ success, error }, { call, put }) {
      const res = yield call(queryPositionList);
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'save',
        payload: res.data,
      });
    },
    *fetchEditPosition({ params, success, error }, { call }) {
      const res = yield call(editPosition, { params });
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
    save(state, action) {
      return {
        ...state,
        positionList: action.payload,
      };
    },
  },
};
