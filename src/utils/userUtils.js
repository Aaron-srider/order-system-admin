export function pickMainUserRole(roleList) {
  const filteredList = roleList.filter((item) => item.id != 1 && item.id != 2)
  return filteredList[0]
}

export function userCase(role) {
  console.log(roleMap)
  console.log(role.name)
  return roleMap[role.name]
}

export const roleList = ['ADMIN', 'OPERATOR', 'COLLEGE_LEVEL_LEADER', 'DEPT_LEVEL_LEADER', 'TEACHER', 'UNDERGRADRUATE', 'POSTGRADUATE']

export const roleMap = {
  'ADMIN': "teacher",
  'OPERATOR': "teacher",
  'COLLEGE_LEVEL_LEADER': "teacher",
  'DEPT_LEVEL_LEADER': "teacher",
  'TEACHER': "teacher",
  'UNDERGRADUATE': "student",
  'POSTGRADUATE': "student",
}

export const gradeMap = ["", "大一", "大二", "大三", "大四", "研一", "研二", "研三"]

export function userGradeMap(grade) {
  return gradeMap[grade]
}
