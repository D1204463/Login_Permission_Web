<template>
    <div class="container">
        <!-- 職位管理頁籤 -->
        <ul class="nav nav-tabs mb-2">
            <li class="nav-item">
                <a class="nav-link active" href="#">職位管理</a>
            </li>
        </ul>

        <div class="content-wrapper">
            <div class="row g-3 align-items-center">
                <!-- 新增職位按鈕，點擊會出現Model -->
                <div class="col-auto">
                    <button type="button" class="btn add-position-btn" style="margin-bottom:20px;"
                        data-bs-toggle="modal" data-bs-target="#createPositionModal">
                        <font-awesome-icon :icon="['fas', 'plus']" size="2xl" class="me-2" />
                        新增職位
                    </button>
                </div>

                <div class="col">
                    <div class="card w-100 mb-4 border-0">
                        <div class="card-body">
                            <!-- 搜尋表單，用於搜尋科別、職位 -->
                            <div class="col">
                                <form>
                                    <div class="row g-3 align-items-center">
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <!-- 搜尋科別 -->
                                                <select class="form-select" id="unitSelect" v-model="searchByUnitId">
                                                    <option selected value="">選擇科別</option>
                                                    <option v-for="unit in units" :key="unit.unit_id"
                                                        :value="unit.unit_id" >
                                                        ({{ unit.unit_id }}) {{ unit.unit_name }}
                                                    </option>
                                                </select>
                                                <label for="unitSelect">科別查詢</label>
                                            </div>
                                        </div>
                                        <div class="col-md">
                                            <div class="form-floating">
                                                <!-- 搜尋職位 -->
                                                <select class="form-select" id="positionSelect" v-model="searchByPositionId">
                                                    <option selected value="">選擇職位</option>
                                                    <option v-for="position in positions" :key="position.position_id"
                                                        :value="position.position_id">
                                                        ({{ position.position_id }}) {{ position.position }}
                                                    </option>
                                                </select>
                                                <label for="positionSelect">職位查詢</label>
                                            </div>
                                        </div>
                                        <!-- 搜尋按鈕 -->
                                        <div class="col-auto d-flex align-items-center">
                                            <button type="button" class="btn btn-primary search-btn" v-on:click="search">
                                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" size="lg" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 職位資料表格 -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <!-- 表頭 -->
                    <thead>
                        <tr>
                            <th class="text-center" style="width: 80px">編輯</th>
                            <th class="text-center">職位編號</th>
                            <th class="text-center">職位名稱</th>
                            <th class="text-center">科別代號</th>
                            <th class="text-center">科別名稱</th>
                            <th class="text-center" style="width: 80px">刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="position in positions" v-bind:key="position.position_id">
                            <td class="text-center">
                                <!-- 點擊 Button 出現 Edit Position Model -->
                                <button type="button" class="btn btn-link" data-bs-toggle="modal"
                                    data-bs-target="#editPositionModal" v-on:click="onUpdatePosition(position)">
                                    <font-awesome-icon :icon="['fas', 'pen-to-square']" size="lg" />
                                </button>
                            </td>
                            <td class="text-center">{{ position.position_id }}</td>
                            <td class="text-center">{{ position.position }}</td>
                            <td class="text-center">{{ position.unit_id }}</td>
                            <td class="text-center">{{ position.unit_name }}</td>
                            <td class="text-center">
                                <!-- 點擊 Button 出現 Delete Position Model -->
                                <button type="button" class="btn btn-link text-danger" data-bs-toggle="modal"
                                    data-bs-target="#deletePositionModal" v-on:click="onSelectPosition(position)">
                                    <font-awesome-icon :icon="['fas', 'trash-can']" size="lg" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- 新增職位 Model -->
    <div class="modal fade" id="createPositionModal" tabindex="-1" aria-labelledby="createPositionModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add Position</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- 職位名稱 Position -->
                    <div class="mb-3 row">
                        <label for="addPosition" class="col-sm-3 col-form-label">Position</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="addPosition" v-model="newPosition.position"
                                aria-label="Position">
                        </div>
                    </div>
                    <!-- 科別 Unit，從 units 資料填充-->
                    <div class="mb-3 row">
                        <label for="chooseUnitID" class="col-sm-3 col-form-label">Unit ID</label>
                        <div class="col-sm-9">
                            <select class="form-select" id="chooseUnitID" v-model="newPosition.unit_id"
                                @change="updateSelectedUnitName">
                                <option disabled value="">選擇科別</option>
                                <option v-for="unit in units" :key="unit.unit_id" :value="unit.unit_id">
                                    {{ unit.unit_id }} ({{ unit.unit_name }})
                                </option>
                            </select>
                        </div>
                    </div>
                    <!-- 科別名稱顯示 -->
                    <div class="mb-3 row">
                        <label for="showUnitName" class="col-sm-3 col-form-label">Unit Name</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" :value="selectedUnitName" readonly>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                            v-on:click="createPosition">Add</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 修改職位 Model -->
    <div class="modal fade" id="editPositionModal" tabindex="-1" aria-labelledby="editPositionModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Edit Position</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- 職位名稱 Position -->
                    <div class="mb-3 row">
                        <label for="editPosition" class="col-sm-3 col-form-label">Position</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="editPosition" v-model="edidPosition.position"
                                aria-label="Position">
                        </div>
                    </div>
                    <!-- 科別 Unit，從 units 資料填充-->
                    <div class="mb-3 row">
                        <label for="editUnitID" class="col-sm-3 col-form-label">Unit ID</label>
                        <div class="col-sm-9">
                            <select class="form-select" id="editUnitID" v-model="edidPosition.unit_id">
                                <option disabled value="">選擇科別</option>
                                <option v-for="unit in units" :key="unit.unit_id" :value="unit.unit_id">
                                    {{ unit.unit_id }} ({{ unit.unit_name }})
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal"
                            v-on:click="updatePosition">Update</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 刪除職位 Modal -->
    <div class="modal fade" id="deletePositionModal" tabindex="-1" aria-labelledby="deletePositionModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Delete Position</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this Position?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                        v-on:click="deletePosition">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import圖標的路徑
