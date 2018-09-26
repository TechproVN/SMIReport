
$(async () => {

  $('#jstree_demo_div').jstree();

  $('#jstree_demo_div').on("changed.jstree", function (e, data) {
    console.log(data.selected);
  });

  $('#selectSuperDep').change(e => {
    showDepList(e);
  });

  $('#selectSuperDepUpdate').change((e) => {
    showDepList(e, 'selectDepUpdate');
  });

  arrSuperDep = await SelectComponent.renderSuperDepartment();
  showDepListWhenLoad();
  arrPos = await SelectComponent.renderPosition();
  
  showEmployeesListTable();

})

let arrSuperDep = [];
let arrDep = [];
let arrPos = [];
let currentUser = null;

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

function renderUsersTbl(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblOnsite"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th>STT</th>
      <th>Họ Tên</th>
      <th>Mã nhân viên</th>
      <th>Chức vụ</th>
      <th>Phòng ban</th>
      <th>Vụ</th>
      <th></th>
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
          <td>${fullname}</td>
          <td>${sIdNumber}</td>
          <td>${sPositionName}</td>
          <td>${sDepartmentName}</td>
          <td>${sSuperDepartmentName}</td>
          <td>
            <button class="btn btn-custom btn-success btn-view-inout" style="margin: 0">Xem ra vào</button>
            <button class="btn btn-custom btn-warning btn-update" style="margin: 0">Cập nhật</button>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btn-update').last().click(() => {
        showUpdateModalUser(user);
      })
      $tbody.find('.btn.btn-view-inout').last().click(() => {
        
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
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
  $('#txtLastNameUpdateUser').val(sLastName);
  $('#selectPosUpdate').val(iPositionID);
  $('#selectDepUpdate').val(iDepartmentID);
  $('#selectSuperDepUpdate').val(iSuperDepartmentID);
}

function clearFormUser(){

}

async function showEmployeesListTable(){
  let arrUsers = await UserService.getUsersData();
  // console.log(arrUsers);
  if(!arrUsers) {
    AlertService.showAlertError('No data available!', '', 4000);
    clearPagination();
  }else showPagination(arrUsers);
}

function showPagination(data){
  $('#pagingTotal').html(`<strong>Tổng số nhân viên:</strong> ${data.length}`)
  $('#pagingControl').pagination({
    dataSource: data,
    pageSize: 10,
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      // template method of yourself
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