import request from '@/utils/request'
import * as userUtils from  '@/utils/userUtils'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getAllUsers(page, user) {
  console.log(user)
  return request({
    url: '/users',
    params: {
      size: page.size,
      current: page.current,

      roleCategory: user.roleCategory,
      name: user.name,
      majorName: user.majorName,
      clazzName: user.className,
      studentId: user.studentId,
      secondaryDeptName: user.secondaryDeptName,
      jobId: user.jobId
    },
    method: 'get'
    // params: { token }
  })
}

export function lockUser(userId, destStatus) {
  return request({
    url: '/lock/' + userId + "/" + destStatus,
    method: 'put',
    // params: { token }
  })
}

export function updateUser(user) {
  const data = {}

  data.id=user.id
  data.name=user.name
  data.roleId=user.mainRole.id
  data.collegeName=user.collegeName

  if(userUtils.userCase(user.mainRole)=='student') {
    data.majorName=user.majorName
    data.clazzName=user.className
    data.grade=user.grade
    data.studentId=user.studentId
  } else {
    data.secondaryDeptName=user.secondaryDeptName
    data.jobId=user.jobId
  }

  return request({
    url: '/users',
    method: 'put',
    data
  })
}


