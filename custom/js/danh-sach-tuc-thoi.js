$(async () => {

  $('#jstree_demo_div').jstree();

  $('#jstree_demo_div').on("changed.jstree", function (e, data) {
    console.log(data.selected);
  });

  $selectSuperDep.change(e => {
    showDepList(e);
    filterUserData(false);
  });

  $selectDep.change(() => {
    filterUserData(true);
  })

  $btnInDanhSachTrongToaNha.click(printUserList);

  showOnSiteList();

  await SelectComponent.renderSuperDepartment();
  SelectComponent.renderPosition();
  showDepListWhenLoad();

})

let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let $btnInDanhSachTrongToaNha = $('#btnInDanhSachTrongToaNha');
let arrOnSites = [];
let arrFilteredOnSites = [];

function showDepListWhenLoad(){
  let superDepID = $('#selectSuperDep').val();
  let sentData = { iSuperDepartmentID: superDepID };
  SelectComponent.renderDepartment(sentData);
}

function showDepList(e, className){
  let superDepID = e.target.value;
  let sentData = {iSuperDepartmentID: superDepID};
  SelectComponent.renderDepartment(sentData, className);
}

function filterUserData(filterByDepID){
  let depID = $selectDep.val();
  let superDepID = $selectSuperDep.val();
  if(filterByDepID) arrFilteredOnSites = FilterService.filterByUserDepID(arrOnSites, depID);
  else arrFilteredOnSites = FilterService.filterByUserSuperDepID(arrOnSites, superDepID);
  showPagination(arrFilteredOnSites);
}

function renderTblOnsiteList(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblOnsite"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Ho tên</th>
        <th class="trn">Mã nhân viên</th>
        <th class="trn">Chức vụ</th>
        <th class="trn">Phòng ban</th>
        <th class="trn">Vụ</th>
        <th class="trn">Bộ ĐK</th>
        <th class="trn">Thời gian</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((item, index) => {
      const { sDepartmentName, sFirstName, sIdNumber, sLastName, sLogicalCode, sPositionName, sSubDepartmentName, sSuperDepartmentName } = item;
      let fullname = sFirstName + ' ' + sLastName;
      $tbody.append(`
        <tr>
          <td>${fullname}</td>
          <td>${sIdNumber}</td>
          <td>${sPositionName}</td>
          <td>${sDepartmentName}</td>
          <td>${sSuperDepartmentName}</td>
          <td>${sSubDepartmentName}</td>
          <td></td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

async function showOnSiteList() {
  arrOnSites = await UserService.getOnSite();

  if (!arrOnSites) {
    AlertSẻvice.showAlertError("Không có dữ liệu", '', 4000);
    arrFilteredOnSites = arrOnSites.slice();
  }
  arrFilteredOnSites = [];
  showPagination(arrOnSites);
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
      let $table = renderTblOnsiteList(data);
      $('#onSiteListArea.table-responsive').html($table);
    }
  })
}

function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#onSiteListArea').html('');
}

function renderTblPrintOnsiteList(data){
  let $table = $(`#tblPrintUsers`);
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
    <tr>
      <th class="font-weight-bold">Họ tên</th>
      <th class="font-weight-bold">Mã nhân viên</th>
      <th class="font-weight-bold">Chức vụ</th>
      <th class="font-weight-bold">Phòng ban</th>
      <th class="font-weight-bold">Vụ</th>
      <th class="trn">Bộ ĐK</th>
    </tr>
    `
  )
  if (data) {
    data.forEach((item, index) => {
      const { sDepartmentName, sFirstName, sIdNumber, sLastName, sLogicalCode, sPositionName, sSubDepartmentName, sSuperDepartmentName } = item;
      let fullname = sFirstName + ' ' + sLastName;
      $tbody.append(`
        <tr>
          <td>${fullname}</td>
          <td>${sIdNumber}</td>
          <td>${sPositionName}</td>
          <td>${sDepartmentName}</td>
          <td>${sSuperDepartmentName}</td>
          <td>${sSubDepartmentName}</td>
          <td></td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
}

function printUserList(){
  renderTblPrintOnsiteList(arrFilteredOnSites);
  let $table = $('#tblPrintUsers');
  let filename = "danh-sach-tuc-thoi";
  Export2ExcelService.export2Excel($table, filename);
}
