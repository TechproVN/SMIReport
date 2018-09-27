class FilterService{

  static filterByUserName(arr, filterVal){
    if(!ValidationService.checkNotEmpty(filterVal)) return arr;
    return arr.filter(user => {
      let {sLastName, sFirstName} = user;
      let fullname = sFirstName + ' ' + sLastName;
      fullname = CommonService.removeUnicode(fullname).toLowerCase();
      filterVal = CommonService.removeUnicode(filterVal).toLowerCase();
      return fullname.indexOf(filterVal) > -1;
    })
  }
  
  static filterByUserID(arr, filterVal){
    if(!ValidationService.checkNotEmpty(filterVal)) return arr;
    return arr.filter(user => {
      let { sIdNumber } = user;
      sIdNumber = (sIdNumber+'').toLowerCase();
      filterVal = CommonService.removeUnicode(filterVal).toLowerCase();
      return sIdNumber.indexOf(filterVal) > -1;
    })
  }
  
  static filterByUserDepID(arr, depID){
    return arr.filter(user => {
      let { iDepartmentID } = user;
      return depID == iDepartmentID;
    })
  }

  static filterByUserSuperDepID(arr, superDepID){
    return arr.filter(user => {
      let { iSuperDepartmentID } = user;
      return superDepID == iSuperDepartmentID;
    })
  }

}