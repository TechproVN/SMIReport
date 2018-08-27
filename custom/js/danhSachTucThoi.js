$(() => {
  showOnSiteList();
})

function resetTblChamCong() {
  $('#totalOnsite').html('');
  $('#pagingOnsiteControl').html('');
  $('#tblOnsite').find('tbody').html('');
}

function renderTblOnsiteList(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblOnsite"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">No.</th>
        <th class="trn">Mã Code</th>
        <th class="trn">Tên nhân viên</th>
        <th class="trn">Phòng ban</th>
        <th class="trn">Loại</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((item) => {
      const { sFullName, sDepartment, sType, sLogicalCode, iOnSiteID } = item;
      
      $tbody.append(`
        <tr>
          <td>${iOnSiteID}</td>
          <td>${sLogicalCode}</td>
          <td>${sFullName}</td>
          <td>${sDepartment}</td>
          <td>${sType}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

async function showOnSiteList() {
  //let date = $('#onSiteDate').val();
  //if(!Validation.checkEmpty(date)) return showAlertError("Invalid data!!", "You must choose date");
  //let Date = changeFormatDateTime(date);
  //let sentData = { Date };
  
  let data = await Service.getOnSiteList();
  console.log(data);

  if (data) {
    $('#totalOnsite').html(`<strong>Tổng số dòng:</strong> ${data.length}`)
    $('#pagingOnsiteControl').pagination({
      dataSource: data,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        // template method of yourself
        let $table = renderTblOnsiteList(data);
        $('.card-onsite .table-responsive').html($table);
      }
    })
  } else {
    resetTblChamCong();
    showAlertError("No data available", "", 3000);
  }
  
}