import { popScopeId, ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPlus,
    faPenToSquare,
    faTrashCan,
    faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// 添加圖標
library.add(faPlus, faPenToSquare, faTrashCan, faMagnifyingGlass)


export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            positions: [],
            units: [],
            selectedUnitName: "", // 新增的欄位用來顯示Unit Name
            searchByPositionId: "", // 用於儲存所選職位 ID
            searchByUnitId: "", // 用於儲存所選科別 ID
            selectedPosition: {
                position_id: "",
                position: "",
                unit_id: "",
            },
            newPosition: {
                position_id: "",
                position: "",
                unit_id: "",
            },
            edidPosition: {
                position_id: "",
                position: "",
                unit_id: "",
            },
        }
    },
    methods: {
        async getUnitData() { //get 科別(Unit)的資料
            try {
                let response = await fetch("http://localhost:8085/unit/test/get");
                this.units = await response.json();
                console.log(this.units);
            } catch (error) {
                console.log('Error Get Units:', error);
            }
        },
        async getPositionData() { //get 職位(Position)的資料
            try {
                let response = await fetch("http://localhost:8085/Position/getAll");
                this.positions = await response.json();
                console.log(this.positions);
            } catch (error) {
                console.log('Error Get Position:', error);
            }
        },
        async search() { //搜尋 科別(Unit) 或 職位(Position) 的方法
            try {
                const unitId = this.searchByUnitId ? parseInt(this.searchByUnitId) : null;
                const positionId = this.searchByPositionId ? parseInt(this.searchByPositionId) : null;

                const params = new URLSearchParams();
                if(unitId !== null) {
                    params.append('unitId', unitId.toString());
                }
                if(positionId !== null) {
                    params.append('positionId', positionId.toString());
                }

                const response = await fetch(`http://localhost:8085/Position/search?${params}`);

                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.positions = data;
                
                // 處理空結果
                if(this.positions.length === 0) {
                    console.log("沒有符合條件的搜尋結果");
                }
            } catch(error) {
                console.log("Error Search", error);
            }
        },
        async createPosition() { //新增Position的方法
            try {
                fetch("http://localhost:8085/Position/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.newPosition),
                }).then(() => {
                    console.log(response.json);
                    this.getPositionData();
                });
            } catch (error) {
                console.log('Error Add Position:', error);
            }
        },

        onSelectPosition(position) {  //選到要刪除的Position，
            this.selectedPosition = position;
        },
        async deletePosition() { //刪除Position的方法
            let positionId = this.selectedPosition.position_id;
            try {
                fetch("http://localhost:8085/Position/delete/" + positionId, {
                    method: "DELETE",
                }).then(() => {
                    this.getPositionData();
                });
            } catch (error) {
                console.log('Error Delete Position:', error);
            }
        },

        onUpdatePosition(position) { //選到要修改的Position，資料要帶入updatePosition方法
            this.edidPosition = { ...position };
        },
        async updatePosition() { //修改Position的方法
            try {
                fetch("http://localhost:8085/Position/edit", {
                    method: "PUT",
                    header: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.edidPosition),
                }).then(() => {
                    this.getPositionData();
                });
            } catch (error) {
                console.log('Error Update Position:', error);
            }
        },
        updateSelectedUnitName() { //為了顯示科別名稱的方法 -> for AddPosition Modle
            const selectedUnit = this.units.find(unit => unit.unit_id === this.newPosition.unit_id);
            this.selectedUnitName = selectedUnit ? selectedUnit.unit_name : "";
        }
    },
    created() {
        this.getPositionData();
        this.getUnitData();
    },
}
</script>


