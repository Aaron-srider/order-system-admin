import * as userUtils from "@/utils/userUtils.js";
import * as userApi from "@/api/user";
import * as commonInfoApi from "@/api/commonInfo.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

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
          studentId: [
            {required: true, message: "学号不能为空", trigger: "change"}
          ],
          jobId: [
            {required: true, message: "工号不能为空", trigger: "change"}
          ],
          name: [
            {required: true, message: "姓名不能为空", trigger: "change"}
          ],
          grade: [
            {required: true, message: "年级不能为空", trigger: "change"}
          ],
          secondaryDeptId: [
            {required: true, message: "系/部不能为空", trigger: "change"}
          ],
          clazzName: [
            {required: true, message: "班级不能为空", trigger: "change"}
          ]
        },
        temp: {
          roleList:[],
          id: undefined,
          mainRoleId: undefined,
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
        userType: "all",
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

    promote(userId) {
      userApi.promote(userId).then((res) => {
        const index= this.list.findIndex((item) => item.id==userId)
        this.list[index].roleList.push({id: 1})

      })
    },
    demote(userId) {
      userApi.demote(userId).then((res) => {
        const index= this.list.findIndex((item) => item.id==userId)
        const index2 = this.list[index].roleList.findIndex((item) => item.id==1)
        this.list[index].roleList.splice(index2, 1)
      })
    },


    isAdmin(user) {
      for (let i = 0; i < user.roleList.length; i++) {
        if(userUtils.isAdmin(user.roleList[i].id) == "admin") {
          return true
        }
      }
      return false
    },
    updateRoleData() {
      this.$refs['roleDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.updateDialog.temp);

          // 选出用户的一个角色作为代表性角色
          userApi.userInfoComplete(tempData).then(
            (res) => {
              console.log(res)
              // 只更新页面中的指定行
              const index = this.list.findIndex(item => item.id === this.updateDialog.temp.id);
              userUtils.afterUpdateUserRole(tempData)
              this.list.splice(index, 1, tempData);
              // 关闭弹窗
              this.updateDialog.updateRoleDialogFormVisible = false;
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
    handleUpdateRole(row) {
      this.updateDialog.temp = Object.assign({}, row);

      // 显示对话框
      this.updateDialog.updateRoleDialogFormVisible = true;
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
          const tempData = Object.assign({}, this.updateDialog.temp);

          // 选出用户的一个角色作为代表性角色
          userApi.updateUser(tempData).then(
            (res) => {
              // 只更新页面中的指定行
              const index = this.list.findIndex(item => item.id === this.updateDialog.temp.id);
              this.list.splice(index, 1, tempData);
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

    handleUserList(userList) {
      const resultList = [];
      for (const userFromServer of userList) {
        let user = {}
        userUtils.handleUser(userFromServer, user)
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
        this.commonInfo.roleList = res.data.roleList;
        this.commonInfo.filterRoleList = res.data.roleList.filter((role) => role.id != 1 && role.id != 2)
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
