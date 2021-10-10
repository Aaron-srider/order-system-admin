<template>
  <div class="app-container">

    <!--搜索框-->
    <div class="filter-container">
      <el-select
        v-model="listQuery.userType"
        placeholder="用户类型"
        style="width: 130px"
        class="filter-item"
      >
        <el-option
          v-for="userType in userTypes"
          :key="userType"
          :label="userType"
          :value="userType"
        />
      </el-select>

      <el-input
        v-if="listQuery.userType == 'student'"
        v-model="listQuery.user.name"
        placeholder="姓名"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-if="listQuery.userType == 'student'"
        v-model="listQuery.user.major"
        placeholder="专业"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-if="listQuery.userType == 'student'"
        v-model="listQuery.user.clazz"
        placeholder="班级"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-if="listQuery.userType == 'student'"
        v-model="listQuery.user.studentId"
        placeholder="学号"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-if="listQuery.userType == 'teacher'"
        v-model="listQuery.user.name"
        placeholder="姓名"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-if="listQuery.userType == 'teacher'"
        v-model="listQuery.user.secondaryDept"
        placeholder="二级部门"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-if="listQuery.userType == 'teacher'"
        v-model="listQuery.user.jobId"
        placeholder="工号"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-if="listQuery.userType == 'all'"
        v-model="listQuery.user.name"
        placeholder="姓名"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-if="listQuery.userType == 'all'"
        v-model="listQuery.user.jobId"
        placeholder="学号/工号"
        style="width: 130px;"
        class="filter-item"
        @change="handleChange()"
        @keyup.enter.native="handleFilter"
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


    <!--数据列表-->
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="学院名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.collegeId | convertCollegeId2Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.roleList">
            {{ item.id | convertRoleId2Role}}
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="账号状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isLock | statusIconFilter">{{
            scope.row.isLock | statusTextFilter
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="Actions"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">


          <el-button type="primary" size="mini" @click="handleUpdateRole(row)">
            修改角色
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改信息
          </el-button>
          <el-button
            v-if="row.isLock == 1"
            size="mini"
            type="success"
            @click="handleLockStatue(row, 0)"
          >
            解锁
          </el-button>
          <el-button
            v-else
            size="mini"
            type="danger"
            @click="handleLockStatue(row, 1)"
          >
            锁定
          </el-button>
        </template>
      </el-table-column>
      <!--<el-user-column align="center" prop="created_at" label="Display_time" width="200">-->
      <!--<template slot-scope="scope">-->
      <!--<i class="el-icon-time" />-->
      <!--<span>{{ scope.row.display_time }}</span>-->
      <!--</template>-->
      <!--</el-user-column>-->
    </el-table>

    <pagination
      v-show="page.total > 0"
      :total="page.total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="fetchData"
    />


    <!--修改窗口-->
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


        <div v-if="userCase_id_case(updateDialog.temp.mainRoleId) == 'student'">
          <el-form-item label="班级" prop="clazzName">
            <el-input v-model="updateDialog.temp.clazzName" placeholder="班级名称"/>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
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

        <div v-if="userCase_id_case(updateDialog.temp.mainRoleId) == 'teacher'">
          <el-form-item label="系/部门" prop="secondaryDeptId">
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


    <!--修改角色窗口-->
    <el-dialog title="update" :visible.sync="updateDialog.updateRoleDialogFormVisible">
      <el-form
        :rules="updateDialog.rules"
        ref="roleDataForm"
        :model="updateDialog.temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item label="用户角色">
          <el-select
            v-model="updateDialog.temp.mainRoleId"
            placeholder="用户角色"
            style="width: 130px"
            class="filter-item"
          >
            <el-option
              v-for="role in commonInfo.filterRoleList"
              :key="role.text"
              :label="role.text"
              :value="role.id"
            />
          </el-select>
        </el-form-item>


        <!--如果是学生展示这条-->
        <div v-if="userCase_id_case(updateDialog.temp.mainRoleId) == 'student'">
          <el-form-item label="班级" prop="clazzName">
            <el-input v-model="updateDialog.temp.clazzName" placeholder="班级名称"/>
          </el-form-item>
          <el-form-item label="年级" prop="grade">
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
        <!--如果是教师展示这条-->
        <div v-if="userCase_id_case(updateDialog.temp.mainRoleId) == 'teacher'">
          <el-form-item label="系/部门" prop="secondaryDeptId">
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

      </el-form>

      <div slot="footer" class="myDialogFooter">

        <el-button v-if="!isAdmin(updateDialog.temp)" class="promoteBtn" type="success" @click="promote(updateDialog.temp.id)">
          设为管理员
        </el-button>
        <el-button v-else class="promoteBtn"  type="danger" @click="demote(updateDialog.temp.id)">
          取消管理员
        </el-button>

        <div class="basicDialogFooter">
          <el-button @click="updateDialog.updateRoleDialogFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="updateRoleData()">
            Confirm
          </el-button>
        </div>

      </div>
    </el-dialog>

    <!--<el-pagination-->
    <!--@size-change="handleSizeChange"-->
    <!--@current-change="handleCurrentChange"-->
    <!--:current-page="page.currentPage"-->
    <!--:page-sizes="[5, 10, 20, 30, 40]"-->
    <!--:page-size="5"-->
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <!--:total="page.total">-->
    <!--</el-pagination>-->
  </div>
</template>

<script>
  import page from "@/views/user/index.js"

  export default page
</script>
<style>

  .myDialogFooter {
    display: flex;
    justify-content: space-between;
  }

  .promoteBtn {

  }

  .basicDialogFooter {

  }


</style>
