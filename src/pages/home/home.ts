import { Component, Inject } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';

import { LocalizationPage } from '../localization/localization';
import { WalletPage } from '../wallet/wallet';
import { ListaProdottiPage } from '../lista-prodotti/lista-prodotti';
import { UtilsProvider } from '../../providers/utils/utils';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username : string;

  constructor(
    private navCtrl: NavController,
    private cfg: ConfigProvider,
    private storage: StorageProvider,
    public utilsProvider: UtilsProvider
    ) {
    this.username = storage.get(cfg.config.AUTH_USERNAME) || "";

  }

  localize(){
    this.navCtrl.setRoot(LocalizationPage);
  }

  goToWallet(){
    this.navCtrl.setRoot(WalletPage);
  }

  goToProductList(){
    this.navCtrl.setRoot(ListaProdottiPage);
  }


}
