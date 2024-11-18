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

        // 解碼(base64) payload & 修正編碼問題(UTF-8)
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const pad = '='.repeat((4 - base64.length % 4) % 4);
        const rawPayload = atob(base64 + pad);

        // 直接轉換為 UTF-8 字符串
        const decoder = new TextDecoder('utf-8');
        const uint8Array = new Uint8Array(rawPayload.length);
        for (let i = 0; i < rawPayload.length; i++) {
            uint8Array[i] = rawPayload.charCodeAt(i);
        }
        const decodedString = decoder.decode(uint8Array);

        // 處理填充
        // const pad = '='.repeat((4 - base64.length % 4) % 4);
        // const jsonPayload = atob(base64 + pad);

        // 解析 JSON 並確保正確的中文編碼
        const payload = JSON.parse(decodedString);

        return {
            sub: payload.sub || null,
            userName: payload.userName || '', // 特別處理中文編碼
            userEmail: payload.userEmail || '',
            userPhone: payload.userPhone || '',
            userStatusId: payload.userStatusId || null,
            permissionId: Array.isArray(payload.permissionId) ? payload.permissionId : [],
            loginRecordId: payload.loginRecordId || null
        };
    } catch(e) {
        console.error('JWT 解析錯誤:', e);
        console.log({
            error: e.message,
            tokenLength: token ? token.length : 0,
            tokenStart: token ? token.substring(0, 50) : 'no token'
        });
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
