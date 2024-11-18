import { parseJwt } from '../../utils/jwt';

const state = {
    token: localStorage.getItem('JWT_Token') || null,
    userId: null,
    userName: null,
    userEmail: null,
    userPhone: null,
    userStatusId: null,
    permissions: [], //存儲權限ID列表
    loginRecordId: null,
};

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token;
        if (token) {
            localStorage.setItem('JWT_Token', token);
        } else {
            localStorage.removeItem("JWT_Token");
        }
    },
    SET_USER_INFO(state, userInfo) {
        state.userId = userInfo.sub;
        state.userName = userInfo.userName || '';
        state.userEmail = userInfo.userEmail;
        state.userPhone = userInfo.userPhone;
        state.userStatusId = userInfo.userStatusId;
        state.permissions = userInfo.permissionId || [];
        state.loginRecordId = userInfo.loginRecordId;
    },
    SET_PERMISSIONS(state, permissions) {
        state.permissions = permissions;
    },
    CLEAR_AUTH(state) {
        state.token = null;
        state.userId = null;
        state.userName = null;
        state.userEmail = null;
        state.userPhone = null;
        state.userStatusId = null;
        state.permissions = [];
        state.loginRecordId = null;
        localStorage.removeItem('JWT_Token');
    }
};

const actions = {
    // 登入成功後的處理
    async loginSuccess({ commit }, token) {
        try {
            commit('SET_TOKEN', token);
            const userInfo = parseJwt(token);
            if (userInfo) {
                console.log('解析後的用戶訊息:', userInfo); // 用於調試
                commit('SET_USER_INFO', userInfo);
            } else {
                console.error('無法解析用戶訊息');
            }
        } catch (error) {
            console.error('處理登入成功時發生錯誤:', error);
        }
    },
    // 登出
    logout({ commit }) {
        commit('CLEAR_AUTH');
    },
    // 加載權限
    setPermissions({ commit }, permissions) {
        commit('SET_PERMISSIONS', permissions);
    }
};

const getters = {
    isAuthenticated: state => !!state.token,
    userPermissions: state => state.permissions,
    hasPermission: (state) => (permissionId) => {
        return state.permissions.includes(permissionId);
    },
    hasAnyPermission: (state) => (permissionIds) => {
        return permissionIds.some(id => state.permissions.includes(id));
    },
    userName: state => state.userName || 'User',
    userEmail: state => state.userEmail,
};


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};