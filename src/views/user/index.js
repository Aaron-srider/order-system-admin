import * as userUtils from "@/utils/userUtils.js";
import {User}from "@/utils/userUtils.js";
import * as userApi from "@/api/user";
import * as commonInfoApi from "@/api/commonInfo.js";
import Pagination from "@/components/Pagination";
import {UserForQuery} from "@/utils/userUtils"; // secondary package based on el-pagination
import {Table} from "@/views/user/page.js"; // secondary package based on el-pagination

let that;

export default {
  beforeCreate() {
    that = this
  },
  filters: {
    convertCollegeId2Name(collegeId) {
      const index = that.commonInfo.collegeList.findIndex((item) => item.id == collegeId)
      return that.commonInfo.collegeList[index].name
    },
    statusIconFilter(isLock) {
      return isLock == 1 ? "danger" : "success";
    },
    statusTextFilter(isLock) {
      return isLock == 1 ? "锁定" : "可用";
    },
    convertRoleId2Role(roleId) {
      const index = that.commonInfo.roleList.findIndex((item) => item.id == roleId)
      return that.commonInfo.roleList[index].text
    }
  },
  components: {Pagination},
  data() {
    return {
      table: new Table(6),
      /**
       * 通用信息：课程列表，专业列表，部门列表，年级列表
       */
      commonInfo: {
        collegeList: [],
        majorList: [],
        secondaryDeptList: [],
        gradeList: userUtils.gradeMap,
        roleList: []
      },
      updateDialog: {
        dialogFormVisible: false,
        updateRoleDialogFormVisible: false,
        rules: {
          studentJobId: [
            {required: true, message: "学号/工号不能为空", trigger: "blur"}
          ],
          name: [
            {required: true, message: "姓名不能为空", trigger: "blur"}
          ],
          grade: [
            {required: true, message: "年级不能为空", trigger: "blur"}
          ],
          secondaryDeptId: [
            {required: true, message: "系/部不能为空", trigger: "blur"}
          ],
          clazzName: [
            {required: true, message: "班级不能为空", trigger: "blur"}
          ]
        },
        temp: new User()
      },
      listQuery: {
        userType: "all",
        user: new User()
      },
      page: {
        current: 1,
        total: 0,
        size: 10
      },


      list: [

      ],
      userTypes: ["student", "teacher", "all"]
    };
  },
  created() {
    commonInfoApi.getCommonInfo().then(res => {
      this.commonInfo.collegeList = res.data.collegeList;
      this.commonInfo.majorList = res.data.majorList;
      this.commonInfo.clazzList = res.data.clazzList;
      this.commonInfo.secondaryDeptList = res.data.secondaryDeptList;
      this.commonInfo.roleList = res.data.roleList;
      this.commonInfo.filterRoleList = res.data.roleList.filter((role) => role.id != 1 && role.id != 2)
      this.fetchData();
    });
  },
  methods: {

    whenQueryCaseChanged() {
      this.listQuery.user = {}
    },

    clearValidateWhenDialogClose() {
      this.$refs["dataForm"].clearValidate()
    },

    promote(userId) {
      userApi.promote(userId).then((res) => {
        const index = this.list.findIndex((item) => item.id == userId)
        this.list[index].roleList.push({id: 1})

      })
    },

    demote(userId) {
      userApi.demote(userId).then((res) => {
        const index = this.list.findIndex((item) => item.id == userId)
        const index2 = this.list[index].roleList.findIndex((item) => item.id == 1)
        this.list[index].roleList.splice(index2, 1)
      })
    },

    isAdmin(user) {
      return user.isAdmin()
    },

    tableBodyCellStyle(obj){
      return this.table.tableBodyCellStyle(obj)
    },

    tableHeaderCellStyle(obj) {
      return this.table.tableHeaderCellStyle(obj)
    },

    userGradeMap(grade) {
      return userUtils.userGradeMap(grade);
    },

    userCase_name_case(role) {
      return userUtils.userCase_name_case(role);
    },

    userCase_id_case(role) {
      return userUtils.userCase_id_case(role);
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          let user2Update = new User();

          user2Update = Object.assign(user2Update, this.updateDialog.temp);

          // 选出用户的一个角色作为代表性角色
          userApi.updateUser(user2Update).then(
            (res) => {
              // 只更新页面中的指定行
              const index = this.table.list.findIndex(item => item.id === this.updateDialog.temp.id);
              this.table.list.splice(index, 1, user2Update);
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

      let tempUser = new User();
      this.updateDialog.temp = Object.assign(tempUser, row);

      // 显示对话框
      this.updateDialog.dialogFormVisible = true;

      // 清除表单验证
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
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

      const userForQuery = new UserForQuery();
      userForQuery.name = this.listQuery.user.name;
      userForQuery.studentJobId = this.listQuery.user.studentJobId;
      userForQuery.roleCategory = this.listQuery.userType;

      if (this.listQuery.userType === "student") {
        userForQuery.majorName = this.listQuery.user.major;
        userForQuery.className = this.listQuery.user.clazz;
      } else if (this.listQuery.userType === "teacher") {
        userForQuery.secondaryDeptName = this.listQuery.user.secondaryDept;
      }

      return {
        page,
        userForQuery
      };
    },

    handleUserList(userList) {
      const resultList = [];
      for (const userFromServer of userList) {
        let user = userUtils.handleUser(userFromServer)
        resultList.push(user);
      }
      return resultList;
    },

    fetchData() {
      // 拉取用户列表
      const {page, userForQuery} = this.parseUser();
      // this.listLoading = true
      userApi
        .getAllUsers(page, userForQuery)
        .then(
          res => {
            const userList = res.data.records;
            // 改变列表
            this.table.list = this.handleUserList(userList);
            this.page.total = res.data.total;

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
    },

    handleLockStatue(rowData, destStatus) {
      const userId = rowData.id;
      userApi.lockUser(userId, destStatus).then(() => {
        rowData.isLock = destStatus;
      });
    }
  }
};
