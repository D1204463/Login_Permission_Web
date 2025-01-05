
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

        // 解析 JSON 並確保正確的中文編碼
        const payload = JSON.parse(decodedString);
        console.log('Parsed JWT payload:', payload);

        // 返回需要的資料
        return {
            sub: payload.sub || null,  // - 使用者ID (sub)
            loginRecordId: payload.loginRecordId || null, // - 登入記錄ID (loginRecordId)
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

