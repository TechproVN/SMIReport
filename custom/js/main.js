const APP_DOMAIN = 'http://115.79.27.219/';
const CENTER_POS_MAP_VIEW = [20.81715284, 106.77411238];
const TIME_OUT_SHOW_MAP_ON_MODAL = 0;

$('.datepicker').datepicker();

$('.datetimepicker').datetimepicker({
  format: 'yyyy-mm-dd hh:ii'
})

$('.datetimepicker-bootstrap4').datetimepicker({
  // format: 'LT'
   format: 'HH:mm'
});


$('.btnScrollTop').click(moveTop);

function formatToday() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  let mon = month < 10 ? `0${month}` : month;
  let d = day < 10 ? `0${day}` : day;
  
  return `${mon}/${d}/${year}`;
}

function changeFormatDateTime(time){
  let arr = time.split('/');
  let y = arr[2];
  let d = arr[1];
  let m = arr[0];
  return `${y}-${m}-${d}`;
}


function moveTop(){
  $('html, body').animate({'scrollTop': 0}, 300);
}


function checkDate(from, to){
  let valid = true;
  let msgErr = '';
  if(!Validation.checkEmpty(from)){
    valid = false;
    msgErr += 'Start date must be filled\n'
  }
  if(!Validation.checkEmpty(to)){
    valid = false;
    msgErr += 'End date must be filled\n'
  }
  if(!valid){
    showAlertError("Invalid data", msgErr, 3000);
  }
  return valid;
}


function getPageSize(l){
  if(l < 100) return 10;
  if(l < 250) return 20;
  if(l < 300) return 30;
  if(l < 400) return 40;
  else return 50;
}

function checkTimeStartVsTimeEnd(from, to){
  let fromDate = new Date(from).getTime();
  let toDate = new Date(to).getTime();
  if (fromDate >= toDate) return false;
  return true;
}