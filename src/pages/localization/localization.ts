import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'page-localization',
  templateUrl: 'localization.html',
})
export class LocalizationPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalizationPage');
  }

  sendCode(){
    let code = Md5.hashStr("trash");
    this.api.sendLocalizationCode(code);
  }

}
