import { parseJwt } from '../../utils/jwt';
import { getLoginRecord } from "../../utils/loginRecordUtils.js";
import { login } from "../../utils/loginUtils.js";
import { handleError } from "../../utils/handleError.js";
import { getPermissions } from '../../utils/permissionUtils.js';
import { getEmployeeIdInfo } from '../../utils/EmployeeInfo.js';
import { PERMISSIONS } from '../../constants/permissions.js';


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
            employeeDepartment: null,
            employeePosition: null,
            employeeStatus: null,
            roles: [],
        },
        isAuthenticated: false, // 用來追蹤使用者是否已登入
        loginRecords: [],
        failLoginRecordMessage: null
    },
    mutations: {
        // 設置使用者資訊
        setUserInfo(state, token) {
            const user = parseJwt(token); // 解析 JWT token
            if (user) {
                state.userInfo = {
                    userId: user.sub,
                    userName: user.userName || '',
                    userEmail: user.userEmail || '',
                    userPhone: user.userPhone || '',
                    loginRecordId: user.loginRecordId,
                    userStatusId: user.userStatusId,
                    permissionCode: Array.isArray(user.permissionCode) ? user.permissionCode : [], // 確保是陣列
                };
                state.isAuthenticated = true;
            } else {
                console.log("JWT missing");
            }
        },
        updateUserInfo(state, employeeData) {
            // 根據 API 回傳的資料結構更新 userInfo
            state.userInfo = {
                ...state.userInfo,
                userId: employeeData.employee_id,
                userName: employeeData.name,
                userEmail: employeeData.email,
                userPhone: employeeData.phoneNumber,
                userStatusId: employeeData.status_id,
                employeeStatus: employeeData.employeeStatus.name,
                roles: employeeData.roles,
            };
        },
        setFailRecordMessage(state, message) {
            state.failLoginRecordMessage = message;
        },
        setLoginRecord(state, record) {
            state.loginRecords = record;
            console.log("testing setLoginRecord:", state.loginRecords);
        },
        // 儲存 token 到 localStorage
        setToken(state, token) {
            localStorage.setItem('JWT_Token', token);
        },
        setAuthenticated(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
        },
        setPermissions(state, permissions) {
            state.userInfo.permissionCode = permissions;
        },
        // 清除使用者資訊
        clearUserInfo(state) {
            state.userInfo = {
                userId: null,
                userName: null,
                userEmail: null,
                userPhone: null,
                loginRecordId: null,
                userStatusId: null,
                permissionCode: [],
                employeeDepartment: null,
                employeePosition: null,
                employeeStatus: null,
                roles: [],
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

                // 檢查響應狀態
                if (response.status === 200) {
                    console.log("登錄成功");
                    // 解析獲取的JWT token（JWT token）
                    const token = await response.text();
                    console.log('Received token:', token);

                    // 儲存 token
                    commit('setToken', token);
                    // 解析並儲存用戶訊息
                    commit('setUserInfo', token);
                    // 設置認證狀態
                    commit('setAuthenticated', true);

                    // 從 token 中解析出的用戶訊息中獲取 userId
                    const userData = parseJwt(token);
                    const userId = userData.sub;  // sub 是 userId
                    // 登入成功後，使用 userId 立即獲取權限
                    try {
                        // 並行獲取權限和員工資訊
                        const [permissions, employeeResponse] = await Promise.all([
                            getPermissions(token, userId),
                            getEmployeeIdInfo(token, userId)
                        ]);
                        // 儲存權限到 Vuex
                        if (permissions && permissions.data) {
                            commit('setPermissions', permissions.data);
                            console.log('Permissions set in Vuex:', permissions.data);
                        }

                        // 更新員工資訊
                        if (employeeResponse && employeeResponse.data) {
                            commit('updateUserInfo', employeeResponse.data);
                        }

                        console.log('Permissions fetched successfully:', permissions.data);
                        console.log('User info updated successfully:', employeeResponse.data);

                        // 只有在權限加載完成後才返回成功
                        return { success: true, message: "登錄成功，權限加載完成" };
                    } catch (permError) {
                        console.log("獲取權限失敗:", permError);
                        throw permError;
                    }
                } else {
                    let errorMessage = await handleError(response);
                    return { success: false, message: errorMessage };
                }
            } catch (error) {
                console.error("登錄請求失敗:", error);
                return { success: false, message: "登錄失敗，請檢查網路是否連線正常" };
            }
        },
        async refreshPermissions({ state, commit }) {
            const token = localStorage.getItem('JWT_Token');
            if (!token) {
                throw new Error('No token found');
            }

            const userId = state.userInfo.userId;
            if (!userId) {
                throw new Error('No user ID found');
            }
            try {
                const response = await getPermissions(token, userId);
                if (response && response.data) {
                    commit('setPermissions', response.data);
                    return response.data;
                }
            } catch (error) {
                console.log("更新權限失敗:", error);
                throw error;
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
        },
        setPermissions({ commit }, permissions) {
            commit('setPermissions', permissions);
        }
    },
    getters: {
        // 修正為函數形式
        isAuthenticated: (state) => {
            return state.isAuthenticated;
        },
        userId: (state) => {
            return state.userInfo.userId;
        },
        userName: (state) => {
            return state.userInfo.userName;
        },
        userPermissions: (state) => {
            return state.userInfo.permissionCode;
        },
        employeeStatus: (state) => {
            return state.userInfo.employeeStatus;
        },
        userRoles: (state) => {
            return state.userInfo.roles;
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