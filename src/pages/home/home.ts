import { Component, Inject, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingController, Content, NavParams } from 'ionic-angular';
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
import { TransactionComponent } from '../../components/transaction/transaction';
import { RecTransactionComponent } from '../../components/rec-transaction/rec-transaction';
import { UpTransactionComponent } from '../../components/up-transaction/up-transaction';


enum SectionHome {
  PUBLIC = "all",
  REC = "recycle",
  UP = "upcycle"
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content; // per scroll

  username : string;
  products: Array<any> = [];
  total: number;
  section: string ="all";

  publicDone:boolean = false;
  upDone:boolean = false;
  recDone:boolean = false;
  enterDone: boolean = false; // true se ha fatto il primo caricamento (willEnter)

  transactions: Array<any> = [];

  wallet: any = {
    "credit": 0,
    "transaction": []
  };

  upwallet: any = {
    "credit": 0,
    "transaction": []
  };

  recwallet: any = {
    "credit": 0,
    "transaction": []
  };

  constructor(
    private navCtrl: NavController,
    private cfg: ConfigProvider,
    private storage: StorageProvider,    
    private loadingCtrl: LoadingController,
    public navParams: NavParams,
    public utilsProvider: UtilsProvider,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {
    this.username = storage.get(cfg.config.AUTH_USERNAME) || "";

    this.loadData();
  
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


loadData(){
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

      let transactions: Array<any> = _.get(this.wallet,"transaction",[]);
      transactions.forEach( (prod,i) =>{
        let el = _.get(e[i],"result[0].name","");
        console.log(el);
        _.set(prod,"wcn",el);
        /* prod.wcn = el; */
      })  
      transactions.filter( t => {
        return t.trash_token == null;
      })

      let uptrans =  transactions.filter( t => {
        return t.trash_token == null;
      })

      let rectrans =  transactions.filter( t => {
        return t.trash_token != null;
      })

      _.set(this.wallet,"transaction",transactions);
      console.log(this.wallet);
      _.set(this.upwallet,"transaction",uptrans);
      console.log(this.upwallet);
      _.set(this.recwallet,"transaction",rectrans);
      console.log(this.recwallet);
      loading.dismiss();
    })
    .catch(e => console.log(e))
}


}
