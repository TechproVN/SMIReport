
$(async () => {

  $('#jstree_demo_div').jstree();

  $('#jstree_demo_div').on("changed.jstree", function (e, data) {
    console.log(data.selected);
  });

  $selectSuperDep.change(e => {
    showDepList(e);
    setTimeout(() => {
      filterUserData();
    }, 200);
  });

  $('#selectSuperDepUpdate').change((e) => {
    showDepList(e, 'selectDepUpdate');
  });

  $txtFilterUserName.on('input', filterUserData);
  $txtFilterUserID.on('input', filterUserData);
  $selectDep.change(filterUserData);

  await SelectComponent.renderSuperDepartment();
  SelectComponent.renderPosition();
  showDepListWhenLoad();
  
  showEmployeesListTable();

})

let arrSuperDep = [];
let arrDep = [];
let arrPos = [];
let arrUsers = [];
let currentUser = null;

let $txtFilterUserName = $('#txtFilterUserName');
let $txtFilterUserID = $('#txtFilterUserID');
let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let $tblInOutList = $('#tblInOutList');
let $modalInOutList = $('#modalInOutList');

function showDepList(e, className){
  let superDepID = e.target.value;
  let sentData = {iSuperDepartmentID: superDepID};
  SelectComponent.renderDepartment(sentData, className);
}

function showDepListWhenLoad(){
  let superDepID = $('#selectSuperDep').val();
  let sentData = {iSuperDepartmentID: superDepID};
  SelectComponent.renderDepartment(sentData);
}

function showUpdateModalUser(user){
  console.log(user);
  fillFormUser(user);
  currentUser = user;
  $('#modalUpdateUser').modal('show');
}

function fillFormUser(user){
  let { sFirstName, sLastName, iSuperDepartmentID, iDepartmentID, iPositionID } = user;
  $('#txtFirstNameUpdateUser').val(sFirstName);
  $('#txLastNameUpdateUser').val(sLastName);
  $('#selectPosUpdate').val(iPositionID);
  $('#selectDepUpdate').val(iDepartmentID);
  $('#selectSuperDepUpdate').val(iSuperDepartmentID);
}

function filterUserData(){
  let name = $txtFilterUserName.val();
  let id = $txtFilterUserID.val();
  let depID = $selectDep.val();
  let arr1 = filterByUserDepID(arrUsers, depID);
  let arr2 = filterByUserID(arr1, id);
  let arr3 = filterByUserName(arr2, name);
  showPagination(arr3);
}

function filterByUserName(arr, filterVal){
  if(!ValidationService.checkNotEmpty(filterVal)) return arr;
  return arr.filter(user => {
    let {sLastName, sFirstName} = user;
    let fullname = sFirstName + ' ' + sLastName;
    fullname = CommonService.removeUnicode(fullname).toLowerCase();
    filterVal = CommonService.removeUnicode(filterVal).toLowerCase();
    return fullname.indexOf(filterVal) > -1;
  })
}

function filterByUserID(arr, filterVal){
  if(!ValidationService.checkNotEmpty(filterVal)) return arr;
  return arr.filter(user => {
    let { sIdNumber } = user;
    sIdNumber = (sIdNumber+'').toLowerCase();
    filterVal = CommonService.removeUnicode(filterVal).toLowerCase();
    return sIdNumber.indexOf(filterVal) > -1;
  })
}

function filterByUserDepID(arr, depID){
  return arr.filter(user => {
    let { iDepartmentID } = user;
    return depID == iDepartmentID;
  })
}

async function showInOutModal(user){
  let { sLogicalCode } = user;
  let sentData = { sLogicalCode };
  let arrInOutList = await UserService.getUserInOut(sentData);
  if(!arrInOutList) return AlertService.showAlertError('Không có dữ liệu', '', 5000);
  renderTblInOutList(arrInOutList);
  $modalInOutList.modal('show');

}

function renderTblInOutList(data){
  $tblInOutList.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th>STT</th>
      <th>Họ tên</th>
      <th>Thời gian ra vào</th>
      <th>SMI</th>
    </tr>
    `
  )
  if(data){
    data.forEach((item, index) => {
      let { DateTimeInOut, RefLecteur, SMI, sFirstName } = item;
      let fullname = sFirstName + ' ' + RefLecteur;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${fullname}</td>
          <td>${DateTimeInOut}</td>
          <td>${SMI}</td>
        </tr>
      `)
    })
  }
  $tblInOutList.append($thead).append($tbody);
}

async function showEmployeesListTable(){
  arrUsers = await UserService.getUsersData();
  if(!arrUsers) AlertService.showAlertError('Không có dữ liệu', '', 4000);
  showPagination(arrUsers);
}

function renderUsersTbl(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblUsers"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th class="font-weight-bold">STT</th>
      <th class="font-weight-bold">Mã nhân viên</th>
      <th class="font-weight-bold">Họ và tên</th>
      <th class="font-weight-bold">Vụ</th>
      <th class="font-weight-bold">Phòng ban</th>
      <th class="font-weight-bold">Chức vụ</th>
      <th class="font-weight-bold"></th>
    </tr>
    `
  )
  if (data) {
    data.forEach((user, index) => {
      const { sLastName, sFirstName, sIdNumber, sPositionName, sDepartmentName, sSuperDepartmentName, sSubDepartmentName } = user;
      let fullname = sFirstName + ' ' + sLastName;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sIdNumber}</td>
          <td>${fullname}</td>
          <td>${sSuperDepartmentName}</td>
          <td>${sDepartmentName}</td>
          <td>${sPositionName}</td>
          <td>
            <button class="btn btn-custom btn-success btn-view-inout" style="margin: 0; text-transform: capitalize;">Xem ra vào</button>
            <button class="btn btn-custom btn-warning btn-update" style="margin: 0; text-transform: capitalize;">Cập nhật</button>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btn-update').last().click(() => {
        showUpdateModalUser(user);
      })
      $tbody.find('.btn.btn-view-inout').last().click(() => {
        showInOutModal(user);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showPagination(data){
  if(!data) return clearPagination();
  $('#pagingTotal').html(`<strong>Tổng số nhân viên:</strong> ${data.length}`)
  $('#pagingControl').pagination({
    dataSource: data,
    pageSize: 10,
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderUsersTbl(data);
      $('#usersListArea.table-responsive').html($table);
    }
  })
}

function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#usersListArea').html('');
}