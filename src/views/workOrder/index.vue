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


    <!--data-->
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
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
            {{ row.workOrderStatus  | statusTextFilter}}
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
          <el-button type="danger" size="mini" @click="handleWorkOrderDelete(row)">
            删除
          </el-button>

          <el-button type="danger" size="mini" @click="handleWorkOrderInvalidation(row)">
            作废
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

    <!--popup dialog-->
    <el-dialog title="update" :visible.sync="updateDialog.dialogFormVisible">
      <el-form
        :rules="updateDialog.rules"
        ref="dataForm"
        :model="updateDialog.temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="updateDialog.temp.name" placeholder="姓名"/>
        </el-form-item>


        <!--<el-form-item label="班级" prop="clazz">-->
        <!--<el-input v-model="updateDialog.temp.clazzName" placeholder="班级名称"/>-->
        <!--</el-form-item>-->

        <el-form-item label="学院名称">
          <el-select
            v-model="updateDialog.temp.collegeId"
            placeholder="学院名称"
            style="width: 130px"
            class="filter-item"
          >
            <el-option
              v-for="college in commonInfo.collegeList"
              :key="college.name"
              :label="college.name"
              :value="college.id"
            />
          </el-select>
        </el-form-item>


        <div v-if="userCase(updateDialog.temp.mainRole) == 'student'">
          <el-form-item label="班级" prop="clazzName">
            <el-input v-model="updateDialog.temp.clazzName" placeholder="班级名称"/>
          </el-form-item>
          <el-form-item label="年级">
            <el-select
              v-model="updateDialog.temp.grade"
              placeholder="年级"
              style="width: 130px"
              class="filter-item"
            >
              <el-option
                v-for="grade in [1, 2, 3, 4, 5, 6, 7]"
                :key="grade"
                :label="userGradeMap(grade)"
                :value="grade"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="学号" prop="studentId">
            <el-input
              v-model="updateDialog.temp.studentId"
              placeholder="学号"
            />
          </el-form-item>
        </div>

        <div v-if="userCase(updateDialog.temp.mainRole) == 'teacher'">
          <el-form-item label="系/部门">
            <el-select
              v-model="updateDialog.temp.secondaryDeptId"
              placeholder="系/部门"
              style="width: 130px"
              class="filter-item"
            >
              <el-option
                v-for="dept in commonInfo.secondaryDeptList"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="工号" prop="jobId">
            <el-input v-model="updateDialog.temp.jobId" placeholder="工号"/>
          </el-form-item>
        </div>

        <!--<el-form-item label="Date" prop="timestamp">-->
        <!--<el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Title" prop="title">-->
        <!--<el-input v-model="temp.title" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Status">-->
        <!--<el-select v-model="temp.status" class="filter-item" placeholder="Please select">-->
        <!--<el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Imp">-->
        <!--<el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Remark">-->
        <!--<el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialog.dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import page from "@/views/workOrder/index.js"; // secondary package based on el-pagination

  export default page

</script>
