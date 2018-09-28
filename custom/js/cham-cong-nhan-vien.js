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
  let $table = $(`<table class="table custom-table"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">STT</th>
        <th class="trn">Họ Tên</th>
        <th>Ra vào</th>
      </tr>
    `
  )
  let arrMonthHeaders = getDayInMonth();
  arrMonthHeaders.forEach(item => {
    $thead.find('tr').append(`<th>${item}</th>`);
  })

  if (data) {
    data.forEach((item, index) => {
      let user = JSON.parse(item.TimeAttendanceAll);

      let { sLogicalCode, sFullname, Attendance } = user;
      let arrInOut = getInOutArr(Attendance);

      $tbody.append(`
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${sFullname}</td>
          <td>Ra</td>
        </tr>
      `)
      arrInOut.forEach(item => {
        let val = item.dTimeIN;
        if(!val) val = '';
        $tbody.find('tr').last().append(`<td>${val}</td>`)
      })

      $tbody.append(`
        <tr>
          <td>Vào</td>
        </tr>
      `)
      arrInOut.forEach(item => {
        let val = item.dTimeOUT;
        if(!val) val = '';
        $tbody.find('tr').last().append(`<td>${val}</td>`)
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function getInOutArr(data){
  let arrTemp = [];
  for(let i = 1; i <= 31; i++){
    arrTemp.push({});
  }
  data.forEach(item => {
    let { dTimeIN, dTimeOUT, dDate } = item;
    arrTemp[Number(dDate) - 1] = { dTimeIN, dTimeOUT };
  });
  return arrTemp;
}

function getDayInMonth(){
  let arr = [];
  for(let i = 1; i <= 31; i++){
    arr.push(i);
  }
  return arr;
  
}

async function showAttendance() {
  let iMonth = $('#selectMonth').val();
  let iYear = $('#txtYear').val();
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
      $('#chamCongArea.table-responsive').html($table);
    }
  })
}

function clearPagination(){
  $('#pagingTotal').html('');
  $('#pagingControl').html('');
  $('#attendanceDataArea').html('');
}

