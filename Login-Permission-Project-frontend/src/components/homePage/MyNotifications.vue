<template>
  <div class="table-responsive">
    <table class="table table-hover announcement-table">
      <thead>
        <tr>
          <th class="text-center" style="width: 15%">訊息類型</th>
          <th class="text-center" style="width: 40%">主標題</th>
          <th class="text-center" style="width: 20%">公告日期</th>
          <th class="text-center" style="width: 25%">公告單位</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="notice in filteredAnnouncements"
          :key="notice.id"
          class="announcement-row"
          @click="showAnnouncementDetail(notice)"
        >
          <td class="text-center align-middle">
            <span class="announcement-type">{{ notice.type }}</span>
          </td>
          <td class="text-center align-middle">{{ notice.title }}</td>
          <td class="text-center align-middle">{{ notice.date }}</td>
          <td class="text-center align-middle">{{ notice.department }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
name: 'NotificationList',
props: {
  filteredAnnouncements: {
    type: Array,
    default: () => [
      {
        id: 1,
        type: "個人通知",
        title: "加班申請通過",
        date: "2024/10/05", 
        department: "人事部"
      },
      {
        id: 2,
        type: "系統通知",
        title: "密碼即將到期",
        date: "2024/10/04",
        department: "資訊部"
      }
    ]
  }
},
methods: {
  showAnnouncementDetail(notice) {
    // TODO: 實作點擊後顯示詳細內容的功能 
    console.log('Showing notification details:', notice)
  }
}
};
</script>

<style scoped>
.announcement-table {
margin-bottom: 0;
}

.announcement-table thead th {
background-color: #f8f9fa;
border-bottom: 2px solid #FFCD50;
color: #334255;
font-weight: 500;
padding: 1rem;
}

.announcement-row {
cursor: pointer;
transition: background-color 0.2s ease;
}

.announcement-row:hover {
background-color: #f8f9fa;
}

.announcement-type {
display: inline-block;
padding: 0.25rem 0.625rem;
background-color: #334255;
color: #fff;
border-radius: 50px;
font-size: 0.875rem;
}

td {
padding: 1rem !important;
color: #495057;
}

/* Responsive Design */
@media (max-width: 768px) {
.announcement-type {
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
}

td, th {
  padding: 0.75rem !important;
  font-size: 0.875rem;
}
}
</style>