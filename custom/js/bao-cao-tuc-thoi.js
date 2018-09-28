$(() => {
  $('#jstree_demo_div').jstree();

  $('#jstree_demo_div').on("changed.jstree", function (e, data) {
    console.log(data.selected);
  });

  
  $selectSuperDep.change(e => {
    showDepList(e);
  });
  SelectComponent.renderMonths();
  SelectComponent.renderSuperDepartment();
  showDepListWhenLoad();
})

let $selectSuperDep = $('#selectSuperDep');
let $selectDep = $('#selectDep');

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