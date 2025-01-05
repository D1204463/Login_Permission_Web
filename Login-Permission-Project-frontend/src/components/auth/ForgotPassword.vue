<template>
  <div class="forgot-password-container">
    <!-- 忘記密碼對話框 -->
    <div v-if="showDialog" class="dialog-overlay fade-in">
      <div class="dialog-content bg-form rounded p-4">
        <h3 class="text-center text-white mb-4">重置密碼</h3>
        
        <!-- Email輸入表單 -->
        <form @submit.prevent="handleSubmit" v-if="!emailSent">
          <div class="mb-4">
            <label for="email" class="lp-form-label">電子郵件：</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              v-model="email"
              required
            >
          </div>

          <!-- 錯誤訊息 -->
          <div v-if="errorMessage" class="alert alert-danger py-2 text-center mb-3" role="alert">
            {{ errorMessage }}
          </div>

          <!-- 按鈕 -->
          <div class="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              class="btn lp-btn-outline" 
              @click="closeDialog"
            >
              取消
            </button>
            <button 
              type="submit" 
              class="btn lp-btn-outline" 
              :disabled="isLoading"
            >
              <template v-if="isLoading">
                <font-awesome-icon icon="spinner" spin class="me-2" />
                處理中...
              </template>
              <template v-else>
                送出
              </template>
            </button>
          </div>
        </form>

        <!-- 成功訊息 -->
        <div v-else class="text-center text-white success-message">
          <p>重置密碼郵件已發送！</p>
          <p>請查看您的電子郵件信箱。</p>
          <button 
            class="btn lp-btn-outline mt-3" 
            @click="closeDialog"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ForgotPassword',
  props: {
    showDialog: Boolean,
    onClose: Function
  },
  setup(props, { emit }) {
    const email = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const emailSent = ref(false)

    const handleSubmit = async () => {
      try {
        isLoading.value = true
        errorMessage.value = ''
        
        // 發送重置密碼請求
        const response = await fetch('http://localhost:8085/employee/test/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.value
          })
        })

        // 檢查響應狀態
        if (!response.ok) {
          throw new Error('發送重置郵件失敗')
        }

        const data = await response.json()

        if (data.success) {
          emailSent.value = true
        } else {
          errorMessage.value = data.message || '發送重置郵件失敗'
        }
      } catch (error) {
        console.error('重置密碼請求失敗:', error)
        errorMessage.value = '發送重置郵件失敗'
      } finally {
        isLoading.value = false
      }
    }

    const closeDialog = () => {
      emit('update:showDialog', false)
      // 重置狀態
      email.value = ''
      errorMessage.value = ''
      emailSent.value = false
    }

    return {
      email,
      isLoading,
      errorMessage,
      emailSent,
      handleSubmit,
      closeDialog
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  position: relative;
  z-index: 1000;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 37, 64, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.dialog-content {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 205, 80, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dialog-content .success-message {
  background: rgba(75, 181, 67, 0.15) !important;
  border-radius: 0.375rem;
  padding: 1.5rem;
  margin: -1rem;
  border: 1px solid rgba(75, 181, 67, 0.3);
  color: #4BB543 !important;
}

.success-message p {
  color: #4BB543 !important;
}

/* Form styles */
.lp-form-label {
  color: #fff;
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.3s ease;
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: #FFCD50;
  box-shadow: 0 0 0 0.25rem rgba(255, 205, 80, 0.25);
  color: #fff;
}

/* Button styles */
.btn {
  width: 120px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

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

/* Alert styles */
.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.2);
  color: #ff6b6b;
}

/* Animation */
.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Placeholder text color */
.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* Success message styles */
.text-success {
  color: #FFCD50 !important;
}

/* Close button hover effect */
.btn-close {
  color: #fff;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.btn-close:hover {
  opacity: 1;
  transform: rotate(90deg);
}

/* Focus styles for better accessibility */
*:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 205, 80, 0.5);
}
</style>