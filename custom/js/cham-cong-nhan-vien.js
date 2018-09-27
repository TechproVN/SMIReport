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
        <th class="trn">Chức vụ</th>
        <th class="trn">Phòng ban</th>
        <th class="trn">Vụ</th>
        <th class="trn">Ngày</th>
        <th class="trn">Giờ vào </th>
        <th class="trn">Đi trễ (ph)</th>
        <th class="trn">Giờ ra </th>
        <th class="trn">Về sớm (ph)</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((item) => {
      const { dDate, dTimeIN, TimeIN, dTimeOut, TimeOut, sFirstName, sLastName, sDepartmentName, sPositionName, sSubDepartmentName, sSuperDepartmentName } = item;
      let fullname = sFirstName + ' ' + sLastName;
      
      $tbody.append(`
        <tr>
          <td>${fullname}</td>
          <td>${sPositionName}</td>
          <td>${sDepartmentName}</td>
          <td>${sSuperDepartmentName}</td>
          <td>${dDate}</td>
          <td>${dTimeIN}</td>
          <td>${TimeIN}</td>
          <td>${dTimeOut}</td>
          <td>${TimeOut}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

async function showAttendance() {
  let from = $('#fromDateTime').val();
  let to = $('#toDateTime').val();
  let { valid, msgErr } = ValidationService.checkDate(from, to);
  if(!valid) return AlertService.showAlertError('', msgErr, 5000);
  if(!ValidationService.checkTimeStartVsTimeEnd(from, to)) return AlertService.showAlertError("Ngày không họp lệ!!", "Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
  let fromDate = TimeService.changeFormatDateTime(from);
  let toDate = TimeService.changeFormatDateTime(to);
  let sentData = {fromDate, toDate};
  
  let data = await UserService.getAttendance(sentData);
  console.log(data);
  if(!data) AlertService.showAlertError('Không có dữ liệu', '', 4000);
  showPagination(data);
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

