<template>
    <div class="forbidden-container">
      <div class="forbidden-content">
        <h1 class="title">403 - 無法訪問</h1>
        <p class="message">抱歉，您似乎沒有權限訪問此頁面</p>
        <img 
          src="/img/403_img.webp" 
          alt="403 Forbidden" 
          class="error-image"
        >
        <p class="sub-message">請確認您的權限或聯繫系統管理員</p>
        <p class="countdown">{{ countdown }} 秒後自動返回首頁</p>
        <router-link to="/Home" class="home-button">
          <i class="fas fa-home"></i> 立即返回首頁
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: '403',
    data() {
      return {
        countdown: 6,
        timer: null
      }
    },
    created() {
      this.startCountdown()
    },
    beforeUnmount() {
      // 組件銷毀前清除計時器
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    methods: {
      startCountdown() {
        this.timer = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--
          } else {
            clearInterval(this.timer)
            this.$router.push('/Home')
          }
        }, 1000)
      }
    }
  }
  </script>
  
  <style scoped>
  .forbidden-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    padding: 20px;
  }
  
  .forbidden-content {
    max-width: 600px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .title {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 16px;
    font-weight: 600;
  }
  
  .message {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
  
  .sub-message {
    color: #888;
    font-size: 1rem;
    margin: 20px 0;
  }
  
  .countdown {
    color: #e74c3c;
    font-size: 1.1rem;
    margin: 15px 0;
    font-weight: 500;
  }
  
  .error-image {
    max-width: 300px;
    height: auto;
    margin: 20px 0;
    border-radius: 8px;
  }
  
  .home-button {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #42a5f5, #1976d2);
    color: white;
    text-decoration: none;
    border-radius: 25px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  
  .home-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    background: linear-gradient(135deg, #64b5f6, #1e88e5);
  }
  
  /* 適配手機版面 */
  @media (max-width: 768px) {
    .forbidden-content {
      padding: 20px;
    }
  
    .title {
      font-size: 2rem;
    }
  
    .message {
      font-size: 1rem;
    }
  
    .error-image {
      max-width: 250px;
    }
  
    .countdown {
      font-size: 1rem;
    }
  }
  </style>