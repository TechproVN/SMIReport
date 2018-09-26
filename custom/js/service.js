
class Service {

  static async getUsersDataAnother() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}SMIAPi/GetUserAnother.php`,
      method: 'post'
    });
    let parsedData = JSON.parse(data);
    if(!Array.isArray(parsedData)) return null;
    if(parsedData.length == 0) return null;
    return parsedData;
  }

  static async chamCong(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}SMIApi/ChamCong.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data);
    if(!Array.isArray(parsedData)) return null;
    if(parsedData.length == 0) return null;
    return parsedData;
  }
  
  // DanhSachOnSite.php
  static async getOnSiteList() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}SMIApi/DanhSachOnSite.php`,
      method: 'post'
    });
    let parsedData = JSON.parse(data);
    if(!Array.isArray(parsedData)) return null;
    if(parsedData.length == 0) return null;
    return parsedData;
  }

  
  
}