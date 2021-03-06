import request from "@/utils/request";
import * as userUtils from "@/utils/userUtils";

// export function login(data) {
//   return request({
//     url: "/vue-admin-template/user/login",
//     method: "post",
//     data
//   });
// }

export function login(code) {
  return  request({
    url: '/admin/login',
    method: 'get',
    params:{
      code
    }
  })
}


export function getInfo(token) {
  return request({
    url: "/vue-admin-template/user/info",
    method: "get",
    params: { token }
  });
}

export function logout() {
  return request({
    url: "/vue-admin-template/user/logout",
    method: "post"
  });
}

export function getAllUsers(page, user) {
  return request({
    url: "/users",
    params: {
      size: page.size,
      current: page.current,

      studentJobId: user.studentJobId,

      roleCategory: user.roleCategory,
      name: user.name,
      majorName: user.majorName,
      clazzName: user.className,
      secondaryDeptName: user.secondaryDeptName,
    },
    method: "get"
    // params: { token }
  });
}

export function lockUser(userId, destStatus) {
  return request({
    url: "/lock/" + userId + "/" + destStatus,
    method: "put"
    // params: { token }
  });
}

export function updateUser(user) {

  let data = constructRequestUserObj(user);

  return request({
    url: "/users",
    method: "put",
    data
  });
}


export function userInfoComplete(user) {
  const data=constructRequestUserObj(user)

  return request({
    url: "/auth/userInfoCompletion",
    method: "put",
    data
  });
}

function constructRequestUserObj(user) {
  const data = {};

  data.id = user.id;
  data.name = user.name;
  data.roleId = user.mainRoleId;
  data.collegeId = user.collegeId;
  data.studentJobId = user.studentJobId;


  if (userUtils.userCase_id_case(user.mainRoleId) == "student") {
    data.majorId = user.majorId;
    data.clazzName = user.clazzName;
    data.grade = user.grade;
  } else {
    data.secondaryDeptId = user.secondaryDeptId;
  }
  return data
}

export function promote(userId) {
  return request({
    url: `/admin/user/promote/${userId}`,
    method: "post",
  });
}

export function demote(userId) {
  return request({
    url: `/admin/user/demote/${userId}`,
    method: "delete",
  });
}

