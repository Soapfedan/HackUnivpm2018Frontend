import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import {Md5} from 'ts-md5/dist/md5';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';

@Component({
  selector: 'page-localization',
  templateUrl: 'localization.html',
})
export class LocalizationPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private viewUtils: ViewUtilsProvider,
    private alertCtrl: AlertController,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalizationPage');
  }

  sendCode(){
    let loading = this.loadingCtrl.create({ });
    loading.present();

    let code = Md5.hashStr("trash");
    this.api.sendLocalizationCode(code)
    .then(e => {
      loading.dismiss();
      this.viewUtils.showErrorAlert(this.alertCtrl,"Messaggio","Associazione eseguita!")

      console.log(e);
    })
    .catch(e => console.log(e))
  }

}
