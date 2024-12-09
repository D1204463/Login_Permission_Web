<template>
  <div class="announcement-container">
    <div class="content-wrapper p-4">
      <!-- Navigation Links -->
      <div class="nav-buttons mb-4">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="btn custom-nav-btn me-3"
          :class="{ active: $route.path === link.path }"
        >
          {{ link.name }}
        </router-link>
      </div>

      <!-- Search Section -->
      <div class="search-section mb-4">
        <div class="card search-card border-0 shadow-sm">
          <div class="card-body">
            <div class="form-floating">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="公告標題/內容搜尋"
                class="form-control search-input"
                @input="handleSearch"
              />
              <label class="search-label">公告搜尋</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 首頁顯示兩個公告 -->
      <template v-if="$route.path === '/' || $route.path === '/home'">
        <!-- 公司公告 -->
        <div class="announcement-section mb-5">
          <div class="section-header mb-4">
            <h3 class="text-center section-title">公司公告</h3>
          </div>
          <CompanyAnnouncements 
            :announcements="displayedCompanyAnnouncements" 
          />
          
          <!-- 看更多按鈕 -->
          <div v-if="companyAnnouncements.length > 10" class="text-end mt-3">
            <button 
              @click="toggleCompanyExpand"
              class="btn btn-link text-primary"
            >
              {{ isCompanyExpanded ? '收合' : '看更多...' }}
            </button>
          </div>
        </div>

        <!-- 部門公告 -->
        <div class="announcement-section">
          <div class="section-header mb-4">
            <h3 class="text-center section-title">部門公告</h3>
          </div>
          <DepartmentAnnouncements 
            :announcements="displayedDepartmentAnnouncements" 
          />
          
          <!-- 看更多按鈕 -->
          <div v-if="departmentAnnouncements.length > 10" class="text-end mt-3">
            <button 
              @click="toggleDepartmentExpand"
              class="btn btn-link text-primary"
            >
              {{ isDepartmentExpanded ? '收合' : '看更多...' }}
            </button>
          </div>
        </div>
      </template>

      <!-- 公司公告頁面 -->
      <template v-else-if="$route.path === '/company-announcements'">
        <div class="announcement-section">
          <div class="section-header mb-4">
            <h3 class="text-center section-title">公司公告</h3>
          </div>
          <CompanyAnnouncements :announcements="displayedCompanyAnnouncements" />
        </div>
      </template>

      <!-- 部門公告頁面 -->
      <template v-else-if="$route.path === '/department-announcements'">
        <div class="announcement-section">
          <div class="section-header mb-4">
            <h3 class="text-center section-title">部門公告</h3>
          </div>
          <DepartmentAnnouncements :announcements="displayedDepartmentAnnouncements" />
        </div>
      </template>

      <!-- 個人通知頁面 -->
      <template v-else-if="$route.path === '/MyNotifications'">
        <div class="announcement-section">
          <div class="section-header mb-4">
            <h3 class="text-center section-title">個人通知</h3>
          </div>
          <MyNotifications :announcements="filteredNotifications" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CompanyAnnouncements from "./CompanyAnnouncements.vue"
import DepartmentAnnouncements from "./DepartmentAnnouncements.vue"
import MyNotifications from "./MyNotifications.vue"

// 控制展開狀態
const isCompanyExpanded = ref(false)
const isDepartmentExpanded = ref(false)
const searchQuery = ref('')

// 公司公告資料
const companyAnnouncements = ref([
  {
    id: 1,
    type: "公司公告",
    title: "銀行法修正通知",
    date: "2024/10/06",
    department: "管理部"
  },
  {
    id: 2,
    type: "公司公告",
    title: "資安事件防範宣導",
    date: "2024/10/05",
    department: "消金部"
  },
  {
    id: 3,
    type: "公司公告",
    title: "113年度羽球競賽活動",
    date: "2024/10/04",
    department: "管理部"
  },
  {
    id: 4,
    type: "公司公告",
    title: "年度員工健康檢查通知",
    date: "2024/10/03",
    department: "人資部"
  },
  {
    id: 5,
    type: "公司公告",
    title: "新版ERP系統上線公告",
    date: "2024/10/02",
    department: "IT部門"
  },
  {
    id: 6,
    type: "公司公告",
    title: "端午節福利發放通知",
    date: "2024/10/01",
    department: "福委會"
  },
  {
    id: 7,
    type: "公司公告",
    title: "季度業績檢討會議",
    date: "2024/09/30",
    department: "業務部"
  },
  {
    id: 8,
    type: "公司公告",
    title: "公司週年慶活動預告",
    date: "2024/09/29",
    department: "管理部"
  },
  {
    id: 9,
    type: "公司公告",
    title: "新進人員教育訓練",
    date: "2024/09/28",
    department: "人資部"
  },
  {
    id: 10,
    type: "公司公告",
    title: "年度資安訓練通知",
    date: "2024/09/27",
    department: "IT部門"
  },
  {
    id: 11,
    type: "公司公告",
    title: "公司制服更換通知",
    date: "2024/09/26",
    department: "總務部"
  },
  {
    id: 12,
    type: "公司公告",
    title: "電子發票系統更新",
    date: "2024/09/25",
    department: "財務部"
  },
  {
    id: 13,
    type: "公司公告",
    title: "年度尾牙活動預告",
    date: "2024/09/24",
    department: "福委會"
  },
  {
    id: 14,
    type: "公司公告",
    title: "防疫措施更新通知",
    date: "2024/09/23",
    department: "管理部"
  },
  {
    id: 15,
    type: "公司公告",
    title: "新產品發表會預告",
    date: "2024/09/22",
    department: "業務部"
  }
])

