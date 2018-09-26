let $sidenav = $('.side-nav');
let $mainContent = $('.main-content');
$('.side-nav .cog').click(toggleSidenav);

function toggleSidenav(e){
  let position = $sidenav.css('position');
  if(position == 'fixed'){
    let left = $sidenav.css('left');
    if(left == '0px') $sidenav.css({left: '-260px'});
    else $sidenav.css({left: '0px'});
    // console.log(left);
  }else{
    let marginLeft = $sidenav.css('marginLeft');
    if(marginLeft == '0px') {
      $sidenav.css({marginLeft: '-260px'});
      $mainContent.css({width: 'calc(100% - 40px)'});
    }else {
      $sidenav.css({marginLeft: '0px'});
      $mainContent.css({width: 'calc(100% - 300px)'});
    }
  }
  
}