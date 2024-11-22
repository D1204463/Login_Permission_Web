import { parseJwt } from '../../utils/jwt';

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
        },
        isAuthenticated: false,
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
                };
            }
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
            };
            state.isAuthenticated = false;
        },
        clearToken() {
            localStorage.removeItem('JWT_Token');
        }
    },
    actions: {
        async login({ commit }, { userName, userPassword }) {
            try {
                const response = await fetch("http://localhost:8085/employee/test/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        employee_id: userName,
                        password: userPassword
                    })
                });

                // 檢查響應狀態
                if (response.status === 200) {
                    console.log("登錄成功");
                    // 直接獲取文本響應（JWT token）
                    const token = await response.text();
                    console.log('Received token:', token);

                    // 儲存 token
                    commit('setToken', token);
                    // 解析並儲存用戶訊息
                    commit('setUserInfo', token);
                    // 設置認證狀態
                    commit('setAuthenticated', true);

                    return {
                        success: true,
                        message: "登錄成功"
                    };
                } else {
                    let errorMessage;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message;
                    } catch (e) {
                        errorMessage = await response.text();
                    }
                    
                    return { 
                        success: false, 
                        message: errorMessage || "登入失敗，請檢查帳號密碼是否正確" 
                    };
                }
            } catch (error) {
                console.error("登錄請求失敗:", error);
                return {
                    success: false,
                    message: "登錄失敗，請檢查網路是否連線正常"
                };
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
        hasPermission: (state) => (permission) => {
            return state.userInfo.permissionCode.includes(permission);
        },
        hasAnyPermission: (state) => (permissions) => {
            return permissions.some(permission =>
                state.userInfo.permissionCode.includes(permission)
            );
        }
    }
};