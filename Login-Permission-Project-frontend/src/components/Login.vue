<template>
    <div class="login-container">
      <div class="login-form bg-form rounded">
        <!-- User Icon -->
        <div class="user-icon text-center fade-in first">
          <font-awesome-icon 
            icon="user-circle" 
            size="5x"
            class="mb-4"
          />
        </div>
  
        <!-- Login Form -->
        <form @submit.prevent="handleLogin">
          <!-- Employee ID -->
          <div class="mb-4 fade-in second">
            <label for="employeeId" class="lp-form-label">員工編號：</label>
            <div class="input-group">
              <input 
                type="number" 
                class="form-control" 
                id="employeeId"
                v-model="employeeId"
                required
              >
            </div>
          </div>
  
          <!-- Password and Forgot Password -->
          <div class="mb-4 fade-in third">
            <div class="d-flex justify-content-between align-items-center">
              <label for="password" class="lp-form-label mb-0">密碼：</label>
              <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
                忘記密碼？
              </a>
            </div>
            <div class="input-group">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-control" 
                id="password"
                v-model="password"
                required
              >
              <button 
                type="button" 
                class="btn btn-light password-toggle"
                @click="togglePassword"
              >
                <font-awesome-icon 
                  :icon="showPassword ? 'eye-slash' : 'eye'"
                />
              </button>
            </div>
          </div>
  
          <!-- Error Message -->
          <div v-if="errorMessage" 
            class="alert alert-danger py-2 text-center mb-3" 
            role="alert"
            :class="{'fade-in': errorMessage}"
          >
            {{ errorMessage }}
          </div>
  
          <!-- Login and Register Buttons -->
          <div class="text-center fade-in fourth">
            <div class="d-flex justify-content-center gap-3">
              <button 
                type="submit" 
                class="btn lp-btn-outline"
                :disabled="isLoading"
                @click="handleLogin"
              >
                <template v-if="isLoading">
                  <font-awesome-icon 
                    icon="spinner"
                    spin 
                    class="me-2"
                  />
                  登入中...
                </template>
                <template v-else>
                  登入
                </template>
              </button>
              
              <button 
                type="button" 
                class="btn lp-btn-outline"
                @click="handleRegister"
              >
                註冊
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script  >
  import { ref } from 'vue'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import {
    faUserCircle,
    faEye,
    faEyeSlash,
    faSpinner
  } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {useRouter} from "vue-router";
  import { useStore } from 'vuex';
  import { PERMISSIONS } from '../utils/jwt';

  // 添加圖標到庫中
  library.add(faUserCircle, faEye, faEyeSlash, faSpinner)

  export default {
    components: {
      FontAwesomeIcon
    },
    setup() {
      // 響應式狀態
      const employeeId = ref('')
      const password = ref('')
      const showPassword = ref(false)
      const isLoading = ref(false)
      const errorMessage = ref('')
      const router = useRouter();
      const store = useStore();

      // 切換密碼顯示
      const togglePassword = () => {
        showPassword.value = !showPassword.value
      }

      // 處理登入
      const handleLogin = async () => {
        try {
          isLoading.value = true;
          errorMessage.value = '';

          // const requestBody = {
          //   employee_id: employeeId.value, // 使用 .value
          //   password: password.value       // 使用 .value
          // };

          // TODO: 實作登入邏輯
          const response = await fetch("http://localhost:8085/employee/test/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify(requestBody)
            body: JSON.stringify({
                employee_id: employeeId.value,
                password: password.value
            })
          });
    
          console.log("Response:", response);
          if (response.ok) {
            const token = await response.text();
            // 存儲 token 和用戶訊息到 Vuex
            await store.dispatch('auth/loginSuccess', token);

            // localStorage.setItem("JWT_Token", token);
            console.log("登錄成功,jwt驗證碼:" + token);
            await router.push("/");
          } else {
            const errorMessageText = await response.text();
            errorMessage.value = errorMessageText || '登入失敗，請檢查帳號密碼是否正確';
            console.log("登錄失敗:", errorMessageText);
          }
        } catch (error) {
          console.error("登錄失敗:", error);
          errorMessage.value = '登入失敗，請稍後再試';
        } finally {
          isLoading.value = false;
        }
      };


      // 處理註冊
      const handleRegister = () => {
        // TODO: 實作註冊邏輯或導航到註冊頁面
        console.log('跳轉到註冊頁面')
      }

      // 處理忘記密碼
      const handleForgotPassword = () => {
        // TODO: 實作忘記密碼邏輯
        console.log('忘記密碼')
      }

      return {
        employeeId,
        password,
        showPassword,
        isLoading,
        errorMessage,
        togglePassword,
        handleLogin,
        handleRegister,
        handleForgotPassword
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
    background: linear-gradient(135deg, #334255 0%, #2c3a4f 100%);
  }
  
  .login-form {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
  }
  
  .bg-form {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }
  
  .lp-form-label {
    color: #ffff;
    display: block;
  }
  
  .user-icon {
    color: #fdf4e0;
  }
  
  .forgot-password {
    color: #fdf4e0;
    text-decoration: none;
    font-size: 0.9rem;
    padding-top: 5px;
  }
  
  .forgot-password:hover {
    color: #FFCD50;
  }
  
  /* 密碼顯示按鈕樣式 */
.password-toggle {
  background-color: #2e3d51;  /* 深色背景 */
  border: 1px solid #ffffff;  /* 金色邊框 */
  color: #ffffff;            /* 金色圖標 */
  padding: 0.375rem 0.5rem;  /* 減少內邊距使按鈕變小 */
  transition: all 0.3s ease;
  width: 15% !important;              /* 移除固定寬度 */
  height: 38px;            /* 設定與輸入框相同的高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  background-color: #334255;    /* hover 時變成金色背景 */
  border-color: #FFCD50;
  color: #FFCD50;              /* hover 時圖標變成深色 */
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
  font-size: 0.9rem;  /* 將圖標稍微縮小 */
}
  
  /* 按鈕基本樣式 */
  .btn {
    width: 120px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  /* 輪廓按鈕樣式 */
  .lp-btn-outline {
    color: #FFCD50;
    background-color: transparent;
    border: 2px solid #FFCD50;
    font-weight: 500;
    padding: 0.5rem 1.5rem;
  }
  
  .lp-btn-outline:hover:not(:disabled) {
    color: #0F2540;
    background-color: #FFCD50;
    border-color: #FFCD50;
    box-shadow: 0 0 15px rgba(255, 205, 80, 0.6);
    transform: translateY(-2px);
  }
  
  .lp-btn-outline:disabled {
    color: #ffcd5080;
    border-color: #ffcd5080;
    cursor: not-allowed;
  }
  
  /* 自定義輸入框樣式 */
  .form-control:focus {
    border-color: #FFCD50;
    box-shadow: 0 0 0 0.25rem rgba(255, 205, 80, 0.25);
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
  
  input[type="password"]::-webkit-contacts-auto-fill-button,
  input[type="password"]::-webkit-textfield-decoration-container {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
    position: absolute;
    right: 0;
  }
  
  /* 動畫設定 */
  .fade-in {
    opacity: 0;
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  /* 各元件的延遲時間 */
  .first {
    animation-delay: 0s;
  }
  
  .second {
    animation-delay: 0.15s;
  }
  
  .third {
    animation-delay: 0.3s;
  }
  
  .fourth {
    animation-delay: 0.45s;
  }
  
  /* 淡入動畫 */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  </style>