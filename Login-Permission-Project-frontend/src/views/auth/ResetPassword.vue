<template>
    <div class="login-container">
        <div class="login-form bg-form rounded">
            <div class="user-icon text-center fade-in first">
                <font-awesome-icon icon="key" size="5x" class="mb-4" />
            </div>

            <div v-if="!isSuccess" class="fade-in second">
                <h3 class="text-center text-white mb-4">重置密碼</h3>

                <form @submit.prevent="handleSubmit">
                    <!-- 新密碼輸入 -->
                    <div class="form-group mb-4">
                        <label for="password" class="lp-form-label">新密碼：</label>
                        <div class="input-group">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password"
                                v-model="password" required minlength="6" placeholder="請輸入至少6位數的新密碼">
                            <button type="button" class="btn btn-light password-toggle" @click="togglePassword"
                                aria-label="切換密碼顯示">
                                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                            </button>
                        </div>
                    </div>

                    <!-- 確認密碼 -->
                    <div class="form-group mb-4">
                        <label for="confirmPassword" class="lp-form-label">確認密碼：</label>
                        <div class="input-group">
                            <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control"
                                id="confirmPassword" v-model="confirmPassword" required placeholder="請再次輸入新密碼">
                            <button type="button" class="btn btn-light password-toggle" @click="toggleConfirmPassword"
                                aria-label="切換確認密碼顯示">
                                <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
                            </button>
                        </div>
                    </div>

                    <!-- 錯誤訊息 -->
                    <div v-if="errorMessage" class="alert alert-danger py-2 text-center mb-3" role="alert"
                        aria-live="polite">
                        {{ errorMessage }}
                    </div>

                    <!-- 重置按鈕 -->
                    <div class="text-center">
                        <button type="submit" class="btn lp-btn-outline" :disabled="isLoading || !isPasswordValid">
                            <span v-if="isLoading">
                                <font-awesome-icon icon="spinner" spin class="me-2" />
                                處理中...
                            </span>
                            <span v-else>
                                重置密碼
                            </span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- 成功訊息 -->
            <div v-else class="text-center text-white fade-in second" role="status" aria-live="polite">
                <font-awesome-icon icon="check-circle" size="3x" class="text-success mb-3" />
                <h4>密碼重置成功！</h4>
                <p>請使用新密碼登入。</p>
                <router-link to="/" class="btn lp-btn-outline mt-3">
                    返回登入
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faKey,
    faEye,
    faEyeSlash,
    faSpinner,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faKey, faEye, faEyeSlash, faSpinner, faCheckCircle)

export default {
    name: 'ResetPassword',
    components: {
        FontAwesomeIcon
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const token = route.query.token

        const password = ref('')
        const confirmPassword = ref('')
        const showPassword = ref(false)
        const showConfirmPassword = ref(false)
        const isLoading = ref(false)
        const errorMessage = ref('')
        const isSuccess = ref(false)

        // 密碼驗證
        const isPasswordValid = computed(() => {
            if (!password.value || !confirmPassword.value) return false
            return password.value.length >= 6 && password.value === confirmPassword.value
        })

        const togglePassword = () => {
            showPassword.value = !showPassword.value
        }

        const toggleConfirmPassword = () => {
            showConfirmPassword.value = !showConfirmPassword.value
        }

        const handleSubmit = async () => {
            if (!token) {
                errorMessage.value = '無效的重置連結'
                return
            }

            if (!isPasswordValid.value) {
                errorMessage.value = '請確保密碼至少6個字元且兩次輸入相同'
                return
            }

            try {
                isLoading.value = true
                errorMessage.value = ''

                const response = await fetch('http://localhost:8085/employee/test/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token,
                        newPassword: password.value
                    })
                })

                const data = await response.json()

                if (data.success) {
                    isSuccess.value = true
                    try {
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        await router.push('/');
                    } catch (error) {
                        console.error('導航失敗:', error);
                        errorMessage.value = '導航至登入頁面失敗';
                    }
                } else {
                    errorMessage.value = data.message || '重置密碼失敗'
                }
            } catch (error) {
                console.error('重置密碼失敗:', error)
                errorMessage.value = '重置密碼失敗，請稍後再試'
            } finally {
                isLoading.value = false
            }
        }

        return {
            password,
            confirmPassword,
            showPassword,
            showConfirmPassword,
            isLoading,
            errorMessage,
            isSuccess,
            isPasswordValid,
            togglePassword,
            toggleConfirmPassword,
            handleSubmit
        }
    }
}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.login-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
}

.password-toggle {
    border-left: none;
}

.fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.lp-btn-outline {
    width: 180px;
    color: #e1a611;
    background-color: transparent;
    border: 2px solid #e8b229;
    font-weight: 500;
    padding: 0.7rem 1.5rem;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.lp-btn-outline:hover:not(:disabled) {
    color: #0F2540;
    background-color: #FF9900;
    box-shadow: 0 5px 15px rgba(255, 153, 0, 0.4);
}

.lp-btn-outline:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(255, 153, 0, 0.4);
}

.lp-btn-outline:disabled {
    background-color: rgba(255, 153, 0, 0.1);
    border-color: rgba(255, 153, 0, 0.3);
    color: rgba(255, 153, 0, 0.5);
    cursor: not-allowed;
}

/* Loading 動畫樣式 */
.lp-btn-outline .fa-spinner {
    margin-right: 8px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.text-center.text-white.fade-in.second[role="status"] {
    background: rgba(75, 181, 67, 0.15);
    border-radius: 0.5rem;
    padding: 2rem;
    border: 1px solid rgba(75, 181, 67, 0.3);
    margin-top: -1rem;
}

.text-center.text-white.fade-in.second[role="status"] h4,
.text-center.text-white.fade-in.second[role="status"] p {
    color: #4BB543 !important;
    margin-bottom: 0.5rem;
}

.text-success {
    color: #4BB543 !important;
}

/* 成功訊息中的按鈕樣式覆蓋 */
.text-center.text-white.fade-in.second[role="status"] .lp-btn-outline {
    color: #4BB543;
    border-color: #4BB543;
}

.text-center.text-white.fade-in.second[role="status"] .lp-btn-outline:hover {
    background-color: #4BB543;
    color: white;
    box-shadow: 0 5px 15px rgba(75, 181, 67, 0.4);
}
</style>