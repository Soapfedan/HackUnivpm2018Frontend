import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import _ from 'lodash';

@Component({
  selector: 'page-lista-prodotti',
  templateUrl: 'lista-prodotti.html',
})
export class ListaProdottiPage {

  products: Array<any> = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {

    this.getProductList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaProdottiPage');
  }

  getProductList(){
    this.api.getProductList()
    .then( e=> {
      this.products = _.get(e,"result");
      console.log(e);
    })
    .catch( e => {
      console.log(e);
    })
  }

  buyProduct(id,cost){
    this.api.buyProduct(id,cost)
    .then( e => {
      console.log(e);
    })
    .catch( e => {
      console.log(e);
    })
  }

}
