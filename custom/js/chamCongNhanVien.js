$(() => {
  $('#btnShowChamCongTbl').click(showChamCong);
})

function resetTblChamCong() {
  $('#totalChamCong').html('');
  $('#pagingChamCongControl').html('');
  $('#tblChamCong').find('tbody').html('');
}

function renderTblChamCong(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblChamCong"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Bộ phận</th>
        <th class="trn">Tên</th>
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
      const { dDate, dTimeIN, TimeIN, dTimeOut, TimeOut, sDepartment, sFullName } = item;
      
      $tbody.append(`
        <tr>
          <td>${sDepartment}</td>
          <td>${sFullName}</td>
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

async function showChamCong() {
  let from = $('#fromDateTime').val();
  let to = $('#toDateTime').val();
  if(checkDate(from, to)){
    if(!checkTimeStartVsTimeEnd(from, to)) return showAlertError("Invalid data!!", "Start Date must sooner than End Date");
    let fromDate = changeFormatDateTime(from);
    let toDate = changeFormatDateTime(to);
    let sentData = {fromDate, toDate};
    
    let data = await Service.chamCong(sentData);
    console.log(data);

    if (data) {
      $('#totalChamCong').html(`<strong>Tổng số dòng:</strong> ${data.length}`)
      $('#pagingChamCongControl').pagination({
        dataSource: data,
        pageSize: 10,
        showGoInput: true,
        showGoButton: true,
        callback: function (data, pagination) {
          // template method of yourself
          let $table = renderTblChamCong(data);
          $('.card-chamCong .table-responsive').html($table);
        }
      })
    } else {
      resetTblChamCong();
      showAlertError("No data available", "", 3000);
    }
  }
}