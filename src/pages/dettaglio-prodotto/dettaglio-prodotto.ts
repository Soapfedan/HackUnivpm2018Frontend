import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';

import _ from 'lodash';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';

@Component({
  selector: 'page-dettaglio-prodotto',
  templateUrl: 'dettaglio-prodotto.html',
})
export class DettaglioProdottoPage {

  id: string;
  isTrash: boolean;
  title: string;

  content: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewUtils: ViewUtilsProvider,
    private loadingCtrl: LoadingController,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {
    
    this.id = this.navParams.get("id") || "0";
    this.isTrash = this.navParams.get("isTrash") || false;

    this.title = this.isTrash? "Rifiuto" : "Prodotto";

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({ });
    loading.present();

    if(this.isTrash){
      this.getWaste(this.id)
      .then( e => {
        this.content = _.get(e,"result[0]",{});
        loading.dismiss();
        console.log(this.content);
      })
      .catch( e => {
        loading.dismiss();
        console.log(e);
      })
    }else{
      this.getProduct(this.id)
      .then( e => {
        this.content = _.get(e,"result[0]",{});
        console.log(this.content);
        return this.getWaste(_.get(this.content,"waste_id",""))
      })
      .then( e2 => {
        let wasteCateg =  _.get(e2,"result[0]",{});
        let name = _.get(wasteCateg,"name");
        _.set(this.content,"wcn",name);
        /* this.content.wcn = name; */
        loading.dismiss();
      })
      .catch( e => {
        loading.dismiss();
        console.log(e);
      })
    }

  }

  getProduct(id){
    return this.api.getProductDetail(id);
  }

  getWaste(id){
    return this.api.getTrashDetail(id);
  }

}
