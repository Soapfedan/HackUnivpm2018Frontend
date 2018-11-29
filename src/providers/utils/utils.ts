import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { LoginPage } from '../../pages/login/login';
import { Platform } from 'ionic-angular';

@Injectable()
export class UtilsProvider {

  constructor(public http: HttpClient,
              public platform: Platform
    ) {
    console.log('Hello UtilsProvider Provider');
  }


  setDateFormat(date:any, format:string = "MM/DD/YYYY"){
    return moment(date).format(format);
  }

  isDesktop(){
    return this.platform.is('core');
  }

  isMobile(){
    return this.platform.is('mobileweb') || this.platform.is('android') ||  this.platform.is('ios');
  }


  handle401 = (navCtrl) => (err) =>  {
    if (err.status == 401) {
      return navCtrl.setRoot(LoginPage);
    } else {
      throw err;
    }
  }

}
