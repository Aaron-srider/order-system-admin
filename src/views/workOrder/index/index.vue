<template>
  <div class="app-container">


    <!--search-->
    <div class="filter-container">

      <el-input
        v-model="listQuery.workOrderForQuery.id"
        placeholder="工单ID"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.workOrderForQuery.studentJobId"
        placeholder="发起人学/工号"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />


      <el-date-picker
        v-model="listQuery.workOrderForQuery.startDate"
        type="datetime"
        class="filter-item"
        style="margin-right: 0px;"
        placeholder="工单发起时间"
      />
      <i class="el-icon-minus"/>
      <el-date-picker
        v-model="listQuery.workOrderForQuery.endDate"
        type="datetime"
        placeholder="工单发起时间"
        class="filter-item"
      />

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
    <el-table style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)" ref="multipleTable" :data="table.list"
              border fit highlight-current-row
              @selection-change="handleSelectTableRows"
              :cell-style="tableBodyCellStyle"
              :header-cell-style="tableHeaderCellStyle"

    >

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
          {{ scope.row.id }}
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
            {{ row | statusTextFilter}}
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

          <router-link :to="'/workOrder/edit/'+ row.id">
            <el-button type="primary" size="mini" style="margin:  0 10px 0 0;">
              编辑
            </el-button>
          </router-link>

          <el-button type="danger" size="mini" @click="handleWorkOrderDelete(row)">
            删除
          </el-button>

          <el-button v-if="row.workOrderCancelled()" :disabled="row.workOrderFinished()" type="warning" size="mini" @click="handleWorkOrderInvalidation(row)">
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

<style scoped>

  body{
    background-color: #eeeeee;
  }

  .batchOpt {
    display: flex;
    border-radius: 28px;
    border: 1px solid #dadce0;
    justify-content: space-between;
    padding: 16px;
    margin-bottom: 10px;
    background-color: #ffffff;
  }


  /deep/ .el-input__inner{   /*或者 .s2>>>.el-input__inner  */
    border-radius: 28px;    /*输入框圆角值*/
  }

  /deep/ .el-button{
    border-radius: 20px;    /*输入框圆角值*/
  }

  /deep/ .el-table__row {
    background-color: #ffffff;
  }

  /deep/ .el-table--border {
    border: 0px solid;
  }

  /deep/ .el-table {
    background-color:transparent;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 28px;
  }

  /deep/ .el-table::before, .el-table::after {
    width: 0px;
  }
</style>
