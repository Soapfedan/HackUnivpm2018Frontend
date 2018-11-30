import { Component, Inject } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';

import { LocalizationPage } from '../localization/localization';
import { WalletPage } from '../wallet/wallet';
import { ListaProdottiPage } from '../lista-prodotti/lista-prodotti';
import { UtilsProvider } from '../../providers/utils/utils';

import _ from 'lodash';
import { DettaglioProdottoPage } from '../dettaglio-prodotto/dettaglio-prodotto';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username : string;
  products: Array<any> = [];
  total: number;

  wallet: any = {
    "credit": 0,
    "transaction": []
  };

  constructor(
    private navCtrl: NavController,
    private cfg: ConfigProvider,
    private storage: StorageProvider,    
    private loadingCtrl: LoadingController,
    public utilsProvider: UtilsProvider,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {
    this.username = storage.get(cfg.config.AUTH_USERNAME) || "";
    let loading = this.loadingCtrl.create({ });
    loading.present();

    this.api.getWalletValues()
      .then( content => { 
        this.wallet = _.get(content,"result",this.wallet);
        let promises: Array<any> = [];
        let transactions: Array<any> = _.get(this.wallet,"transaction",[]);
        transactions.forEach( t => {
          if(_.isEmpty(t.trash_token)){
            promises.push(this.api.getProductDetail(_.get(t,"product_id")));
          }else{
            promises.push(this.api.getTrashDetail(_.get(t,"product_id")));
          }
        })

        
        /* loading.dismiss(); */
        console.log(content);
        return Promise.all(promises);
      })
      .then( e => {
        console.log(e);
        let transactions: Array<any> = _.get(this.wallet,"transaction",[]);
        transactions.forEach( (prod,i) =>{
          let el = _.get(e[i],"result[0].name","");
          console.log(el);
          _.set(prod,"wcn",el);
          /* prod.wcn = el; */
        }) 
        _.set(this.wallet,"transactions",transactions);      
        loading.dismiss();
      })
      .catch(e => console.log(e))
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

  goToDetail(id,isTrash){
    this.navCtrl.push(DettaglioProdottoPage, { "id": id, "isTrash": isTrash });
  }

  goToLink(){
    this.navCtrl.setRoot(LocalizationPage);
  }



}
