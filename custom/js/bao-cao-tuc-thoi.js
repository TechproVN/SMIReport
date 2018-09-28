$(() => {
  $('#jstree_demo_div').jstree();

  $('#jstree_demo_div').on("changed.jstree", function (e, data) {
    console.log(data.selected);
  });

  $btnVIewOnsiteReportData.click(showOnSiteReport);

  $selectSuperDep.change(e => {
    showDepList(e);
  });
  SelectComponent.renderMonths();
  SelectComponent.renderSuperDepartment();
  showDepListWhenLoad();
})

let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let $txtCheckDate = $('#txtCheckDate');
let $btnVIewOnsiteReportData = $('#btnVIewOnsiteReportData');
let arrOnsiteReportData = [];
let arrFilteredOnsiteReportData = [];


function filterData(){
  
}

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

async function showOnSiteReport(){
  let date = $txtCheckDate.val();
  if(date == '' || date == undefined) return AlertService.showAlertError('Ngày kiểm tra không họp lệ', 'Vui lòng nhập lại ngày kiểm tra');
  let dDate = TimeService.changeFormatDateTime(date);
  let sentData = { dDate };
  arrOnsiteReportData = await UserService.getOnSiteDate(sentData);
  if(!arrOnsiteReportData) AlertService.showAlertError('Không có dữ liệu', '', 5000);
  console.log(arrOnsiteReportData);
  showPagination(arrOnsiteReportData);
}

function renderOnsiteReport(data){
  let $table = $(`<table class="table custom-table"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">STT</th>
        <th class="trn">Họ Tên</th>
        <th>Mã nhân viên</th>
        <th>Vị trí</th>
        <th>Phòng ban</th>
        <th>Vụ</th>
        <th></th>
      </tr>
    `
  )

  if (data) {
    data.forEach((item, index) => {
      let { sDepartmentName, sFirstName, sLastName, sPositionName, sSubDepartmentName, sSuperDepartmentName, sIdNumber } = item;
      let sFullname = sFirstName + ' ' + sLastName;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sFullname}</td>
          <td>${sIdNumber}</td>
          <td>${sPositionName}</td>
          <td>${sDepartmentName}</td>
          <td>${sSuperDepartmentName}</td>
          <td>${sSubDepartmentName}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
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
      let $table = renderOnsiteReport(data);
      $('#ÓniteReportDataArea.table-responsive').html($table);
    }
  })
}

function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#ÓniteReportDataArea').html('');
}