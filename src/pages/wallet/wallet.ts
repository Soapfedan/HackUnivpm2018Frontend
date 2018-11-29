import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import _ from 'lodash';
import { DettaglioProdottoPage } from '../dettaglio-prodotto/dettaglio-prodotto';

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  wallet: any = {
    "credit": 0,
    "transaction": []
  };

  search: string ="";
  transaction: string = "all";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,    
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {

      this.api.getWalletValues()
      .then( content => { 
        this.wallet = _.get(content,"result",this.wallet);
        console.log(content);
      })
      .catch(e => console.log(e))

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }

  goToDetail(id,isTrash){
    this.navCtrl.push(DettaglioProdottoPage, { "id": id, "isTrash": isTrash });
  }

}
