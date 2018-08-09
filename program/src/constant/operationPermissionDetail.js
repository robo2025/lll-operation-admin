const operationPermissionDetail = [
  {
    code: 'brand_all',
    name: '品牌管理',
  },
  {
    code: 'product_all',
    name: '产品管理',
  },
  {
    code: 'goods_all',
    name: '商品管理',
  },
  {
    code: 'contract_all',
    name: '合同管理',
  },
  {
    code: 'order_all',
    name: '订单管理',
  },
  {
    code: 'stock_all',
    name: '库存管理',
  },
  {
    code: 'return_all',
    name: '退货管理',
  },
  {
    code: 'refund_all',
    name: '退款管理',
  },
  {
    code: 'product_model_all',
    name: '产品型号管理',
  },
  {
    code: 'product_category_all',
    name: '产品分类管理',
  },
  {
    code: 'supplier_account_all',
    name: '供应商账号管理',
  },
  {
    code: 'product_authorization_all',
    name: '供应商产品授权管理',
  },
  {
    code: 'supplier_account_audit_all',
    name: '供应商账号审核管理',
  },
];
const operationAllPermissions = operationPermissionDetail.map(
  item => item.name
);

const convertCodeToName = (codeList) => {
  if (!codeList) {
    return [];
  } else {
    let result = [];
    codeList.map((code) => {
      return operationPermissionDetail.map((item) => {
        if (item.code === code) {
          result = [...result, item.name];
        }
        return null;
      });
    });
    return result;
  }
};
const convertNameToCode = (nameList) => {
  if (!nameList) {
    return [];
  } else {
    let result = [];
    nameList.map((name) => {
      return operationPermissionDetail.map((item) => {
        if (item.name === name) {
          result = [...result, item.code];
        }
        return null;
      });
    });
    return result;
  }
};
export default operationPermissionDetail;
export {
  operationPermissionDetail,
  operationAllPermissions,
  convertCodeToName,
  convertNameToCode,
};
