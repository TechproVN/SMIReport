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

  $txtEndTime.val('17:00');
  $txtStartTime.val('08:00');

  SelectComponent.renderMonths();
  await SelectComponent.renderSuperDepartment();
  SelectComponent.renderPosition();
  showDepListWhenLoad();

})

let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');
let $txtEndTime = $('#txtEndTime');
let $txtStartTime = $('#txtStartTime');
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
      let startStr = $txtStartTime.val();
      let endStr = $txtEndTime.val();
      $tbody.append(`
        <tr>
          <td rowspan="2">${index + 1}</td>
          <td rowspan="2">${sFullname}</td>
          <td>Đi trễ</td>
        </tr>
      `)
      arrInOut.forEach(item => {
        let val = '';
        if(item.dTimeIN)  {
          val = getTimeSpanString(item.dTimeIN, startStr);
          if(!val) val = item.dTimeIN;
        }
        $tbody.find('tr').last().append(`<td>${val}</td>`)
      })

      $tbody.append(`
        <tr>
          <td>Về sớm</td>
        </tr>
      `)
      arrInOut.forEach(item => {
        let val = '';
        if(item.dTimeOUT)  {
          val = getTimeSpanString(endStr, item.dTimeOUT);
          if(!val) val = item.dTimeOUT;
        }
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

function getTimeOfTimeStr(timeStr){
  let arr = timeStr.split(':');
  let hour = Number(arr[0].trim());
  let min = Number(arr[1].trim());
  let time = getTimeStamp(hour, min);
  return time;
}

function getTimeStamp(hour, min){
  return hour*3600 + min*60;
}

function getTimeSpanString(timeStr1, timeStr2){
  let stamp1 = getTimeOfTimeStr(timeStr1);
  let stamp2 = getTimeOfTimeStr(timeStr2);
  let span = stamp1 - stamp2;
  if(span <= 60) return null;
  return getTimeStringFromSeconds(span);
}

function getTimeStringFromSeconds(sec){
  if(sec < 60*60) return '00:' + sec/60;
  if(sec < 60*60*24) return Math.floor(sec/3600) + ':' + (sec%3600)/60;
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
  if(!ValidationService.checkPositiveNumber(iYear)) return AlertService.showAlertError('Năm không hợp lệ', '', 5000);
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

