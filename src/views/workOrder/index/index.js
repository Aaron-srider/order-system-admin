import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import * as workOrderApi from "@/api/workOrder.js"; // secondary package based on el-pagination
import {parseTime} from "@/utils/index.js"; // secondary package based on el-pagination
import {afterEnableWorkOrder, afterInvalidateWorkOrder, handleWorkOrder} from "@/utils/workOrder";
import {WorkOrder, WorkOrderForQuery} from "@/utils/workOrder";
import {Table} from "@/views/user/page";
import {deleteItemFromList} from "@/utils/commonUtils";

let that;
export default {
  onCreate() {
    this.fetchData();
  },

  beforeCreate() {
    that = this
  },

  computed: {
    rowSelected() {
      return this.selectedItems.length > 0
    }
  },

  filters: {
    statusFilter() {

    },

    /**
     * 根据工单状态代码返回相应的文本
     * @param workOrder 工单
     * @returns 返回工单状态对应的文本（text）
     */
    statusTextFilter(workOrder) {
      return workOrder.status2Text();
    },

    /**
     * 根据工单状态代码返回相应的icon类型（类型字符串由el组件规定）
     * @param workOrderStatus 工单状态代码（value）
     * @returns 返回工单状态对应的icon类型字符串
     */
    statusIconFilter(workOrderStatus) {
      const iconMap = {
        0: '',
        1: 'success',
        2: 'danger',
        3: 'warning',
        4: 'info'
      }
      return iconMap[workOrderStatus]
    }

  },
  components: {Pagination},
  data() {
    return {
      selectedItems: [],
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
            value: 0,
            alias: "BEING_EXAMINED",
            text: "在审"
          },
          {
            id: 1,
            value: 1,
            alias: "COMPLETED_SUCCESSFULLY",
            text: "顺利通过"
          },
          {
            id: 2,
            value: 2,
            alias: "NOT_APPROVED",
            text: "不通过"
          },
          {
            id: 3,
            value: 3,
            alias: "BEEN_WITHDRAWN",
            text: "被撤回"
          },
          {
            id: 4,
            value: 4,
            alias: "INVALIDATION",
            text: "作废"
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
        workOrderForQuery: new WorkOrderForQuery()
      },
      page: {
        current: 1,
        total: 2,
        size: 10
      },
      table: new Table(8),
      userTypes: ["student", "teacher", "all"]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {

    enableWorkOrder(workOrder2BeEnabled) {
      this.enableWorkOrderList([workOrder2BeEnabled])
    },

    /**
     * 将传入的所有行都开启
     * @param workOrder2BeEnabledList 需要确保传入的所有行都是作废状态的
     */
    enableWorkOrderList(workOrder2BeEnabledList) {

      const workOrderList2BeEnabledIdList = workOrder2BeEnabledList.map((item) => item.id)
      workOrderApi.enableWorkOrder(workOrderList2BeEnabledIdList).then(() => {
        for (let i = 0; i < workOrder2BeEnabledList.length; i++) {
          workOrder2BeEnabledList[i].enable();
        }
        this.afterMultipleManipulation()
      })
    },

    afterMultipleManipulation() {
      this.selectedItems = []
      this.$refs.multipleTable.clearSelection();
    },

    handleBatchWorkOrderDelete() {

      this.$confirm(`您确定要删除这${this.selectedItems.length}条工单吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selectedWorkOrderIdList = this.selectedItems.map(item => item.id);

        workOrderApi.deleteAllWorkOrdersByIdList(selectedWorkOrderIdList)
          .then(res => {
            //界面上删除工单
            for (let i = 0; i < this.selectedItems.length; i++) {
              deleteItemFromList(this.table.list, "id", selectedWorkOrderIdList[i])
            }
            this.afterMultipleManipulation()
          })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },

    handleBatchWorkOrderInvalidation() {

      const workOrderNotFinishedYet = this.selectedItems.filter((item) => item.isFinished == 0)
      const workOrder2BeInvalidatedIdList = workOrderNotFinishedYet.map(item => item.id)


      if (workOrder2BeInvalidatedIdList.length == 0) {
        this.$confirm('没有工单可以作废', '提示', {
          confirmButtonText: '确定',
          type: 'info',
        showCancelButton:false
        }).then(() => {

        })
      } else {
        this.$confirm(`您确定要作废这${workOrder2BeInvalidatedIdList.length}条工单吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          workOrderApi.invalidateWorkOrder(workOrder2BeInvalidatedIdList)
            .then(res => {
              for (let i = 0; i < workOrderNotFinishedYet.length; i++) {
                workOrderNotFinishedYet[i].invalidate();
              }
              this.afterMultipleManipulation()
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废'
          });
        });
      }

    },

    /**
     * 将选中的row信息保存到selectedItem中
     * @param selectedTableRows 选中的所有行信息（数组）
     */
    handleSelectTableRows(selectedTableRows) {
      this.selectedItems = selectedTableRows
    },

    handleWorkOrderInvalidation(workOrder2BeInvalidated) {
      //如果工单结束，无法作废
      if (workOrder2BeInvalidated.workOrderFinished()) {
        this.$message({
          message: '工单已经结束，无法作废',
          type: 'warning'
        });
      } else {
        workOrderApi.invalidateWorkOrder([workOrder2BeInvalidated.id])
          .then(() => {
            workOrder2BeInvalidated.invalidate();
            this.$message({
              message: '作废成功',
              type: 'success'
            });
          })
      }
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
    handleWorkOrderDelete(row) {

      workOrderApi.deleteAllWorkOrdersByIdList([row.id])
        .then(res => {
          deleteItemFromList(this.table.list, "id", row.id);
        })
    },
    tableBodyCellStyle(obj) {
      console.log(this.table)
      return this.table.tableBodyCellStyle(obj)
    },
    tableHeaderCellStyle(obj) {
      return this.table.tableHeaderCellStyle(obj)
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

      let workOrderForQuery = new WorkOrderForQuery()
      //装配查询对象
      workOrderForQuery = Object.assign(workOrderForQuery, this.listQuery.workOrderForQuery)

      if (workOrderForQuery.startDate) {
        workOrderForQuery.startDate = parseTime(workOrderForQuery.startDate)
      }
      if (workOrderForQuery.endDate) {
        workOrderForQuery.endDate = parseTime(workOrderForQuery.endDate)
      }

      workOrderForQuery.current = this.page.current
      workOrderForQuery.size = this.page.size
      workOrderApi.getAllWorkOrders(workOrderForQuery)
        .then((res) => {
            //
            if (res.code == 500) {
              console.log(res)
            } else if (res.code == 200) {
              console.log(res)

              this.page.total = res.data.total

              const workOrderListFromServer = res.data.records
              this.table.list = this.handleWorkOrderPage(workOrderListFromServer)
            } else {
              console.log(res.message)
            }
          },
          (err) => {
            console.log(err)
          })

    },

    handleWorkOrderPage(workOrderListFromServer) {

      const workOrderListOnTable = []
      for (let oneWorkOrderFromServer of workOrderListFromServer) {
        const workOrderAfterPrepared = handleWorkOrder(oneWorkOrderFromServer)
        workOrderListOnTable.push(workOrderAfterPrepared)
      }

      return workOrderListOnTable
    },

    handleLockStatue(rowData, destStatus) {
      const userId = rowData.id;

    }
  }
}
