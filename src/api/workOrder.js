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

