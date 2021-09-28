import request from "@/utils/request";
// import * as userUtils from "@/utils/userUtils";

export function getAllWorkOrders(data) {
  return request({
    url: "/admin/workOrders",
    method: "post",
    data
  });
}

