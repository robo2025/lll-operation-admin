import {
  queryPositionList,
  editPosition,
  deletePosition,
  queryDepartmentList,
  editDepartment,
  deleteDepartment,
  editDepartmentName,
  queryDeptLevel,
  queryRoleList,
  queryRoleDetail,
  addRole,
  editRole,
  deleteRole,
  queryAccountList,
  queryRoleLevel,
} from '../services/sysAccount';

export default {
  namespace: 'sysAccount',
  state: {
    positionList: [],
    departmentList: [],
    filterDataList: [], // 根据不同树节点传递不同数据
    deptLevel: [], // 可选择部门
    roleList: [], // 角色列表
    roleListTotal: 0, // 角色列表总数
    roleDetail: {}, // 角色详情
    accountList: [], // 账号列表
    accountTotal: 0, // 账号详情
    operationType: '', // 账号操作类型,view查看,modify编辑,add新增
    roleLevel: [], // 角色联动
  },

  effects: {
    *fetchPositions({ success, error }, { call, put }) {
      const res = yield call(queryPositionList);
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'save',
        payload: res.data,
      });
    },
    *fetchEditPosition({ params, success, error }, { call }) {
      const res = yield call(editPosition, { params });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchDeletePostiton({ positionId, success, error }, { call }) {
      const res = yield call(deletePosition, { positionId });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchDepartmentList({ success, error }, { call, put }) {
      const res = yield call(queryDepartmentList);
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveDepartment',
        payload: res.data,
      });
    },
    *fetchEditDepartment({ params, success, error }, { call }) {
      const res = yield call(editDepartment, { params });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchDeleteDepartment({ id, success, error }, { call }) {
      const res = yield call(deleteDepartment, { id });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchEditDepartmentName({ id, name, success, error }, { call }) {
      const res = yield call(editDepartmentName, { id, name });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchDeptLevel({ success, error }, { call, put }) {
      const res = yield call(queryDeptLevel);
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveDeptLevel',
        payload: res.data,
      });
    },
    *fetchRoleList({ params, offset, limit, success, error }, { call, put }) {
      const res = yield call(queryRoleList, { params, offset, limit });
      const { rescode, headers } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveRoleList',
        payload: res.data,
        headers,
      });
    },
    *fetchRoleDetail({ groupid, success, error }, { call, put }) {
      const res = yield call(queryRoleDetail, { groupid });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveRoleDetail',
        payload: res.data,
      });
    },
    *fetchAddRole({ params, success, error }, { call }) {
      const res = yield call(addRole, { params });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchEditRole({ params, groupid, success, error }, { call }) {
      const res = yield call(editRole, { params, groupid });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchDeleteRole({ groupid, success, error }, { call }) {
      const res = yield call(deleteRole, { groupid });
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
    },
    *fetchAccountList(
      { params, offset, limit, success, error },
      { call, put }
    ) {
      const res = yield call(queryAccountList, { params, offset, limit });
      const { rescode, headers } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveAccountList',
        payload: res.data,
        headers,
      });
    },
    *fetchRoleLevel({ success, error }, { call, put }) {
        const res = yield call(queryRoleLevel);
      const { rescode } = res;
      if (rescode >> 0 === 10000) {
        if (success) {
          success(res);
        }
      } else if (error) {
        error(res);
      }
      yield put({
        type: 'saveRoleLevel',
        payload: res.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        positionList: action.payload,
      };
    },
    saveDepartment(state, action) {
      return {
        ...state,
        departmentList: action.payload,
        filterDataList: action.payload,
      };
    },
    saveFilterList(state, action) {
      return {
        ...state,
        filterDataList: action.payload,
      };
    },
    saveDeptLevel(state, action) {
      return {
        ...state,
        deptLevel: action.payload,
      };
    },
    saveRoleList(state, action) {
      return {
        ...state,
        roleList: action.payload,
        roleListTotal: action.headers['x-content-total'],
      };
    },
    saveRoleDetail(state, action) {
      return {
        ...state,
        roleDetail: action.payload,
      };
    },
    saveAccountList(state, action) {
        return {
            ...state,
            accountList: action.payload,
            accountTotal: action.headers['x-content-total'] >> 0,
        };
    },
    saveOperationType(state, action) {
        return {
            ...state,
            operationType: action.payload,
        };
    },
    saveRoleLevel(state, action) {
        return {
            ...state,
            roleLevel: action.payload,
        };
    },
  },
};
