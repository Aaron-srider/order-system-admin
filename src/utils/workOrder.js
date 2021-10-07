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
