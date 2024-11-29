<template>
    <div class="announcements-container">
      <div class="table-responsive px-0">
        <table class="table table-hover">
          <thead>
            <tr>
              <th class="text-center">訊息類型</th>
              <th class="text-center">主標題</th>
              <th class="text-center">公告日期</th>
              <th class="text-center">公告單位</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="announcement in filteredAnnouncements"
              :key="announcement.id"
              class="announcement-row"
            >
              <td class="text-center">{{ announcement.type }}</td>
              <td class="text-center">{{ announcement.title }}</td>
              <td class="text-center">{{ announcement.date }}</td>
              <td class="text-center">{{ announcement.department }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      filteredAnnouncements: {
        type: Array,
        default: () => [
          {
            id: 1,
            type: "公司公告",
            title: "銀行法修正",
            date: "2024/10/06",
            department: "管理部",
          },
          {
            id: 2,
            type: "公司公告",
            title: "詐騙防範",
            date: "2024/10/05",
            department: "消金部",
          },
          {
            id: 3,
            type: "公司公告",
            title: "113年度羽球競賽",
            date: "2024/10/04",
            department: "管理部",
          },
        ]
      }
    }
  };
  </script>
  
  <style scoped>
  .announcements-container {
    margin: 0;
    padding: 0;
  }
  /* Table Styles */
  .table {
    width: 100%;
    margin-bottom: 0;
    background-color: transparent;
    border-collapse: collapse;
  }
  
  .table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #334255;
    padding: 0.75rem;
    border-bottom: 2px solid #dee2e6;
  }
  
  .table td {
    padding: 0.75rem;
    vertical-align: middle;
    border-bottom: 1px solid #dee2e6;
    color: #334255;
  }
  
  .table-hover tbody tr:hover {
    background-color: rgba(51, 66, 85, 0.05);
    cursor: pointer;
  }
  
  .announcement-row {
    transition: all 0.2s ease;
  }
  
  .announcement-row:hover {
    background-color: #f8f9fa;
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .table th,
    .table td {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
  </style>