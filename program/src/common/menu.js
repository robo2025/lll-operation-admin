const menuData = [{
  name: '产品管理',
  icon: 'appstore-o',
  path: 'product',
  children: [
    {
      name: '产品类目列表',
      path: 'menu',
    },
    {
      name: '产品型号列表',
      path: 'type',
    },
    {
      name: '产品列表',
      path: 'list',
    },
  ],

}, {
  name: '商品管理',
  icon: 'shop',
  path: 'goods',
  children: [
    {
      name: '供应商商品列表',
      path: 'list',
    },
  ],
}, {
  name: '客户订单管理',
  path: 'orders',
  icon: 'bars',
  children: [
    {
      name: '客户订单列表',
      path: 'list',
    },
    {
      name: '异常订单列表',
      path: 'exception-list',
    },
  ],
}, {
  name: '退货管理',
  path: 'returns',
  icon: 'bars',
  children: [
    {
      name: '退货单列表',
      path: 'list',
    },
  ],
}, {
  name: '品牌管理',
  path: 'brand',
  icon: 'bars',
  children: [
    {
      name: '品牌列表',
      path: 'list',
    },
    {
      name: '新增品牌',
      path: 'add',
    },
    {
      name: '编辑品牌',
      path: 'edit',
    },
    {
      name: '查看品牌',
      path: 'view',
    },
  ],
}, {
  name: '导入导出管理',
  path: 'import-export',
  icon: 'bars',
  children: [
    {
      name: '导入列表',
      path: 'import-list',
    },
    {
      name: '导出列表',
      path: 'export-list',
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
