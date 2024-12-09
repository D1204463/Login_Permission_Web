<template>
    <div class="register-container">
        <div class="register-form bg-form rounded">
            <!-- Header -->
            <div class="text-center mb-4 fade-in first">
                <font-awesome-icon icon="user-plus" size="3x" class="mb-3 user-icon" />
                <h4 class="text-white">員工註冊</h4>
            </div>

            <!-- Registration Form -->
            <form @submit.prevent="handleRegister" class="fade-in second">
                <div class="row">
                    <!-- Name -->
                    <div class="col-12 mb-3">
                        <label for="name" class="lp-form-label">
                            <font-awesome-icon icon="user" class="me-2" />
                            員工姓名
                        </label>
                        <input type="text" class="form-control custom-input" id="name" v-model="form.name" required
                            placeholder="請輸入姓名">
                    </div>

                    <!-- Email -->
                    <div class="col-12 mb-3">
                        <label for="email" class="lp-form-label">
                            <font-awesome-icon icon="envelope" class="me-2" />
                            電子郵件
                        </label>
                        <input type="email" class="form-control custom-input" id="email" v-model="form.email" required
                            placeholder="請輸入電子郵件">
                    </div>

                    <!-- Password -->
                    <div class="col-12 mb-3">
                        <label for="password" class="lp-form-label">
                            <font-awesome-icon icon="lock" class="me-2" />
                            密碼
                        </label>
                        <div class="input-group">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control custom-input"
                                id="password" v-model="form.password" required placeholder="請輸入密碼">
                            <button type="button" class="btn btn-light password-toggle" @click="togglePassword">
                                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                            </button>
                        </div>
                    </div>

                    <!-- Phone -->
                    <div class="col-12 mb-4">
                        <label for="phone" class="lp-form-label">
                            <font-awesome-icon icon="phone" class="me-2" />
                            聯絡電話
                        </label>
                        <input type="tel" class="form-control custom-input" id="phone" v-model="form.phoneNumber"
                            required placeholder="請輸入聯絡電話">
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="alert alert-danger py-2 mb-3 text-center fade-in" role="alert">
                    {{ errorMessage }}
                </div>

                <!-- Buttons -->
                <div class="d-flex justify-content-between align-items-center mt-4 fade-in third">
                    <button type="button" class="btn btn-outline-light" @click="goToLogin">
                        <font-awesome-icon icon="arrow-left" class="me-2" />
                        返回登入
                    </button>
                    <button type="submit" class="btn lp-btn-primary" :disabled="isLoading">
                        <template v-if="isLoading">
                            <font-awesome-icon icon="spinner" spin class="me-2" />
                            註冊中...
                        </template>
                        <template v-else>
                            <font-awesome-icon icon="user-plus" class="me-2" />
                            註冊
                        </template>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faUserPlus,
    faUser,
    faEnvelope,
    faLock,
    faPhone,
    faEye,
    faEyeSlash,
    faSpinner,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 添加圖標到庫中
