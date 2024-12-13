
export function parseJwt(token) {
    try {
        // 檢查 token 是否存在且為字串
        if (!token || typeof token !== 'string') {
            console.error('Invalid token format');
            return null;
        }

        // 分割 token
        const parts = token.split('.');
        if (parts.length !== 3) {  //檢查是否有三個部分（header標頭.payload附載.signature簽名）
            console.error('Invalid JWT format');
            return null;
        }

        // 解碼(base64) payload & 修正編碼問題(UTF-8)
        const base64Url = parts[1];  // 取得 payload 部分（第二部分）
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // 轉換 base64Url 到標準 base64
        const pad = '='.repeat((4 - base64.length % 4) % 4); // 處理 base64 填充
        const rawPayload = atob(base64 + pad); // 解碼 base64 字串

        // 直接轉換為 UTF-8 字符串
        const decoder = new TextDecoder('utf-8');  // 建立 UTF-8 解碼器
        const uint8Array = new Uint8Array(rawPayload.length); // 將字串轉換為 Uint8Array
        for (let i = 0; i < rawPayload.length; i++) {
            uint8Array[i] = rawPayload.charCodeAt(i);
        }
        const decodedString = decoder.decode(uint8Array); // 解碼為 UTF-8 字串

        // 處理填充
        // const pad = '='.repeat((4 - base64.length % 4) % 4);
        // const jsonPayload = atob(base64 + pad);

        // 解析 JSON 並確保正確的中文編碼
        const payload = JSON.parse(decodedString);
        console.log('Parsed JWT payload:', payload);

        // 返回需要的資料
        return {
            sub: payload.sub || null,  // - 使用者ID (sub)
            // userName: payload.userName || '', //  - 使用者名稱 (userName)，特別處理中文編碼
            // userEmail: payload.userEmail || '', // - 電子郵件 (userEmail)
            // userPhone: payload.userPhone || '',  // - 電話 (userPhone)
            // userStatusId: payload.userStatusId || null,  // - 狀態ID (userStatusId)
            // permissionCode: Array.isArray(payload.permissionCode) ? payload.permissionCode : [],  // - 權限ID列表 (permissionId)
            loginRecordId: payload.loginRecordId || null,  // - 登入記錄ID (loginRecordId)
            // departmentAndUnit: payload.departmentAndUnit || null
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
// 檢查單一權限
export function checkPermission(requiredPermission, userPermissions) { 
    if(!userPermissions) return false;
    return userPermissions.includes(requiredPermission);
}

// 檢查多個權限是否存在(任一)
// 檢查多個權限中是否有符合的
export function checkAnyPermission(requiredPermissions, userPermissions) {
    if(!userPermissions) return false;
    return requiredPermissions.some(permission => userPermissions.includes(permission));
}

// 定義權限常量
// export const PERMISSIONS = {
//     DEPT_FULL_ACCESS: 1,     // 部門完整權限
//     DEPT_PARTIAL_ACCESS: 4,  // 部門部分權限
//     UNIT_FULL_ACCESS: 2,     // 科別完整權限
//     LOGIN_RECORD_ACCESS: 3   // 登入記錄權限
// }
export const PERMISSIONS = {
    // 部門管理權限
    DEPT_NONE: 'dept_mgt_false',
    DEPT_READ: 'dept_mgt_read',
    DEPT_UPDATE: 'dept_mgt_update',
    DEPT_CREATE: 'dept_mgt_create',
    DEPT_DELETE: 'dept_mgt_delete',

    // 科別管理權限
    UNIT_NONE: 'unit_mgt_false',
    UNIT_READ: 'unit_mgt_read',
    UNIT_UPDATE: 'unit_mgt_update',
    UNIT_CREATE: 'unit_mgt_create',
    UNIT_DELETE: 'unit_mgt_delete',

    // 登入記錄權限
    LOGIN_RECORD_NONE: 'login_rec_false',
    LOGIN_RECORD_READ: 'login_rec_read',
    LOGIN_RECORD_UPDATE: 'login_rec_update',
    LOGIN_RECORD_CREATE: 'login_rec_create',
    LOGIN_RECORD_DELETE: 'login_rec_delete'
};
