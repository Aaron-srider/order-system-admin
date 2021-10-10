export function pickMainUserRole(roleList) {
  const filteredList = roleList.filter(item => item.id !== 1 && item.id !== 2);
  return filteredList[0].id;
}

/*export function userCase_name_case(role) {
  return roleMap_name_case[role.name];
}*/

export function userCase_id_case(roleId) {
  return roleMap_id_case[roleId];
}


export const roleList = [
  "ADMIN",
  "OPERATOR",
  "COLLEGE_LEVEL_LEADER",
  "DEPT_LEVEL_LEADER",
  "TEACHER",
  "UNDERGRADRUATE",
  "POSTGRADUATE"
];

const roleMap_name_case = {
  ADMIN: "teacher",
  OPERATOR: "teacher",
  COLLEGE_LEVEL_LEADER: "teacher",
  DEPT_LEVEL_LEADER: "teacher",
  TEACHER: "teacher",
  UNDERGRADUATE: "student",
  POSTGRADUATE: "student"
};

const roleMap_id_case = [
  "",
  "admin",
  "",
  "teacher",
  "teacher",
  "teacher",
  "student",
  "student"
]

export const gradeMap = [
  "",
  "大一",
  "大二",
  "大三",
  "大四",
  "研一",
  "研二",
  "研三"
];

export function userGradeMap(grade) {
  return gradeMap[grade];
}

/**
 * 传入后端发送过来的user数据结构，将其按照下述规则映射到前端数据结构
 * @param userFromServer
 * @param user
 */
export function handleUser(userFromServer, user) {
  const basicInfo = userFromServer.result;
  const detailInfo = userFromServer.detailInfo;
  user.id = basicInfo.id;
  user.name = basicInfo.name;
  if (detailInfo.college) {
    user.collegeName = detailInfo.college.name;
    user.collegeId = detailInfo.college.id;
  }
  if (detailInfo.major) {
    user.majorName = detailInfo.major.name;
    user.majorId = detailInfo.major.id;
  }
  if (basicInfo["clazzName"]) {
    user.clazzName = basicInfo["clazzName"]
  }
  if (detailInfo.secondaryDept) {
    user.secondaryDeptName = detailInfo.secondaryDept.name;
    user.secondaryDeptId = detailInfo.secondaryDept.id;
  }
  if (basicInfo.grade) {
    user.grade = basicInfo.grade;
  }
  if (basicInfo.studentId) {
    user.studentId = basicInfo.studentId;
  }
  if (basicInfo.jobId) {
    user.jobId = basicInfo.jobId;
  }
  user.roleList = detailInfo.roleList;
  user.isLock = basicInfo.isLock;
  user.mainRoleId = pickMainUserRole(user.roleList);
}

export function afterUpdateUserRole(row) {
  const index = row.roleList.findIndex((item) => item.id!=1 && item.id!=2)
  row.roleList[index].id=row.mainRoleId
}

export function isAdmin(roleId) {
  return roleMap_id_case[roleId]
}