// 部門公告資料
const departmentAnnouncements = ref([
  {
    id: 1,
    type: "部門公告",
    title: "Excel進階技巧教學",
    date: "2024/10/03",
    department: "管理部/資訊科"
  },
  {
    id: 2,
    type: "部門公告",
    title: "財務部人員調動通知",
    date: "2024/10/02",
    department: "管理部/財務科"
  },
  {
    id: 3,
    type: "部門公告",
    title: "外匯市場變動報告",
    date: "2024/10/01",
    department: "消金部/企金科"
  },
  {
    id: 4,
    type: "部門公告",
    title: "新人招募計劃說明",
    date: "2024/09/30",
    department: "人資部/招募組"
  },
  {
    id: 5,
    type: "部門公告",
    title: "部門週會時間異動",
    date: "2024/09/29",
    department: "IT部門/開發組"
  },
  {
    id: 6,
    type: "部門公告",
    title: "專案進度追蹤報告",
    date: "2024/09/28",
    department: "業務部/專案組"
  },
  {
    id: 7,
    type: "部門公告",
    title: "客戶滿意度調查結果",
    date: "2024/09/27",
    department: "客服部/服務組"
  },
  {
    id: 8,
    type: "部門公告",
    title: "部門預算審核通知",
    date: "2024/09/26",
    department: "財務部/預算組"
  },
  {
    id: 9,
    type: "部門公告",
    title: "員工培訓課程安排",
    date: "2024/09/25",
    department: "人資部/訓練組"
  },
  {
    id: 10,
    type: "部門公告",
    title: "系統維護時間公告",
    date: "2024/09/24",
    department: "IT部門/維運組"
  },
  {
    id: 11,
    type: "部門公告",
    title: "部門KPI考核說明",
    date: "2024/09/23",
    department: "管理部/績效組"
  },
  {
    id: 12,
    type: "部門公告",
    title: "新系統測試通知",
    date: "2024/09/22",
    department: "IT部門/測試組"
  }
])

// 通知資料
const notifications = ref([
  {
    id: 1,
    type: '個人通知',
    title: '加班申請已核准',
    date: '2024/10/05',
    department: '人事部'
  }
])

// 導航連結
const navLinks = ref([
  { name: '公司公告', path: '/company-announcements' },
  { name: '部門公告', path: '/department-announcements' },
  { name: '我的通知', path: '/MyNotifications' }
])

// 計算屬性：過濾後的公司公告
const displayedCompanyAnnouncements = computed(() => {
  let filtered = companyAnnouncements.value

  // 搜尋過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(announcement => 
      announcement.title.toLowerCase().includes(query) ||
      announcement.type.toLowerCase().includes(query) ||
      announcement.department.toLowerCase().includes(query)
    )
  }

  // 根據展開狀態決定顯示數量
  return isCompanyExpanded.value ? filtered : filtered.slice(0, 10)
})

// 計算屬性：過濾後的部門公告
const displayedDepartmentAnnouncements = computed(() => {
  let filtered = departmentAnnouncements.value

  // 搜尋過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(announcement => 
      announcement.title.toLowerCase().includes(query) ||
      announcement.type.toLowerCase().includes(query) ||
      announcement.department.toLowerCase().includes(query)
    )
  }

  // 根據展開狀態決定顯示數量
  return isDepartmentExpanded.value ? filtered : filtered.slice(0, 10)
})

// 計算屬性：過濾後的通知
const filteredNotifications = computed(() => {
  if (!searchQuery.value) return notifications.value

  const query = searchQuery.value.toLowerCase()
  return notifications.value.filter(notification =>
    notification.title.toLowerCase().includes(query) ||
    notification.type.toLowerCase().includes(query) ||
    notification.department.toLowerCase().includes(query)
  )
})

// 方法：切換公司公告展開狀態
const toggleCompanyExpand = () => {
  isCompanyExpanded.value = !isCompanyExpanded.value
}

// 方法：切換部門公告展開狀態
const toggleDepartmentExpand = () => {
  isDepartmentExpanded.value = !isDepartmentExpanded.value
}

// 方法：處理搜尋
const handleSearch = () => {
  // 搜尋時重置展開狀態
  isCompanyExpanded.value = false
  isDepartmentExpanded.value = false
}
</script>

<style scoped>
.announcement-container {
  min-height: 100vh;
  background: #f8f9fa;
  overflow-x: hidden;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* Navigation Buttons */
.custom-nav-btn {
  color: #334255;
  background-color: #fff;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1.5rem;
  transition: all 0.2s ease;
}

.custom-nav-btn:hover,
.custom-nav-btn.active {
  color: #0F2540;
  background-color: #FFCD50;
  border-color: #FFCD50;
}

/* Search Section */
.search-card {
  background: rgba(255, 255, 255, 0.9);
}

.search-input {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  border-color: #FFCD50;
  box-shadow: 0 0 0 0.25rem rgba(255, 205, 80, 0.25);
}

.search-label {
  color: #495057;
}

/* Section Styling */
.section-title {
  color: #334255;
  font-weight: 600;
  margin-bottom: 1rem;
}

.announcement-section {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
}

/* Show More Button */
.btn-link {
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
}

.btn-link:hover {
  transform: translateY(-1px);
  text-decoration: underline;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.announcement-section {
  animation: fadeIn 0.5s ease-out forwards;
}

.announcement-section:nth-child(2) {
  animation-delay: 0.2s;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .custom-nav-btn {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .announcement-section {
    padding: 1rem;
  }
}
</style>