import { isUrl } from '../utils/utils';

const menuData = [
  {
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
  },
  {
    name: '商品管理',
    icon: 'shop',
    path: 'goods',
    children: [
      {
        name: '供应商商品列表',
        path: 'list',
      },
    ],
  },
  {
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
  },
  {
    name: '退货管理',
    path: 'returns',
    icon: 'disconnect',
    children: [
      {
        name: '退货单列表',
        path: 'list',
      },
    ],
  },
  {
    name: '品牌管理',
    path: 'brand',
    icon: 'apple-o',
    children: [
      {
        name: '品牌列表',
        path: 'list',
      },
    ],
  },
  {
    name: '方案管理',
    path: 'solution',
    icon: 'solution',
    children: [
      {
        name: '方案询价单列表',
        path: 'priceQuotation',
      },
      {
        name: '方案订单列表',
        path: 'orders',
      },
    ],
  },
  {
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
  },
  {
    name: '库存管理',
    path: 'stockManagement',
    icon: 'api',
    children: [
      {
        name: '商品库存列表',
        path: 'goodsStockList',
      },
      {
        name: '库存记录',
        path: 'goodsStockRecordList',
      },
      {
        name: '库存配置',
        path: 'stockConfigList',
      },
    ],
  },
  {
    name: '合同管理',
    path: 'contractManagement',
    icon: 'code-o',
    children: [
      {
        name: '合同列表',
        path: 'contractList',
      },
    ],
  },
  {
    name: '系统账号管理',
    path: 'sysAccountManagement',
    icon: 'select',
    children: [
      {
        name: '账号列表',
        path: 'accountList',
      },
      {
        name: '角色权限',
        path: 'rolePermission',
      },
      {
        name: '部门管理',
        path: 'department',
      },
      {
        name: '职位管理',
        path: 'positions',
      },
    ],
  },
  {
    name: '供应商账号管理',
    path: 'supAccountManagement',
    icon: 'team',
    children: [
      {
        name: '供应商账号审核',
        path: 'accountCheckList',
      },
      {
        name: '供应商主账号列表',
        path: 'accountList',
      },
    ],
  },
  {
    name: '供应商产品授权',
    path: 'authorizationManagement',
    icon: 'check-circle-o',
    children: [
      {
        name: '供应商产品授权列表',
        path: 'authorizationList',
      },
    ],
  },
  {
    name: '用户中心',
    path: 'userCenter',
    icon: 'user',
    children: [
      {
        name: '账号管理',
        path: 'accountManagementList',
      },
    ],
  },
];

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
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority
      );
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
