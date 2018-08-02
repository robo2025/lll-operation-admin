import Cookies from 'js-cookie';
import { getSupplierInfo, getUserInfo, getSMSCode } from '../services/user';
import { setAuthority } from '../utils/authority';
import {
  SUCCESS_STATUS,
  TOKEN_NAME,
  LOGIN_URL,
  VERIFY_PAGE,
  HOME_PAGE,
} from '../constant/config.js';
import { queryString } from '../utils/tools';
import Services from '../utils/customerService';

export default {
  namespace: 'user',

  state: {
    list: [],
    info: {},
    loading: false,
    currentUser: {},
    supplier: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(getUserInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
      Cookies.set('userinfo', JSON.stringify(response.data), { expires: 7 });
      // 注册客服;
      Services.service.initService({
        username: response.data.username,
        mobile: response.data.mobile,
        email: response.data.email,
      });
    },
    *changeAuthorityUrl(_, { call }) {
      yield call(getUserInfo);
      setAuthority('2');
      location.href = `${HOME_PAGE}`;
    },
    *verify(_, { call, put }) {
      const { href } = window.location;
      const paramas = queryString.parse(href);
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        yield put({ type: 'changeAuthorityUrl' });
      } else if (paramas.access_token) {
        /* 判断url是否有access_token,如果有则将其存储到cookie */
        const accessToken = paramas.access_token.split('#/')[0];
        if (location.host.indexOf('robo2025') !== -1) {
          Cookies.set(TOKEN_NAME, accessToken, {
            expires: 7,
            path: '/',
            domain: '.robo2025.com',
          });
        } else {
          Cookies.set(TOKEN_NAME, accessToken);
        }
        yield put({ type: 'changeAuthorityUrl' });
      } else {
        window.location.href = `${LOGIN_URL}?next=${VERIFY_PAGE}&from=supplier`;
      }
    },
    *fetchSupplierInfo({ supplierid }, { call, put }) {
      const response = yield call(getSupplierInfo, supplierid);
      yield put({
        type: 'saveSupplier',
        payload: response.data,
      });
    },
    *fectchSMS({ mobile, success, error }, { call }) {
      const response = yield call(getSMSCode, { mobile });
      if (response.rescode >> 0 === SUCCESS_STATUS) {
        if (typeof success === 'function') {
          success(response);
        }
      } else if (typeof error === 'function') {
        error(response);
      }
    },
  },

  reducers: {
    save(state, action) {
      setAuthority(action.payload.user_type);
      return {
        ...state,
        info: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveSupplier(state, action) {
      return {
        ...state,
        supplier: action.payload,
      };
    },
  },
};
