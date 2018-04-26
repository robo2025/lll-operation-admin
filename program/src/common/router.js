import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const routerData = getRouterData(app);
    return component().then((raw) => {
      const Component = raw.default || raw;
      return props => <Component {...props} routerData={routerData} />;
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/goods/list': {
      component: dynamicWrapper(app, ['good'], () => import('../routes/GoodsManager')),
    },
    '/goods/:list/detail': {
      component: dynamicWrapper(app, ['user', 'good'], () => import('../routes/GoodDetail/GoodDetail')),
      name: '商品详情页',
    },
    '/product/list': {
      component: dynamicWrapper(app, ['product'], () => import('../routes/ProductManager')),
    },
    '/product/:list/new': {
      component: dynamicWrapper(app, ['product', 'catalog', 'upload'], () => import('../routes/NewProduct/NewProduct')),
      name: '新建产品信息',
    },
    '/product/:list/detail': {
      component: dynamicWrapper(app, ['product', 'catalog', 'upload'], () => import('../routes/ProductDetail/ProductDetail')),
      name: '产品详情',
    },
    '/product/:list/modify': {
      component: dynamicWrapper(app, ['product', 'catalog', 'upload'], () => import('../routes/NewProduct/ModifyProduct')),
      name: '产品信息',
    },
    '/product/menu': {
      component: dynamicWrapper(app, ['catalog'], () => import('../routes/ProductManager/MenuManager')),
    },
    '/orders/list': {
      component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/OrderList')),
    },
    '/orders/exception-list': {
      component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/ExceptionOrderList')),
    },
    '/orders/:list/detail': {
      component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/OrderDetail')),
      name: '订单详情',
    },
    '/orders/:exception-list/sold-out-order': {
      component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/SoldOutOrderDetail')),
      name: '订单详情',
    },
    '/orders/:exception-list/delay-order': {
      component: dynamicWrapper(app, ['order', 'catalog'], () => import('../routes/Order/DelayOrderDetail')),
      name: '订单详情',
    },
    '/returns/list': {
      component: dynamicWrapper(app, ['order', 'catalog', 'returns'], () => import('../routes/Returns/ReturnsList')),
    },
    '/returns/:list/detail': {
      component: dynamicWrapper(app, ['order', 'catalog', 'returns'], () => import('../routes/Returns/ReturnsDetail')),
      name: '退货单详情',
    },
    '/brand/list': {
      component: dynamicWrapper(app, [], () => import('../routes/Brand/BrandList')),
    },
    '/brand/:list/new': {
      component: dynamicWrapper(app, [], () => import('../routes/Brand/BrandNew')),
      name: '新增品牌',
    },
    '/brand/:list/modify': {
      component: dynamicWrapper(app, [], () => import('../routes/Brand/BrandModify')),
      name: '编辑品牌',
    },
    '/brand/:list/detail': {
      component: dynamicWrapper(app, [], () => import('../routes/Brand/BrandDetail')),
      name: '品牌详情',      
    },
   
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
