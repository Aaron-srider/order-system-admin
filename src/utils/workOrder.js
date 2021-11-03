function WorkOrder() {
  this.id = undefined
  this.workOrderType = undefined
  this.initiatorName = undefined
  this.workOrderTitle = undefined
  this.workOrderStatus = undefined
  this.createTime = undefined
  this.isFinished = undefined
  this.workOrderContent = undefined
  this.attachmentName = undefined
  this.attachmentSize = undefined
  this.attachmentDownloadId = undefined
}

WorkOrder.prototype = {
  constructor: WorkOrder,
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
  ],

  workOrderFinished() {
    return this.isFinished == 1
  },

  workOrderCancelled() {
    return this.workOrderStatus != 4
  },

  invalidate() {
    this.workOrderStatus = 4
    this.isFinished = 1
  },

  enable() {
    this.workOrderStatus = 0
    this.isFinished = 0
  },

  status2Text() {
    for (let fullWorkOrderStatusInfo of this.workOrderStatusList) {
      if (fullWorkOrderStatusInfo.value == this.workOrderStatus) {
        return fullWorkOrderStatusInfo.text
      }
    }
    return undefined
  },


  isInvalidated() {
    return this.workOrderStatus == 4
  }
}

function WorkOrderForQuery() {
  this.id = undefined
  this.studentJobId = undefined
  this.startDate = undefined
  this.endDate = undefined
}

WorkOrderForQuery.prototype = {
  constructor: WorkOrderForQuery
}

export {
  WorkOrder,
  WorkOrderForQuery
}

function changeRowStatus(tableWorkOrderList, invalidatedRow, isFinished, workOrderStatus) {
  //找到该行下标
  const index = tableWorkOrderList.findIndex((workOrderFromTable) => workOrderFromTable.id == invalidatedRow.id)

  //修改该行状态
  let invalidatedWorkOrder = new WorkOrder();
  invalidatedWorkOrder = Object.assign(
    invalidatedWorkOrder, invalidatedRow
  )

  invalidatedWorkOrder.workOrderStatus = workOrderStatus
  invalidatedWorkOrder.isFinished = isFinished

  //更新该行
  tableWorkOrderList.splice(index, 1, invalidatedWorkOrder)
}

export function handleWorkOrder(oneWorkOrderFromServer) {
  let workOrder = new WorkOrder();
  workOrder.id = oneWorkOrderFromServer.id
  workOrder.workOrderType = oneWorkOrderFromServer.flow.name
  workOrder.initiatorName = oneWorkOrderFromServer.initiator.name
  workOrder.workOrderTitle = oneWorkOrderFromServer.title
  workOrder.workOrderStatus = oneWorkOrderFromServer.status
  workOrder.createTime = oneWorkOrderFromServer.createTime
  workOrder.isFinished = oneWorkOrderFromServer.isFinished
  workOrder.workOrderContent = oneWorkOrderFromServer.content
  workOrder.attachmentName = oneWorkOrderFromServer.attachmentName
  workOrder.attachmentSize = oneWorkOrderFromServer.attachmentSize
  workOrder.attachmentDownloadId = oneWorkOrderFromServer.attachmentDownloadId
  return workOrder
}

export function afterInvalidateWorkOrder(tableWorkOrderList, invalidatedWorkOrder) {
  //如果该行已经作废了，则不处理
  if (invalidatedWorkOrder.workOrderFinished()) {
    return
  }

  invalidatedWorkOrder.invalidate();

  // changeRowStatus(tableWorkOrderList, invalidatedWorkOrder, 1, 4)
}

export function afterEnableWorkOrder(vueList, enabledRow) {

  //如果该行不是作废的行，不予开启
  if (enabledRow.workOrderStatus != 4) {
    return
  }

  changeRowStatus(vueList, enabledRow, 0, 0)
}
