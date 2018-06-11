import { testTimeout } from '../services/testApi';
import { SUCCESS_STATUS } from '../constant/config.js';


export default {
  namespace: 'testApi',

  state: {
    list: [],
  },

  effects: {
    *fetchTimeout({ success, error }, { call, put }) {
      const response = yield call(testTimeout);
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') success(response);
      } else if (typeof error === 'function') { error(response); return; }
      
      const { headers } = response;
      yield put({
        type: 'save',
        payload: response.data,
        headers,
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
  },
};