library.add(
    faUserPlus,
    faUser,
    faEnvelope,
    faLock,
    faPhone,
    faEye,
    faEyeSlash,
    faSpinner,
    faArrowLeft
)
export default {
    name: 'RegisterForm',

    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                phoneNumber: '',
                status_id: 1
            },
            showPassword: false,
            isLoading: false,
            errorMessage: ''
        }
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword
        },
        async handleRegister() {
            // 檢查表單
            if (!this.validateForm()) {
                return;
            }

            this.isLoading = true
            this.errorMessage = ''

            try {
                const response = await fetch('http://localhost:8085/employee/test/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(this.form)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.text();
                console.log('Response:', response.status, data);

                if (data.includes('新增員工成功')) {
                    alert('註冊成功！請查看您的信箱進行帳號驗證');
                    this.goToLogin();
                } else {
                    throw new Error(data);
                }
            } catch (error) {
                console.error('註冊錯誤詳情:', {
                    message: error.message,
                    stack: error.stack
                });  // 新增更詳細的錯誤記錄
                this.errorMessage = error.message || '註冊失敗，請稍後再試';

                alert('註冊失敗：' + (error.message || '請稍後再試'));
            } finally {
                this.isLoading = false;
            }
        },
        validateForm() {
            // 驗證 email
            if (!this.form.email.includes('@')) {
                this.errorMessage = '請輸入有效的電子郵件地址';
                return false;
            }
            // 驗證密碼
            if (this.form.password.length < 6) {
                this.errorMessage = '密碼長度至少需要6個字符';
                return false;
            }
            // 驗證手機號碼
            if (!/^(09)\d{8}$/.test(this.form.phoneNumber)) {
                this.errorMessage = '請輸入有效的手機號碼（10位數字）';
                return false;
            }
            // 驗證姓名
            if (!this.form.name.trim()) {
                this.errorMessage = '請輸入姓名';
                return false;
            }
            return true;
        },
        goToLogin() {
            this.$router.push({ name: 'LoginPage' });
        }
    },
    watch: {
        'form': {
            handler() {
                this.errorMessage = '';
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #334255 0%, #2c3a4f 100%);
    padding: 1rem;
}

.register-form {
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
}

.lp-form-label {
    color: #ffff;
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
}

.user-icon {
    color: #fdf4e0;
}

/* 自定義輸入框樣式 */
.custom-input {
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.6rem 1rem;
}

.custom-input:focus {
    background-color: #fff;
    border-color: #FFCD50;
    box-shadow: 0 0 0 0.25rem rgba(255, 205, 80, 0.25);
}

/* 密碼顯示按鈕樣式 */
.password-toggle {
    background-color: #2e3d51;
    /* 深色背景 */
    border: 1px solid #ffffff;
    /* 金色邊框 */
    color: #ffffff;
    /* 金色圖標 */
    padding: 0.375rem 0.5rem;
    /* 減少內邊距使按鈕變小 */
    transition: all 0.3s ease;
    width: 15% !important;
    /* 移除固定寬度 */
    height: auto;
    /* 設定與輸入框相同的高度 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.password-toggle:hover {
    background-color: #2e3d51;
    /* hover 時變成金色背景 */
    border-color: #FFCD50;
    color: #FFCD50;
    /* hover 時圖標變成深色 */
    box-shadow: 0 0 10px rgba(255, 205, 80, 0.5);
    transform: translateY(-1px);
}

.password-toggle:focus {
    box-shadow: 0 0 15px rgba(255, 205, 80, 0.6);
    border-color: #FFCD50;
    outline: none;
}

/* 可以調整圖標大小 */
.password-toggle .svg-inline--fa {
    font-size: 0.9rem;
    /* 將圖標稍微縮小 */
}


/* 按鈕樣式 */
.lp-btn-primary {
    color: #FFCD50;
    background-color: transparent;
    border: 2px solid #FFCD50;
    font-weight: 500;
    padding: 0.5rem 1.5rem;
}

.lp-btn-primary:hover:not(:disabled) {
    color: #0F2540;
    background-color: #ffd666;
    border-color: #ffd666;
    box-shadow: 0 0 15px rgba(255, 205, 80, 0.6);

}

.btn-outline-light:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
}

.lp-btn-primary:disabled {
    color: #ffcd5080;
    border-color: #ffcd5080;
    cursor: not-allowed;
}

/* 動畫設定 */
.fade-in {
    opacity: 0;
    animation: fadeIn 0.3s ease-out forwards;
}

.first {
    animation-delay: 0s;
}

.second {
    animation-delay: 0.1s;
}

.third {
    animation-delay: 0.2s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* 移除number input的箭頭 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}

/* 隱藏瀏覽器預設的密碼顯示按鈕 */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear,
input[type="password"]::-webkit-credentials-auto-fill-button {
    display: none !important;
}
</style>