import request from '@/utils/request'

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
  return request({
    url: '/users',
    params: {
      size: page.size,
      current: page.current,

      name: user.name,
      majorName: user.majorName,
      className: user.className,
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
