<template>
  <div class="app-container">
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
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
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

    <el-table :data="list" border fit highlight-current-row>
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
          <div v-for="item in scope.row.roleList">
            {{ item.text }}
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
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
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

    <!--"-->
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
  import * as userUtils from "@/utils/userUtils.js";
  import * as userApi from "@/api/user";
  import * as commonInfoApi from "@/api/commonInfo.js";
  import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

  export default {
    filters: {
      statusIconFilter(isLock) {
        return isLock == 1 ? "danger" : "success";
      },
      statusTextFilter(isLock) {
        return isLock == 1 ? "锁定" : "可用";
      }
    },
    components: {Pagination},
    data() {
      return {
        /**
         * 通用信息：课程列表，专业列表，部门列表，年级列表
         */
        commonInfo: {
          collegeList: [],
          majorList: [],
          secondaryDeptList: [],
          gradeList: userUtils.gradeMap
        },
        updateDialog: {
          dialogFormVisible: false,
          rules: {
            studentId: [
              {required: true, message: "学号不能为空", trigger: "change"}
            ],
            jobId: [
              {required: true, message: "工号不能为空", trigger: "change"}
            ],
            name: [
              {required: true, message: "姓名不能为空", trigger: "change"}
            ],
            clazzName: [
              {required: true, message: "班级不能为空", trigger: "change"}
            ]
          },
          temp: {
            id: undefined,
            mainRole: {id: 1},
            importance: 1,
            remark: "",
            timestamp: new Date(),
            title: "",
            type: "",
            status: "published",
            collegeId: 1,
            majorId: undefined,
            clazzId: undefined,
            grade: undefined
          }
        },
        listQuery: {
          userType: "student",
          user: {
            roleCategory: "",

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
            isLock: 1,
            majorName: "软件工程"
          }
        ],
        userTypes: ["student", "teacher", "all"]
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      userGradeMap(grade) {
        return userUtils.userGradeMap(grade);
      },
      userCase(role) {
        return userUtils.userCase(role);
      },
      updateData() {

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.updateDialog.temp);
            // 选出用户的一个角色作为代表性角色

            userApi.updateUser(tempData).then(
              (res) => {
                // 只更新页面中的指定行
                const index = this.list.findIndex(v => {
                  return v.id === this.updateDialog.temp.id;
                });
                const updatedUser = res.data
                let user = {}
                this.handleUser(updatedUser, user)
                this.list.splice(index, 1, user);
                // 关闭弹窗
                this.updateDialog.dialogFormVisible = false;
                // 显示成功
                this.$notify({
                  title: "Success",
                  message: "Update Successfully",
                  type: "success",
                  duration: 2000
                });
              },
              err => {
                console.log(err);
                // this.$notify({
                //   title: 'Fail',
                //   message: 'Unknown Error',
                //   type: 'fail',
                //   duration: 2000
                // })
              }
            );

          }
        })


      },
      handleUpdate(row) {
        // 将该行记录更新到temp

        this.updateDialog.temp = Object.assign({}, row);

        // 显示对话框
        this.updateDialog.dialogFormVisible = true;
        // 清除表单验证
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
      },
      handleChange() {
        this.listQuery.user.studentId = this.listQuery.user.jobId;
      },
      handleSizeChange(val) {
        this.page.size = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.page.current = val;
        this.fetchData();
      },

      handleFilter() {
        this.fetchData();
      },
      parseUser() {
        let page = {};
        if (!this.page) {
          page = {size: 5, current: 1};
        } else {
          page = this.page;
        }

        const user = {
          name: this.listQuery.user.name
        };

        user.roleCategory = this.listQuery.userType;
        if (this.listQuery.userType === "student") {
          user.majorName = this.listQuery.user.major;
          user.className = this.listQuery.user.clazz;
          user.studentId = this.listQuery.user.studentId;
        } else if (this.listQuery.userType === "teacher") {
          user.secondaryDeptName = this.listQuery.user.secondaryDept;
          user.jobId = this.listQuery.user.jobId;
        } else if (this.listQuery.userType === "all") {
          user.studentId = this.listQuery.user.studentId;
          user.jobId = this.listQuery.user.jobId;
        }

        return {
          page,
          user
        };
      },
      /**
       * 传入后端发送过来的user数据结构，将其按照下述规则映射到前端数据结构
       * @param src
       * @param user
       */
      handleUser(src, user) {
        const basicInfo = src.result;
        const detailInfo = src.detailInfo;
        user.id = basicInfo.id;
        user.name = basicInfo.name;
        if (detailInfo.college) {
          user.collegeName = detailInfo.college.name;
          user.collegeId = detailInfo.college.id;
        }
        if (detailInfo.major) {
          user.majorName = detailInfo.major.name;
          user.majorId = detailInfo.major.id;
        }
        if (basicInfo["clazzName"]) {
          user.clazzName = basicInfo["clazzName"]
        }
        if (detailInfo.secondaryDept) {
          user.secondaryDeptName = detailInfo.secondaryDept.name;
          user.secondaryDeptId = detailInfo.secondaryDept.id;
        }
        if (basicInfo.grade) {
          user.grade = basicInfo.grade;
        }
        if (basicInfo.studentId) {
          user.studentId = basicInfo.studentId;
        }
        if (basicInfo.jobId) {
          user.jobId = basicInfo.jobId;
        }
        user.roleList = detailInfo.roleList;
        user.isLock = basicInfo.isLock;
        user.mainRole = userUtils.pickMainUserRole(user.roleList);
      },
      handleUserList(userList) {

        const resultList = [];
        for (const userFromServer of userList) {
          let user = {}
          this.handleUser(userFromServer, user)
          resultList.push(user);
        }
        return resultList;
      },
      fetchData() {
        // 拉取用户列表
        const {page, user} = this.parseUser();

        // this.listLoading = true
        userApi
          .getAllUsers(page, user)
          .then(
            res => {
              const userList = res.data.result;
              const detailInfo = res.data.detailInfo;
              // 改变列表
              this.list = this.handleUserList(userList);
              this.page.total = detailInfo.total;

              // this.list = response.data.items
              // this.listLoading = false
            },
            err => {
              console.log("err", err);
            }
          )
          .catch(reject => {
            console.log("err occurred in userApi.getAllUsers(page, user)", reject);
          });

        commonInfoApi.getCommonInfo().then(res => {
          this.commonInfo.collegeList = res.data.collegeList;
          this.commonInfo.majorList = res.data.majorList;
          this.commonInfo.clazzList = res.data.clazzList;
          this.commonInfo.secondaryDeptList = res.data.secondaryDeptList;
        });
      },

      handleLockStatue(rowData, destStatus) {
        const userId = rowData.id;
        userApi.lockUser(userId, destStatus).then(() => {
          rowData.isLock = destStatus;
        });
      }
    }
  };
</script>
