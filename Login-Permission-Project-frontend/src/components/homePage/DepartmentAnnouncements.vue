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
            type: "部門公告",
            title: "Excel 教學",
            date: "2024/10/03",
            department: "管理部/資訊科",
          },
          {
            id: 2,
            type: "部門公告",
            title: "財務部門人員調動名單",
            date: "2024/10/02",
            department: "管理部/財務科",
          },
          {
            id: 3,
            type: "部門公告",
            title: "外匯變動",
            date: "2024/10/01",
            department: "消金部/企金科",
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
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .table th,
    .table td {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
  </style>