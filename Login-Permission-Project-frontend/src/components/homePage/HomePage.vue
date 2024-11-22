<template>
    <div class="container-fluid px-4">
      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs mb-2">
        <li class="nav-item">
          <a class="nav-link active">公告管理</a>
        </li>
      </ul>
  
      <div class="content-wrapper">
        <!-- Navigation Links -->
        <div class="nav-buttons mb-4">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="btn nav-btn me-2"
            :class="{ active: $route.path === link.path }"
          >
            {{ link.name }}
          </router-link>
        </div>
  
        <!-- Search Section -->
        <div class="search-section mb-4">
          <div class="card border-0">
            <div class="card-body px-0">
              <div class="form-floating">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="公告標題/內容搜尋"
                  class="form-control"
                  @input="handleSearch"
                />
                <label>公告搜尋</label>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Router View for Announcements -->
        <router-view 
          :announcements="announcements"
          :filtered-announcements="filteredAnnouncements"
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
        navLinks: [
          { name: '我的通知', path: '/MyNotifications' },
          { name: '部門公告', path: '/department-announcements' },
          { name: '公司公告', path: '/company-announcements' }
        ],
        announcements: {
          company: [
            { id: 1, type: '公司公告', title: '銀行法修正', date: '2024/10/06', department: '管理部' },
            { id: 2, type: '公司公告', title: '詐騙防範', date: '2024/10/05', department: '消金部' },
            { id: 3, type: '公司公告', title: '113年度羽球競賽', date: '2024/10/04', department: '管理部' }
          ],
          department: [
            { id: 1, type: '部門公告', title: 'Excel 教學', date: '2024/10/03', department: '管理部/資訊科' },
            { id: 2, type: '部門公告', title: '財務部門人員調動名單', date: '2024/10/02', department: '管理部/財務科' },
            { id: 3, type: '部門公告', title: '外匯變動', date: '2024/10/01', department: '消金部/企金科' }
          ],
          notifications: [
          { id: 1, type: '個人通知', title: '加班申請通過', date: '2024/10/05', department: '人事部' },
          { id: 2, type: '系統通知', title: '密碼即將到期', date: '2024/10/04', department: '資訊部' }
        ]
        }
      };
    },
    computed: {
      filteredAnnouncements() {
        const currentPath = this.$route.path;
        let targetAnnouncements = [];
  
        if (currentPath.includes('company-announcements')) {
          targetAnnouncements = this.announcements.company;
        } else if (currentPath.includes('department-announcements')) {
          targetAnnouncements = this.announcements.department;
        }else if (currentPath.includes('MyNotifications')) {
        targetAnnouncements = this.announcements.notifications;
        }
  
        if (!this.searchQuery) {
          return targetAnnouncements;
        }
  
        const query = this.searchQuery.toLowerCase();
        return targetAnnouncements.filter(
          announcement =>
            announcement.title.toLowerCase().includes(query) ||
            announcement.type.toLowerCase().includes(query) ||
            announcement.department.toLowerCase().includes(query)
        );
      }
    },
    methods: {
      handleSearch() {
        // 搜尋邏輯已經在 computed 屬性中處理
      }
    }
  };
  </script>