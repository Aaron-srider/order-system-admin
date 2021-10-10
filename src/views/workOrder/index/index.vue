<template>
  <div class="app-container">


    <!--search-->
    <div class="filter-container">

      <span>工单ID</span>
      <el-input
        v-model="listQuery.workOrderId"
        placeholder="工单ID"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <span>发起人</span>
      <el-input
        v-model="listQuery.student_job_id"
        placeholder="学号/工号"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />


      <span>发起时间</span>
      <el-date-picker
        v-model="listQuery.startDate"
        type="datetime"
        placeholder="">
      </el-date-picker>
      ~

      <el-date-picker
        v-model="listQuery.endDate"
        type="datetime"
        placeholder="">
      </el-date-picker>

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
    </div>


    <div id="batchOpt" class="batchOpt">
      <div style="line-height: 30px">
        批量操作
      </div>
      <div>
        <el-button :disabled="!rowSelected" type="danger" size="mini" @click="handleBatchWorkOrderDelete()">
          批量删除
        </el-button>

        <el-button :disabled="!rowSelected" type="warning" size="mini" @click="handleBatchWorkOrderInvalidation()">
          批量作废
        </el-button>
      </div>
    </div>


    <!--data-->
    <el-table ref="multipleTable" :data="list" border fit highlight-current-row @selection-change="handleSelectionChange">

      <el-table-column
        label="批量操作"
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <!--<el-table-column label="批量操作" width="95" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-checkbox v-model="checklist" @change="checked=>selectItem(checked,scope.row)"/>-->
      <!--</template>-->
      <!--</el-table-column>-->


      <el-table-column label="ID" width="95" align="center">
        <template slot-scope="scope">
          {{ scope.row.workOrderId }}
        </template>
      </el-table-column>

      <el-table-column label="工单类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.workOrderType }}
        </template>
      </el-table-column>
      <el-table-column label="发起者姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.initiatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.workOrderTitle }}</span>
        </template>
      </el-table-column>


      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="工单状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.workOrderStatus | statusIconFilter">
            {{ row.workOrderStatus | statusTextFilter}}
          </el-tag>
        </template>
      </el-table-column>


      <el-table-column
        label="Actions"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">

          <router-link :to="'/workOrder/edit/'+ row.workOrderId">
            <el-button type="primary" size="mini" style="margin:  0 10px 0 0;">
              编辑
            </el-button>
          </router-link>

          <el-button type="danger" size="mini" @click="handleWorkOrderDelete(row)">
            删除
          </el-button>

          <el-button v-if="row.workOrderStatus!=4" :disabled="row.isFinished==1" type="warning" size="mini" @click="handleWorkOrderInvalidation(row)">
            作废
          </el-button>
          <el-button v-else  type="warning" size="mini" @click="enableWorkOrder(row)">
            开启
          </el-button>


          <!--<el-button-->
          <!--v-if="row.isLock == 1"-->
          <!--size="mini"-->
          <!--type="success"-->
          <!--@click="handleLockStatue(row, 0)"-->
          <!--&gt;-->
          <!--解锁-->
          <!--</el-button>-->
          <!--<el-button-->
          <!--v-else-->
          <!--size="mini"-->
          <!--type="danger"-->
          <!--@click="handleLockStatue(row, 1)"-->
          <!--&gt;-->
          <!--锁定-->
          <!--</el-button>-->
        </template>
      </el-table-column>

      <!--<el-user-column align="center" prop="created_at" label="Display_time" width="200">-->
      <!--<template slot-scope="scope">-->
      <!--<i class="el-icon-time" />-->
      <!--<span>{{ scope.row.display_time }}</span>-->
      <!--</template>-->
      <!--</el-user-column>-->
    </el-table>


    <!--分页组件-->
    <pagination
      v-show="page.total > 0"
      :total="page.total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="fetchData"
    />

  </div>
</template>

<script>

  import page from "@/views/workOrder/index/index.js"; // secondary package based on el-pagination

  export default page

</script>

<style scope>
  .batchOpt {
    display: flex;
    border-radius: 4px;
    border: 1px solid #dadce0;
    justify-content: space-between;
    padding: 16px;
    margin-bottom: 10px;
  }
</style>
