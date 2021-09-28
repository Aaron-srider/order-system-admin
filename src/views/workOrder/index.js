import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

let that;
export default {

  beforeCreate(){
    that=this
  },

  filters: {
    statusFilter() {

    },

    /**
     * 根据工单状态代码返回相应的文本
     * @param workOrderStatus 工单状态代码（code）
     * @returns 返回工单状态对应的文本（text）
     */
    statusTextFilter(workOrderStatus) {
      for (let commonInfo_status of that.commonInfo.workOrderStatusList) {
        if(commonInfo_status.code==workOrderStatus) {
          return commonInfo_status.text
        }
      }
      return undefined
    },

    /**
     * 根据工单状态代码返回相应的icon类型（类型字符串由el组件规定）
     * @param workOrderStatus 工单状态代码（code）
     * @returns 返回工单状态对应的icon类型字符串
     */
    statusIconFilter(workOrderStatus) {
      const iconMap ={
        0: '',
        1: 'success',
        2: 'danger',
        3: 'warning'
      }
      return iconMap[workOrderStatus]
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
        gradeList: [],
        workOrderStatusList: [
          {
            id: 0,
            code: 0,
            value: "approving",
            text: "在审"
          },
          {
            id: 1,
            code: 1,
            value: "pass",
            text: "顺利通过"
          },
          {
            id: 2,
            code: 2,
            value: "reject",
            text: "不通过"
          },
          {
            id: 3,
            code: 3,
            value: "revoke",
            text: "被撤回"
          }
        ]
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
        workOrderId: 1,
        student_job_id: "20923423",
        startDate: "2021-02-11 12:21:30",
        endDate: "2021-02-11 12:21:11"
      },
      page: {
        current: 1,
        total: 2,
        size: 10
      },
      list: [
        {
          workOrderId: 1,
          //流程名字
          workOrderType: "GPU申请工单",
          InitiatorName: "文超",
          workOrderTitle: "申请gpu",
          workOrderStatus: 0,
          createDate: "2021-02-11 12:21:30"
        },
        {
          workOrderId: 2,
          //流程名字
          workOrderType: "GPU申请工单",
          InitiatorName: "邢铖",
          workOrderTitle: "申请gpu",
          workOrderStatus: 0,
          createDate: "2021-02-21 12:21:30"
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

    },
    userCase(role) {

    },
    updateData() {

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

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


    },

    handleLockStatue(rowData, destStatus) {
      const userId = rowData.id;

    }
  }
}
