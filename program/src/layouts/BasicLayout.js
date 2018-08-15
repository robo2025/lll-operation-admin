import React from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Layout, Icon, message, Spin, Form } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import { getMenuData } from '../common/menu';
import Authorized from '../utils/Authorized';
import logo from '../assets/logo.svg';
import ModifyPassword from '../components/ModifyPassword/ModifyPassword';
import { logout, jumpToLogin, login } from '../services/user';
import { convertCodeToName } from '../constant/operationPermissionDetail';

const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const { Content } = Layout;
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});
@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
    passwordModalVisible: false,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });

    this.props.dispatch({
      type: 'user/fetchCurrent',
      callback: () => {},
    });
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '工业魔方';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 工业魔方`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };
  getRedirectUrl = (filterMenu) => {
    const findRedirectUrl = (data) => {
      if (data.children && data.children.length > 0) {
        return findRedirectUrl(data.children[0]);
      } else {
        return data.path;
      }
    };
    const redirectUrl = findRedirectUrl(filterMenu);
    return redirectUrl;
  };
  getAuthoritedMenuData = (permissions) => {
    const menuData = getMenuData();
    if (!permissions || !menuData) {
      return [];
    }
    const findMenu = (data, name) => {
      return data.map((item) => {
        let result = { ...item };
        if (item.name === name) {
          const redirectPathname = this.getRedirectUrl(item);
          result = { ...item, authority: '3', redirectPathname };
        }
        if (item.children) {
          findMenu(item.children, name);
        }
        return result;
      });
    };
    const findAuthoritedMenu = (data) => {
      let result = [...data];
      // convertCodeToName转成中文
      convertCodeToName(_.flattenDeep(Object.values(permissions))).forEach(
        (menuName) => {
          result = findMenu(result, menuName);
        }
      );
      return result;
    };
    const authoritedMenuData = findAuthoritedMenu(menuData);
    return authoritedMenuData;
    // return authoritedMenuData;
  };
  onCancel = () => {
    // 修改密码模态框取消
    this.setState({
      passwordModalVisible: false,
    });
  };
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };
  handleMenuClick = (e) => {
    const { key } = e;
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      // 退出登录
      logout();
    }
    if (key === 'modifyPassword') {
      this.setState({
        passwordModalVisible: true,
      });
    }
  };
  modifyPasswordOk = (values) => {
      const { dispatch } = this.props;
      dispatch({
          type: 'user/fetchModifyPassword',
          params: values,
          success: (res) => {
              message.success(res.msg);
              login();
              this.setState({
                  passwordModalVisible: false,
              });
          },
          error: (error) => {
              console.log(error);
              if (error.msg.indexOf(':') !== -1) {
                  message.error(error.msg.split(':')[1]);
              } else {
                  message.error(error.msg);
              }
          },
      });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  render() {
    const {
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
      currentUser,
    } = this.props;
    const { passwordModalVisible } = this.state;
    const { permissions } = currentUser || [];
    const menuData = this.getAuthoritedMenuData(permissions);
    const redirectUrl = menuData.filter((ele) => {
      return ele.redirectPathname;
    });
    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout>
        {permissions ? (
          <SiderMenu
            logo={logo}
            // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
            // If you do not have the Authorized parameter
            // you will be forced to jump to the 403 interface without permission
            Authorized={Authorized}
            menuData={menuData}
            collapsed={collapsed}
            location={location}
            isMobile={this.state.isMobile}
            onCollapse={this.handleMenuCollapse}
          />
        ) : null}
        {/* <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        /> */}
        <Layout>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            isMobile={this.state.isMobile}
            onNoticeClear={this.handleNoticeClear}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
          />
          {permissions ? (
            <Content style={{ margin: '24px 24px 0', height: '100%' }}>
              <div style={{ minHeight: 'calc(100vh - 260px)' }}>
                <Switch>
                  {redirectData.map(item => (
                    <Redirect
                      key={item.from}
                      exact
                      from={item.from}
                      to={item.to}
                    />
                  ))}
                  {getRoutes(match.path, routerData).map(item => (
                    <AuthorizedRoute
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      authority={item.authority}
                      redirectPath="/exception/403"
                    />
                  ))}
                  {redirectUrl.length > 0 ? (
                    <Redirect
                      exact
                      from="/"
                      to={`${redirectUrl[0].redirectPathname}`}
                    />
                  ) : (
                    <Redirect exact from="/" to="product/menu" />
                  )}
                  <Route render={NotFound} />
                </Switch>
              </div>
              <GlobalFooter
                // links={[{
                //   title: 'Pro 首页',
                //   href: 'http://pro.ant.design',
                //   blankTarget: true,
                // }, {
                //   title: 'GitHub',
                //   href: 'https://github.com/ant-design/ant-design-pro',
                //   blankTarget: true,
                // }, {
                //   title: 'Ant Design',
                //   href: 'http://ant.design',
                //   blankTarget: true,
                // }]}
                copyright={
                  <div>
                    Copyright <Icon type="copyright" /> 2018 工业魔方
                  </div>
                }
              />
              <ModifyPassword
                passwordModalVisible={passwordModalVisible}
                onCancel={this.onCancel}
                modifyPasswordOk={this.modifyPasswordOk}
                currentUser={currentUser}
              />
            </Content>
          ) : (
            <Spin />
          )}
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
}))(BasicLayout);