<style scoped>
.content-wrapper {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 0 1.5rem;
    /* 只保留左右間距 */
    margin-right: 5%;
    margin-top: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-tabs {
    margin-right: 5%;
    margin-top: 15px;
}

.nav-tabs .nav-link {
    color: #334255;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    position: relative;
}

.nav-tabs .nav-link.active {
    color: #334255;
    font-weight: 600;
    border-bottom: 2px solid #334255;
    background: none;
}

.nav-tabs .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #334255;
}

.add-position-btn {
    color: #334255;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border: 2px solid #334255;
    border-radius: 6px;
    transition: all 0.3s ease;
    height: 58px;
    /* 與表單元素等高 */
    white-space: nowrap;
}

.add-position-btn:hover {
    background-color: #334255;
    color: #ffffff;
}

.search-btn {
    background-color: #334255;
    border-color: #334255;
    padding: 0.75rem;
    height: 58px;
    width: 58px;
}

.search-btn:hover {
    background-color: #FFCD50;
    border-color: #FFCD50;
    color: #334255;
}

.form-floating>.form-select {
    padding-top: 1.625rem;
    padding-bottom: 0.625rem;
}

.table {
    margin-bottom: 0;
}

.table th {
    background-color: #f8f9fa;
    font-weight: 600;
    padding: 1rem;
    border-bottom: 2px solid #dee2e6;
}

.table td {
    padding: 1rem;
    vertical-align: middle;
}

.btn-link {
    color: #334255;
    padding: 0.375rem;
    transition: all 0.2s ease;
}

.btn-link:hover {
    color: #FFCD50;
    transform: scale(1.1);
}

.btn-link.text-danger:hover {
    color: #dc3545;
}

/* 響應式調整 */
@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .row {
        row-gap: 1rem;
    }

    .add-position-btn {
        width: 100%;
        margin-bottom: 1rem;
    }
}
</style>