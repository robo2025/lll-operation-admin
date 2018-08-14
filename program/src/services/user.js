import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { TOKEN_NAME, URL, USERS_URL, LOGIN_URL, LOGOUT_URL, REGISTER_URL, VERIFY_PAGE, HOME_PAGE, MAIN_URL, USERS_SERVER } from '../constant/config';


// 获取用户信息
export async function getUserInfo() {
  return lyRequest(`${URL}/server/verify`);
}


// 获取供应商信息
export async function getSupplierInfo(supplierid) {
  return lyRequest(`${USERS_URL}/suppliers/${supplierid}`);
}

// 注册操作
export function register() {
  window.location.href = `${REGISTER_URL}?next=${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}`;
}
// 登出
export function logout() {
  const accessToken = Cookies.get(TOKEN_NAME);
  if (accessToken) {
    Cookies.remove(TOKEN_NAME);
    window.location.href = `${LOGOUT_URL}?access_token=${accessToken}&next=${HOME_PAGE}`;
  } else {
    window.location.href = `${LOGOUT_URL}`;
  }
}

// 登录操作
export function login() {
  // console.log("登录URL--------------",LOGIN_URL + `?next=${encodeURIComponent(VERIFY_PAGE)}`);
  window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}&from=operation`;
}


// 纯跳转到登录页面
export function jumpToLogin() {
  window.location.href = `${LOGIN_URL}?next=${encodeURIComponent(VERIFY_PAGE)}&disable_redirect=1&from=operation`;  
}

// 获取手机验证码
export async function getSMSCode({ mobile }) {
  return lyRequest(`${MAIN_URL}/common/sms?mobile=${mobile}`);
}
// 修改密码

export async function modifyPassword({ params }) {
    return lyRequest(`${USERS_SERVER}/operation/accounts/password`, {
        method: 'put',
        data: params,
    });
}
