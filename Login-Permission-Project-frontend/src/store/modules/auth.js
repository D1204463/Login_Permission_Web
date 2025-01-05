import { parseJwt } from '../../utils/jwt';
import { getLoginRecord } from "../../utils/loginRecordUtils.js";
import { login } from "../../utils/loginUtils.js";
import { handleError } from "../../utils/handleError.js";
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
            loginRecords: [],
            employeeDepartment: null,
            employeePosition: null,
            employeeStatus: null,
            roles: [],
        },
        isAuthenticated: false, // 用來追蹤使用者是否已登入
        failLoginRecordMessage: null
    },
    mutations: {
        // 僅用於登入後設置使用者id資訊
        setUserInfo(state, token) {
            const user = parseJwt(token); // 解析 JWT token
            if (user) {
                state.userInfo = {
                    userId: user.sub,
                };
                state.isAuthenticated = true;
            } else {
                console.log("JWT missing");
            }
        },
        //登入後更新使用者的資訊,
        updateUserInfo(state, employeeData) {
            // 根據 API 回傳的資料結構更新 userInfo
            state.userInfo = {
                ...state.userInfo,
                userId: employeeData.employee_id,
                userName: employeeData.name,
                userEmail: employeeData.email,
                userPhone: employeeData.phoneNumber,
                userStatusId: employeeData.status_id,
                employeeStatus: employeeData?.employeeStatus?.name ?? '未設定狀態',
                employeePosition: employeeData?.position?.position ?? '未設定職位',
                employeeDepartment: employeeData?.department?.department_name ?? '未設定部門',
                roles: employeeData.roles ?? [],
                // 從員工角色中提取所有權限碼
                permissionCode: (employeeData.roles ?? []).reduce((acc, role) => {
                    const permissions = role.permissions?.map(p => p.permission_code) ?? [];
                    return [...acc, ...permissions];
                }, [])
            };
        },
        setFailRecordMessage(state, message) {
            state.failLoginRecordMessage = message;
        },
        setLoginRecord(state, record) {
            state.userInfo.loginRecords = record;
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
        async initializeAuth({ commit, dispatch }) {
            const token = localStorage.getItem('JWT_Token');
            if (!token) {
                return false;
            }
    
            try {
                commit('setToken', token);
                commit('setUserInfo', token);
                commit('setAuthenticated', true);
    
                const userData = parseJwt(token);
                if (!userData || !userData.sub) {
                    throw new Error('Invalid token');
                }
    
                const employeeResponse = await getEmployeeIdInfo(token, userData.sub);
                if (employeeResponse && employeeResponse.data) {
                    commit('updateUserInfo', employeeResponse.data);
                    return true;
                }
                return false;
            } catch (error) {
                console.error('初始化失敗:', error);
                commit('clearUserInfo');
                commit('clearToken');
                return false;
            }
        },
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
                    // 登入成功後，使用 userId 立即獲取權限, 以及其他登入用戶的資訊
                    try {
                        // 獲取員工資訊
                        const employeeResponse = await getEmployeeIdInfo(token, userId);
                        // 更新員工資訊，包括權限
                        if (employeeResponse && employeeResponse.data) {
                            commit('updateUserInfo', employeeResponse.data);
                            console.log('User info updated successfully:', employeeResponse.data);
                        }

                        // 只有在資訊加載完成後才返回成功
                        return { success: true, message: "登錄成功，權限加載完成" };
                    } catch (error) {
                        console.log("獲取員工資訊失敗:", error);
                        throw error;
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
        async getLoginRecord({ commit, state }) {
            const token = localStorage.getItem("JWT_Token");
            if (!token) {
                commit("setFailRecordMessage", "找不到token, 請嘗試重新登錄");
                return;
            }

            try {
                // 使用當前登入用戶的 ID
                const userId = state.userInfo.userId;
                if (!userId) {
                    commit("setFailRecordMessage", "無法獲取用戶ID");
                    return;
                }

                const response = await getLoginRecord(token, userId);
                if (response.ok) {
                    const responseData = await response.json();
                    // 確保使用 responseData.data 來獲取實際的登入記錄數組
                    console.log("獲取的登入記錄:", responseData);
                    if (responseData.data) {
                        // 對登入記錄進行排序，最新的排在前面
                        const sortedRecords = responseData.data.sort((a, b) => {
                            const timeA = new Date(a.login_time).getTime();
                            const timeB = new Date(b.login_time).getTime();
                            return timeB - timeA; // 降序排序
                        });
                        commit("setLoginRecord", sortedRecords);
                    }
                } else {
                    const errorMessage = await response.text();
                    commit("setFailRecordMessage", `獲取登錄紀錄失敗: ${errorMessage}`);
                }
            } catch (error) {
                commit("setFailRecordMessage", "獲取登錄紀錄失敗,請檢查連線是否正常");
                console.error("獲取登錄紀錄錯誤:", error);
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
        loginRecords: (state) => {
            return state.userInfo.loginRecords;
        },
        failLoginRecordMessage: (state) => {
            return state.failLoginRecordMessage;
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