import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import * as workOrderApi from "@/api/workOrder.js"; // secondary package based on el-pagination
import {parseTime} from "@/utils/index.js"; // secondary package based on el-pagination

let that;
export default {
  onCreate() {
    this.fetchData();
  },

  beforeCreate() {
    that = this
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
        if (commonInfo_status.code == workOrderStatus) {
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
      const iconMap = {
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
        workOrderId: undefined,
        student_job_id: undefined,
        startDate: undefined,
        endDate: undefined
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
          initiatorName: "文超",
          workOrderTitle: "申请gpu",
          workOrderStatus: 0,
          createTime: "2021-02-11 12:21:30"
        },
        {
          workOrderId: 2,
          //流程名字
          workOrderType: "GPU申请工单",
          initiatorName: "邢铖",
          workOrderTitle: "申请gpu",
          workOrderStatus: 0,
          createTime: "2021-02-21 12:21:30"
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
      this.fetchData()
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

    fetchData() {
//
      const query = Object.assign({}, this.listQuery)

      if (query.startDate) {
        query.startDate = parseTime(query.startDate)
      }
      if (query.endDate) {
        query.endDate = parseTime(query.endDate)
      }

      query.id = this.listQuery.workOrderId

      query.current = this.page.current

      query.size = this.page.size


      workOrderApi.getAllWorkOrders(query)
        .then((res) => {
            //
            if (res.code == 500) {
              console.log(res)
            } else if (res.code == 200) {
              console.log(res)
              const pageRes = res.data.result;


              this.page.total = pageRes.total

              const workOrderList = pageRes.records

              this.list = this.handlePageRecords(workOrderList)
            } else {
              console.log(res.message)
            }
          },
          (err) => {
            console.log(err)
          })

    },

    handlePageRecords(workOrderList) {

      const resultList = []
      for (let item of workOrderList) {
        const result = item.result
        const detailInfo = item.detailInfo
        const workOrder = {}
        workOrder.workOrderId = result.id
        workOrder.workOrderType = detailInfo.flow.result.name
        workOrder.initiatorName = detailInfo.initiator.result.name
        workOrder.workOrderTitle = result.title
        workOrder.workOrderStatus = result.status
        workOrder.createTime = result.createTime
        resultList.push(workOrder)
      }

      return resultList
    },

    handleLockStatue(rowData, destStatus) {
      const userId = rowData.id;

    }
  }
}
