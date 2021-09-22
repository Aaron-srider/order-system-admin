<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.userType" placeholder="用户类型" style="width: 130px" class="filter-item">
        <el-option v-for="userType in userTypes" :key="userType" :label="userType" :value="userType"/>
      </el-select>

      <el-input v-if="listQuery.userType=='student'" v-model="listQuery.user.name" placeholder="姓名"
                style="width: 130px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-input v-if="listQuery.userType=='student'" v-model="listQuery.user.major" placeholder="专业"
                style="width: 130px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-input v-if="listQuery.userType=='student'" v-model="listQuery.user.clazz" placeholder="班级"
                style="width: 130px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-input v-if="listQuery.userType=='student'" v-model="listQuery.user.studentId" placeholder="学号"
                style="width: 130px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>


      <el-input v-if="listQuery.userType=='teacher'" v-model="listQuery.user.name" placeholder="姓名"
                style="width: 130px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-input v-if="listQuery.userType=='teacher'" v-model="listQuery.user.secondaryDept" placeholder="二级部门"
                style="width: 130px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-input v-if="listQuery.userType=='teacher'" v-model="listQuery.user.jobId" placeholder="工号"
                style="width: 130px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>


      <!--<el-select v-model="listQuery.user.studentId" placeholder="学号" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->


      <!--<el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
      <!--<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'"-->
      <!--:value="item.key"/>-->
      <!--</el-select>-->
      <!--<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>-->
      <!--</el-select>-->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"-->
      <!--@click="handleCreate">-->
      <!--Add-->
      <!--</el-button>-->
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"-->
      <!--@click="handleDownload">-->
      <!--Export-->
      <!--</el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--reviewer-->
      <!--</el-checkbox>-->
    </div>

    <el-table
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
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
          <span>{{ scope.row.collegeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="账号状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isLock | statusIconFilter">{{ scope.row.isLock | statusTextFilter}}</el-tag>
        </template>
      </el-table-column>


      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.isLock==1" size="mini" type="success" @click="handleLockStatue(row,0)">
            解锁
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleLockStatue(row,1)">
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
      v-show="page.total>0"
      :total="page.total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="fetchData"/>

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
  import * as userApi from '@/api/user'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    filters: {
      statusIconFilter(isLock) {
        return isLock == 1 ? 'danger' : 'success'
      },
      statusTextFilter(isLock) {
        return isLock == 1 ? '锁定' : '可用'
      }
    },
    components: {Pagination},
    data() {
      return {
        listQuery: {
          userType: "student",
          user: {
            name: "",
            major: "",
            clazz: "",
            studentId: "",

            secondaryDept: "",
            jobId: ""
          }
        },
        page: {
          current: 1,
          total: 0,
          size: 10
        },
        list: [
          {
            name: "文超",
            collegeName: "计算机学院",
            role: "本科生",
            isLock: 1
          }
        ],
        userTypes: [
          "student",
          "teacher"
        ]
      }
    },
    created() {
      this.fetchData()
    },
    methods: {

      handleSizeChange(val) {
        this.page.size = val;
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.page.current = val;
        this.fetchData()
      },

      handleFilter() {
        this.fetchData()


      },


      fetchData() {
        let page = {};
        if (!this.page) {
          page = {size: 5, current: 1}
        } else {
          page = this.page;
        }


        let user = {
          name: this.listQuery.user.name
        }
        if (this.listQuery.userType === 'student') {
          user.majorName = this.listQuery.user.major
          user.className = this.listQuery.user.clazz
          user.studentId = this.listQuery.user.studentId

        } else {
          user.secondaryDeptName = this.listQuery.user.secondaryDept
          user.jobId = this.listQuery.user.jobId
        }


        // this.listLoading = true
        userApi.getAllUsers(page, user).then(res => {


            console.log("res", res)
            const userList = res.data.result

            const resultList = []
            for (let item of userList) {
              let basicInfo = item.result
              let detailInfo = item.detailInfo
              let user = {}
              user.id = basicInfo.id
              user.name = basicInfo.name
              user.collegeName = detailInfo.college.name
              user.role = detailInfo.role.text
              user.isLock = basicInfo.isLock
              resultList.push(user)
            }
            this.list = resultList
            this.page.total = res.data.detailInfo.total
            // this.list = response.data.items
            // this.listLoading = false
          },
          (err) => {
            console.log("err", err)
          })
      },

      handleLockStatue(rowData, destStatus) {

        const userId = rowData.id
        userApi.lockUser(userId, destStatus)
          .then(() => {
            rowData.isLock = destStatus;
          })

      }
    }
  }
</script>
