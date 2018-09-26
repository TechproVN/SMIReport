class UserService{

  static async getUsersData() {
    let url = `${APP_DOMAIN}SMIApi/GetUser.php`;
    let method = 'post';
    let data = null;
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getUserInOut(sentData) {
    let url = `${APP_DOMAIN}SMIApi/GetUserInOut.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getOnSite() {
    let url = `${APP_DOMAIN}SMIApi/OnSite.php`;
    let method = 'post';
    let data = null;
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

  static async getAttendance(sentData) {
    let url = `${APP_DOMAIN}SMIApi/GetAttendance.php`;
    let method = 'post';
    let data = JSON.stringify(sentData);
    try {
      let res = await $.ajax({ url, method, data });
      return CommonService.handleData(res);
    } catch (error) {
      return CommonService.handleError(error);
    }
  }

}