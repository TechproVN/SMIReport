$(async () => {

  $('#jstree_demo_div').jstree();

  $('#jstree_demo_div').on("changed.jstree", function (e, data) {
    console.log(data.selected);
  });

  $('#btnViewAttendance').click(showAttendance);
  
  $selectSuperDep.change(e => {
    showDepList(e);
    setTimeout(() => {
      filterUserData();
    }, 200);
  });
  SelectComponent.renderMonths();
  await SelectComponent.renderSuperDepartment();
  SelectComponent.renderPosition();
  showDepListWhenLoad();

})

let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let arrOnSites = [];

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

function renderTblAttendance(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Tên</th>
        <th class="trn">Ngày</th>
        <th class="trn">Tháng</th>
        <th class="trn">Giờ vào </th>
        <th class="trn">Đi trễ (ph)</th>
        <th class="trn">Giờ ra </th>
        <th class="trn">Về sớm (ph)</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((item) => {
      const { dDay, dMonth, TimeIN, TimeOut, sFirstName, sLastName, sIdNumber } = item;
      let fullname = sFirstName + ' ' + sLastName;
      
      $tbody.append(`
        <tr>
          <td>${fullname}</td>
          <td>${dDay}</td>
          <td>${dTimeIN}</td>
          <td>${TimeIN}</td>
          <td>${TimeOut}</td>
          <td>${TimeIN}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

async function showAttendance() {
  let iMonth = $('#selectMonth').val();
  let iYear = $('#txtYear').val();
  console.log(iYear);
  if(!ValidationService.checkPositiveNumber(iYear)) return AlertService.showAlertSuccess('Năm không hợp lệ', '', 5000);
  let sentData = { iMonth, iYear };
  arrOnSites = await UserService.getAttendance(sentData);
  console.log(arrOnSites);
  if(!arrOnSites) AlertService.showAlertError('Không có dữ liệu', '', 4000);
  showPagination(arrOnSites);
}

function showPagination(data){
  if(!data) return clearPagination();
  $('#pagingTotal').html(`<strong>Tổng số dòng:</strong> ${data.length}`)
  $('#pagingControl').pagination({
    dataSource: data,
    pageSize: 10,
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderTblAttendance(data);
      $('.card-chamCong .table-responsive').html($table);
    }
  })
}

function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#attendanceDataArea').html('');
}

