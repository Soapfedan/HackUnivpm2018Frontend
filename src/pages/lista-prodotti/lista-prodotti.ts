import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import _ from 'lodash';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { HomePage } from '../home/home';
import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'page-lista-prodotti',
  templateUrl: 'lista-prodotti.html',
})
export class ListaProdottiPage {

  products: Array<any> = [];
  total: number;

  wallet: any = {
    "credit": 0,
    "transaction": []
  };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewUtils: ViewUtilsProvider,
    public utilsProvider: UtilsProvider,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {

    this.getProductList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaProdottiPage');
  }

  getProductList(){
    let loading = this.loadingCtrl.create({ });
    loading.present();

    this.api.getWalletValues()
    .then( content => {
      this.total = _.get(content,"result.credit",0);
      console.log(this.total);
      return this.api.getProductList()
    })
    .then( e=> {
      let promises: Array<any> = [];
      this.products = _.get(e,"result");
      this.products.forEach( prod => {
        promises.push(this.api.getTrashDetail(_.get(prod,"waste_id")))
      });
      loading.dismiss();
      return Promise.all(promises);

    })
    .then( e => {
      console.log(e);
      this.products.forEach( (prod,i) =>{
        let el = _.get(e[i],"result[0].name","");
        console.log(el);
        _.set(prod,"wcn",el);
        /* prod.wcn = el; */
      })
      return this.api.getWalletValues()
     
    })
    .then( content => { 
      this.wallet = _.get(content,"result",this.wallet);
      console.log(content);
    })
    .catch( e => {
      console.log(e);
    })
  }

  canBuyIt(cost){
    let c = parseInt(cost)
    return this.total >= c;
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  buyProduct(id,cost){
    let loading = this.loadingCtrl.create({ });
    loading.present();

    this.api.buyProduct(id,cost)
    .then( e => {
      console.log(e);
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: "Messaggio",
        subTitle: "Acquisto eseguito!",
        buttons: ['Prosegui']
      });
      alert.present();

    })
    .catch( e => {
      console.log(e);
    })
  }

}
