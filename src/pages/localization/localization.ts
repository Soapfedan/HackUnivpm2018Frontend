import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import {Md5} from 'ts-md5/dist/md5';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { UtilsProvider } from '../../providers/utils/utils';

import _ from 'lodash';
import { HomePage } from '../home/home';
import { text } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'page-localization',
  templateUrl: 'localization.html',
})
export class LocalizationPage {

  flag: boolean = false;
  loading: boolean = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private viewUtils: ViewUtilsProvider,
    public utilsProvider: UtilsProvider,
    private alertCtrl: AlertController,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalizationPage');
    this.checkLink();
  }

  sendCode(){
    let loading = this.loadingCtrl.create({ });
    loading.present();

    let code = Md5.hashStr("trash");
    this.api.sendLocalizationCode(code)
    .then(e => {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: "Messaggio",
        subTitle: "Associazione eseguita!",
        buttons: [{text: 'Prosegui',handler: ()=> {this.navCtrl.setRoot(HomePage)}}]
      });
      alert.present();
    })
    .catch(e => console.log(e))
  }

  checkLink(){
    this.api.checkLocalization()
    .then( r => {
      this.flag = _.get(r,"result","0") == "0" ? false : true;
      this.loading = false;
    })
    .catch( e => {
      this.loading = false;
      console.log(e);
    })
  }

}
