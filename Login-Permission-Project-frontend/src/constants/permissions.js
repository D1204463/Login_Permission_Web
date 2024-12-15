// 定義權限常量
export const PERMISSIONS = {
    // 部門管理權限
    DEPT: {
        READ: 'dept_mgt_read',
        UPDATE: 'dept_mgt_update',
        CREATE: 'dept_mgt_create',
        DELETE: 'dept_mgt_delete',
        // 消金部權限
        CB: {
            READ: 'dept_mgt_cb_read',
            UPDATE: 'dept_mgt_cb_update',
            CREATE: 'dept_mgt_cb_create',
            DELETE: 'dept_mgt_cb_delete'
        }
    },
    // 科別管理權限
    UNIT: {
        READ: 'unit_mgt_read',
        UPDATE: 'unit_mgt_update',
        CREATE: 'unit_mgt_create',
        DELETE: 'unit_mgt_delete',
        // 企金科權限
        CF: {
            READ: 'unit_mgt_cf_read',
            UPDATE: 'unit_mgt_cf_update',
            CREATE: 'unit_mgt_cf_create',
            DELETE: 'unit_mgt_cf_delete'
        },
        // 個金科權限
        PF: {
            READ: 'unit_mgt_pf_read',
            UPDATE: 'unit_mgt_pf_update',
            CREATE: 'unit_mgt_pf_create',
            DELETE: 'unit_mgt_pf_delete'
        }
    },
    // 員工管理權限
    EMP: {
        READ: 'emp_mgt_read',
        UPDATE: 'emp_mgt_update',
        CREATE: 'emp_mgt_create',
        DELETE: 'emp_mgt_delete'
    },
    // 職位管理權限
    POS: {
        READ: 'pos_mgt_read',
        UPDATE: 'pos_mgt_update',
        CREATE: 'pos_mgt_create',
        DELETE: 'pos_mgt_delete'
    },
    // 權限管理權限
    PERM: {
        READ: 'perm_mgt_read',
        UPDATE: 'perm_mgt_update',
        CREATE: 'perm_mgt_create',
        DELETE: 'perm_mgt_delete'
    },
    // 員工狀態管理權限
    STATUS: {
        READ: 'emp_status_read',
        UPDATE: 'emp_status_update',
        CREATE: 'emp_status_create',
        DELETE: 'emp_status_delete'
    },
    // 角色管理權限
    ROLE: {
        READ: 'role_mgt_read',
        UPDATE: 'role_mgt_update',
        CREATE: 'role_mgt_create',
        DELETE: 'role_mgt_delete'
    },
    // 全部記錄查詢權限
    RECORD: {
        READ: 'rec_login_read',
        // 個人記錄查詢權限
        RECORD_SELF: {
            READ: 'rec_login_read_self',
        },
        // 操作紀錄查詢
        RECORD_LOG: {
            READ: 'rec_audit_log_read',
        },
        // 密碼錯誤次數查詢
        RECORD_PASSWORD: {
            READ: 'rec_password_error_count',
        },
    },
    // 交易管理權限
    TRANSACTION: {
        // 外匯權限
        FOREIGN: {
            READ: 'trans_forex_mgt_read',
        },
        // 轉帳付款
        TRANSFER: {
            READ: 'trans_transfer_status_read',
        },
        // 薪資付款
        PAYROLL: {
            READ: 'trans_payroll_status_read',
        },
        // 定存交易
        DEPOSIT: {
            READ: 'trans_time_deposit_status_read',
        },
        // 基金交易
        FUND: {
            READ: 'trans_fund_status_read',
        },
    },
};