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
  queryAccountDetail,
  addAccount,
  editAccount,
  deleteAccount,
  accountChangeActive,
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
    accountList: [], // 帐号列表
    accountTotal: 0, // 帐号总数
    roleLevel: [], // 角色联动
    accountDetail: {}, // 帐号详情
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
    *fetchAccountDetail({ userid, success, error }, { call, put }) {
        const res = yield call(queryAccountDetail, { userid });
        const { rescode } = res;
        if (rescode >> 0 === 10000) {
          if (success) {
            success(res);
          }
        } else if (error) {
          error(res);
        }
        yield put({
          type: 'saveAccountDetail',
          payload: res.data,
        });
    },
    *fetchAddAccount({ params, success, error }, { call }) {
        const res = yield call(addAccount, { params });
        const { rescode } = res;
        if (rescode >> 0 === 10000) {
          if (success) {
            success(res);
          }
        } else if (error) {
          error(res);
        }
    },
    *fetchEditAccount({ params, userid, success, error }, { call }) {
        const res = yield call(editAccount, { params, userid });
        const { rescode } = res;
        if (rescode >> 0 === 10000) {
          if (success) {
            success(res);
          }
        } else if (error) {
          error(res);
        }
    },
    *fetchDeleteAccount({ userid, success, error }, { call }) {
        const res = yield call(deleteAccount, { userid });
        const { rescode } = res;
        if (rescode >> 0 === 10000) {
          if (success) {
            success(res);
          }
        } else if (error) {
          error(res);
        }
    },
    *fetcChangeStatus({ userid, active_status, success, error }, { call }) {
        const res = yield call(accountChangeActive, { userid, active_status });
        const { rescode } = res;
        if (rescode >> 0 === 10000) {
          if (success) {
            success(res);
          }
        } else if (error) {
          error(res);
        }
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
    saveAccountDetail(state, action) {
        console.log(action.payload);
        return {
            ...state,
            accountDetail: action.payload,
        };
    },
  },
};
