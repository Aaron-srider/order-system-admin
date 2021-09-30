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

export function invalidateWorkOrder(workOrderId) {
  // debugger
  return request({
    url: `/admin/workOrder/cancellation/${workOrderId}`,
    method: "put"
  });
}

