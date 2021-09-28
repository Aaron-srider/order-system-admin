

class User{

  constructor(src) {
    const basicInfo = src.result;
    const detailInfo = src.detailInfo;

    this.id = basicInfo.id;
    this.name = basicInfo.name;
    this.roleList = detailInfo.roleList;
    this.isLock = basicInfo.isLock;
    this.mainRole = User.pickMainUserRole(this.roleList);

    if (detailInfo.college) {
      this.collegeId = detailInfo.college.id;
    }
    if (detailInfo.major) {
      this.majorId = detailInfo.major.id;
    }
    if (basicInfo["clazzName"]) {
      this.clazzName = basicInfo["clazzName"]
    }
    if (detailInfo.secondaryDept) {
      this.secondaryDeptId = detailInfo.secondaryDept.id;
    }
    if (basicInfo.grade) {
      this.grade = basicInfo.grade;
    }
    if (basicInfo.studentId) {
      this.studentId = basicInfo.studentId;
    }
    if (basicInfo.jobId) {
      this.jobId = basicInfo.jobId;
    }
  }

  static userCase(role) {
    return User.roleMap(role.name);
  }

  static roleMap(roleName) {
    let roleMap = {
      ADMIN: "teacher",
      OPERATOR: "teacher",
      COLLEGE_LEVEL_LEADER: "teacher",
      DEPT_LEVEL_LEADER: "teacher",
      TEACHER: "teacher",
      UNDERGRADUATE: "student",
      POSTGRADUATE: "student"
    };
    return roleMap[roleName]
  }



  static pickMainUserRole(roleList) {
    const filteredList = roleList.filter(item => item.id !== 1 && item.id !== 2);
    return filteredList[0];
  }
}
