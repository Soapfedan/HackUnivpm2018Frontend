import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { LoginPage } from '../../pages/login/login';

@Injectable()
export class UtilsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UtilsProvider Provider');
  }


  setDateFormat(date:any, format:string = "MM/DD/YYYY"){
    return moment(date).format(format);
  }


  handle401 = (navCtrl) => (err) =>  {
    if (err.status == 401) {
      return navCtrl.setRoot(LoginPage);
    } else {
      throw err;
    }
  }

}
