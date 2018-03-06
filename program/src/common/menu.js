const menuData = [{
  name: '产品管理',
  icon: 'appstore-o',
  path: 'product',
  children: [
    {
      name: '1. 产品类目管理',
      path: 'menu',
    },
    {
      name: '2.  产品列表',
      path: 'list',
    },
  ],

}, {
  name: '商品管理',
  icon: 'shop',
  path: 'goods',
  children: [
    {
      name: '1. 供应商商品列表',
      path: 'list',
    },
  ],
}, {
  name: '客户订单管理',
  path: 'orders',
  icon: 'bars',
  children: [
    {
      name: '1. 订单列表',
      path: 'list',
    },
    {
      name: '2. 订单详情',
      path: 'detail',
    },
  ],
}];

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData);
