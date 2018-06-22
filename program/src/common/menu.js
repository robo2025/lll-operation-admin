import { isUrl } from '../utils/utils';

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
      name: '产品列表',
      path: 'list',
    },
    {
      name: '产品型号列表',
      path: 'model',
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
  name: '商品订单管理',
  path: 'orders',
  icon: 'pay-circle-o',
  children: [
    {
      name: '商品订单列表',
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
  icon: 'disconnect',
  children: [
    {
      name: '退货单列表',
      path: 'list',
    },
  ],
}, {
  name: '品牌管理',
  path: 'brand',
  icon: 'apple-o',
  children: [
    {
      name: '品牌列表',
      path: 'list',
    },
  ],
}, {
  name: '导入导出管理',
  path: 'import-export',
  icon: 'export',
  hideInMenu: true, // 隐藏导入导出菜单
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

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);

