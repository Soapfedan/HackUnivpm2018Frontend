import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';
import { ToastOptions } from 'ionic-angular';

import _ from 'lodash';


@Injectable()
export class ViewUtilsProvider {

  
  constructor(
    private cfg : ConfigProvider
  ) {
    
  }


  showToast(toastCtrl, response_message:any, error:boolean = false) {
    let opts : ToastOptions = {
      message: response_message,
      duration: this.cfg.config.TIMER_TOAST
    };
    if (error == true) {
      opts.cssClass = this.cfg.config.CLASS_TOAST_ERROR;
    } else {
      opts.cssClass = this.cfg.config.CLASS_TOAST_SUCCESS;
    }
    let toast = toastCtrl.create(opts);
    toast.present();
  }


  showToastError(toastCtrl, response_message:any) {
    this.showToast(toastCtrl,response_message,true);
  }


  showErrorAlert(alertCtrl, title:string, text:string) {
    const alert = alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['Prosegui']
    });
    alert.present();
  }

  getPropertyOrDefault (obj, path, def="Non disponibile") {
    return _.get(obj, path, def);
  }


}
