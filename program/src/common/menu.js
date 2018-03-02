const menuData = [{
  name: '商品管理',
  icon: 'dashboard',
  path: 'goods',
  children: [
    {
      name: '供应商商品列表',
      path: 'list',
    },
  ],
}, {
  name: '产品管理',
  icon: 'appstore-o',
  path: 'product',
  children: [
    {
      name: '产品列表',
      path: 'list',
    }, {
      name: '产品类目管理',
      path: 'menu',
    },
  ],
}, {
  name: '客户订单管理',
  path: 'orders',
  icon: 'bars',
  children: [
    {    
      name: '订单列表',
      path: 'list',
    },
    {    
      name: '订单详情',
      path: 'detail',
    },
  ],
}, {
  name: '使用文档',
  icon: 'book',
  path: 'http://blog.liaolunling.top',
  target: '_blank',
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
