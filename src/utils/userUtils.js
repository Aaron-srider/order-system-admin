function User() {
  this.id = undefined
  this.name = undefined
  this.collegeId = undefined
  this.majorId = undefined
  this.clazzName = undefined
  this.secondaryDeptId = undefined
  this.grade = undefined
  this.studentJobId = undefined
  this.roleList = []
  this.isLock = undefined
  this.mainRoleId = undefined
}

User.prototype = {
  constructor: User,
  roleMap_id_case: [
    "",
    "admin",
    "",
    "teacher",
    "teacher",
    "teacher",
    "student",
    "student"
  ],
  isAdmin() {
    if (this.roleList) {
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleMap_id_case[this.roleList[i].id] == "admin") {
          return true
        }
      }
    }
    return false
  }
}


function UserForQuery() {
  this.id = undefined
  this.studentJobId = undefined
  this.majorName = undefined
  this.className = undefined
  this.secondaryDeptName = undefined
  this.roleCategory = undefined
}

UserForQuery.prototype = {
  constructor: UserForQuery
}

export {User, UserForQuery}


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
export function handleUser(userFromServer) {
  let user = new User()
  user.id = userFromServer.id;
  user.name = userFromServer.name;
  user.collegeId = userFromServer.college.id;
  if (userFromServer.major) {
    user.majorId = userFromServer.major.id;
  }
  if (userFromServer["clazzName"]) {
    user.clazzName = userFromServer["clazzName"]
  }
  if (userFromServer.secondaryDept) {
    user.secondaryDeptId = userFromServer.secondaryDept.id;
  }
  if (userFromServer.grade) {
    user.grade = userFromServer.grade;
  }
  user.studentJobId = userFromServer.studentJobId;
  user.roleList = userFromServer.roleList;
  user.isLock = userFromServer.isLock;
  user.mainRoleId = pickMainUserRole(user.roleList);
  return user
}

export function afterUpdateUserRole(row) {
  const index = row.roleList.findIndex((item) => item.id != 1 && item.id != 2)
  row.roleList[index].id = row.mainRoleId
}

export function isAdmin(roleId) {
  return roleMap_id_case[roleId]
}
