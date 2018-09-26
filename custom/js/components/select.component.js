class SelectComponent{

  static async renderSuperDepartment(className, all){
    if(!className) className = 'selectSuperDep';
    let $ele = $(`.${className}`);
    $ele.html('');
    let arr = await SuperDepartmentService.getSuperDepartment();
    if(!arr) return;
    if(all) $ele.append(`<option value="0">All</option>`);
    arr.forEach(item => {
      let { iSuperDepartmentID, sSuperDepartmentName } = item;
      $ele.append(`<option value="${iSuperDepartmentID}">${sSuperDepartmentName}</option>`);
    })
    return arr;
  }

  static async renderDepartment(sentData, className, all){
    if(!className) className = 'selectDep';
    let $ele = $(`.${className}`);
    $ele.html('');
    let arr = await DepartmentService.getDepartment(sentData);
    if(!arr) return;
    if(all) $ele.append(`<option value="0">All</option>`);
    arr.forEach(item => {
      let { iDepartmentID, sDepartmentName } = item;
      $ele.append(`<option value="${iDepartmentID}">${sDepartmentName}</option>`);
    })
    return arr;
  }

  static async renderPosition(className, all){
    if(!className) className = 'selectPos';
    let $ele = $(`.${className}`);
    $ele.html('');
    let arr = await PositionService.getPosition();
    if(!arr) return;
    if(all) $ele.append(`<option value="0">All</option>`);
    arr.forEach(item => {
      let { iPositionID, sPositionName } = item;
      $ele.append(`<option value="${iPositionID}">${sPositionName}</option>`);
    })
    return arr;
  }

}