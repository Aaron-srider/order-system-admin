function changeRowStatus(vueList, invalidatedRow, isFinished, workOrderStatus) {
  //找到该行下标
  const index = vueList.findIndex((item) => item.workOrderId==invalidatedRow.workOrderId)

  //修改该行状态
  const invaliatedWorkOrder=Object.assign(
    {}, invalidatedRow
  )
  invaliatedWorkOrder.workOrderStatus=workOrderStatus
  invaliatedWorkOrder.isFinished=isFinished

  //更新该行
  vueList.splice(index, 1, invaliatedWorkOrder)
}

export function handleWorkOrder(rawData) {
  const result = rawData.result
  const detailInfo = rawData.detailInfo
  const workOrder = {}
  workOrder.workOrderId = result.id
  workOrder.workOrderType = detailInfo.flow.result.name
  workOrder.initiatorName = detailInfo.initiator.result.name
  workOrder.workOrderTitle = result.title
  workOrder.workOrderStatus = result.status
  workOrder.createTime = result.createTime
  workOrder.isFinished = result.isFinished
  workOrder.workOrderContent = result.content
  workOrder.attachmentName = result.attachmentName
  workOrder.attachmentSize = result.attachmentSize
  return workOrder
}

export function afterInvalidateWorkOrder(vueList, invalidatedRow) {
  //如果该行已经作废了，则不处理
  if(invalidatedRow.isFinished==1) {
    return
  }

  changeRowStatus(vueList, invalidatedRow, 1, 4)
}

export function afterEnableWorkOrder(vueList, enabledRow) {
  //如果该行不是作废的行，不予开启
  if(enabledRow.workOrderStatus!=4) {
    return
  }

  changeRowStatus(vueList, enabledRow, 0, 0)
}
