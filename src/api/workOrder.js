import request from "@/utils/request";
// import * as userUtils from "@/utils/userUtils";

export function getAllWorkOrders(data) {
  // debugger
  return request({
    url: "/admin/workOrders",
    method: "get",
    params:data
  });
}

export function deleteAllWorkOrdersByIdList(idList) {
  // debugger
  return request({
    url: "/admin/workOrders",
    method: "delete",
    data:{
      idList
    }
  });
}

export function invalidateWorkOrder(idList) {
  // debugger
  return request({
    url: `/admin/workOrder/cancellation`,
    method: "put",
    data: {
      idList:idList
    }
  });
}


export function enableWorkOrder(idList) {
  // debugger
  return request({
    url: `/admin/workOrder/enablement`,
    method: "put",
    data: {
      idList:idList
    }
  });
}


export function updateWorkOrder(workOrder) {
  // debugger
  return request({
    url: `/admin/workOrder/${workOrder.id}`,
    method: "put",
    data: workOrder
  });
}

export function uploadWorkOrderAttachment(workOrderId, attachmentFormData) {
  // debugger
  return request({
    url: `/workOrder/attachment/${workOrderId}`,
    method: "put",
    data: attachmentFormData
  });
}

export function downloadWorkOrderAttachment(workOrderId) {
  // debugger
  return request({
    url: `/workOrder/attachment/${workOrderId}`,
    method: "get",
    responseType: "blob"
  });
}

export function deleteWorkOrderAttachment(workOrderId) {
  // debugger
  return request({
    url: `/workOrder/attachment/${workOrderId}`,
    method: "delete"
  });
}


