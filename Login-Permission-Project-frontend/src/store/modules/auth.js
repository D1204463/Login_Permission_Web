import { parseJwt } from '../../utils/jwt';
import { getLoginRecord } from "../../utils/loginRecordUtils.js";
import { login } from "../../utils/loginUtils.js";
import { handleError } from "../../utils/handleError.js";

export default {
    namespaced: true, // 添加命名空間
    state: {
        userInfo: {
            userId: null,
            userName: null,
            userEmail: null,
            userPhone: null,
            userStatusId: null,
            permissionCode: [],
            loginRecordId: null,
            departmentAndUnit: [],
        },
        isAuthenticated: false,
        loginRecords: [],
        failLoginRecordMessage: null
    },
    mutations: {
        setUserInfo(state, token) {
            const user = parseJwt(token);
            if (user) {
                state.userInfo = {
                    userId: user.sub,
                    userName: user.userName || '',
                    userEmail: user.userEmail || '',
                    userPhone: user.userPhone || '',
                    loginRecordId: user.loginRecordId,
                    userStatusId: user.userStatusId,
                    permissionCode: Array.isArray(user.permissionCode) ? user.permissionCode : [], // 確保是陣列
                    departmentAndUnit: Array.isArray(user.departmentAndUnit) ? user.departmentAndUnit : [],
                };
            }
        },
        setFailRecordMessage(state, message) {
            state.failLoginRecordMessage = message;
        },
        setLoginRecord(state, record) {
            state.loginRecords = record;
            console.log("testing setLoginRecord:", state.loginRecords);
        },
        setToken(state, token) {
            localStorage.setItem('JWT_Token', token);
        },
        setAuthenticated(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
        },
        clearUserInfo(state) {
            state.userInfo = {
                userId: null,
                userName: null,
                userEmail: null,
                userPhone: null,
                loginRecordId: null,
                userStatusId: null,
                permissionCode: [],
                departmentAndUnit: [],
            };
            state.isAuthenticated = false;
            state.loginRecords = null;
        },
        clearToken() {
            localStorage.removeItem('JWT_Token');
        }
    },
    actions: {
        //實作登錄
        async login({ commit }, { employee_id, password }) {
            try {
                const response = await login(employee_id, password);

                if (response.status === 200) {
                    console.log("登錄成功");
                    // 解析獲取的JWT token（JWT token）
                    const token = await response.text();
                    console.log('Received token:', token);
                    commit('setToken', token);
                    commit('setUserInfo', token);
                    commit('setAuthenticated', true);

                    return { success: true, message: "登錄成功" };

                } else {
                    let errorMessage = await handleError(response);
                    return { success: false, message: errorMessage };
                }
            } catch (error) {
                console.error("登錄請求失敗:", error);
                return { success: false, message: "登錄失敗，請檢查網路是否連線正常" };
            }
        },

        async logout({ commit }) {
            try {
                const token = localStorage.getItem('JWT_Token');
                if (token) {
                    // 可選：發送登出請求到後端
                    await fetch("http://localhost:8085/employee/test/logout", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                }
            } catch (error) {
                console.error("登出請求失敗:", error);
            } finally {
                // 無論後端請求成功與否，都清除本地狀態
                commit("clearUserInfo");
                commit('clearToken');
            }
        },
        //獲取登錄紀錄
        async getLoginRecord({ commit }) {
            const token = localStorage.getItem("JWT_Token");
            if (token === null) {
                commit("setFailRecordMessage", "找不到token, 請嘗試重新登錄")
            }
            try {
                const response = await getLoginRecord(token);
                if (response.ok) {
                    const loginRecord = await response.json();
                    console.log("loginRecord:", loginRecord);
                    commit("setLoginRecord", loginRecord)

                } else {
                    console.log("獲取登錄紀錄失敗," + await response.text());
                }
            } catch (error) {
                console.log("獲取登錄紀錄失敗,請檢查連線是否正常");
            }
        }
    },
    getters: {
        // 修正為函數形式
        isAuthenticated: (state) => {
            return state.isAuthenticated;
        },
        userName: (state) => {
            return state.userInfo.userName;
        },
        userPermissions: (state) => {
            return state.userInfo.permissionCode;
        },
        userDepartmentAndUnit: (state) => {
            return state.userInfo.departmentAndUnit;
        },
        hasPermission: (state) => (permission) => {
            return state.userInfo.permissionCode.includes(permission);
        },
        hasAnyPermission: (state) => (permissions) => {
            return permissions.some(permission =>
                state.userInfo.permissionCode.includes(permission)
            );
        },
        filterLoginRecord: (state) => (time, status) => {
            return state.loginRecords.filter(record => {
                return record.time === time && record.status === status;
            });
        }
    }
};