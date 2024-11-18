export function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return "%" + ('00' + c.charCodeAt(0).toString(16).slice(-2));
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch(e) {
        console.error("解析 JWT 失敗: ", e);
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
