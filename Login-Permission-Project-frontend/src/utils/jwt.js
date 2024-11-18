export function parseJwt(token) {
    try {
        // 檢查 token 是否存在且為字串
        if (!token || typeof token !== 'string') {
            console.error('Invalid token format');
            return null;
        }

        // 分割 token
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid JWT format');
            return null;
        }

        // 解碼 payload
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // 處理填充
        const pad = '='.repeat((4 - base64.length % 4) % 4);
        const jsonPayload = atob(base64 + pad);

        // 解析 JSON
        const payload = JSON.parse(jsonPayload);

        return {
            sub: payload.sub || null,
            userName: payload.userName || null,
            userEmail: payload.userEmail || null,
            userPhone: payload.userPhone || null,
            userStatusId: payload.userStatusId || null,
            permissionId: Array.isArray(payload.permissionId) ? payload.permissionId : [],
            loginRecordId: payload.loginRecordId || null
        };
    } catch(e) {
        console.error('JWT 解析錯誤:', e);
        console.log('原始 token:', token);
        return null;
    }
}

// 檢查權限是否存在
export function checkPermission(requiredPermission, userPermissions) {
    if(!userPermissions) return false;
    return userPermissions.includes(requiredPermission);
}

// 檢查多個權限是否存在(任一)
export function checkAnyPermission(requiredPermissions, userPermissions) {
    if(!userPermissions) return false;
    return requiredPermissions.some(permission => userPermissions.includes(permission));
}

// 定義權限常量
export const PERMISSIONS = {
    DEPT_FULL_ACCESS: 1,     // 部門完整權限
    DEPT_PARTIAL_ACCESS: 4,  // 部門部分權限
    UNIT_FULL_ACCESS: 2,     // 科別完整權限
    LOGIN_RECORD_ACCESS: 3   // 登入記錄權限
}
