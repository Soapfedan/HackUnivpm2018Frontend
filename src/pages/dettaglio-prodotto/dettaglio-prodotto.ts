import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';



@Component({
  selector: 'page-dettaglio-prodotto',
  templateUrl: 'dettaglio-prodotto.html',
})
export class DettaglioProdottoPage {

  id: string;
  isTrash: boolean;
  title: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
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
      this.getWaste()
      .then( e => {
        loading.dismiss();
        console.log(e);
      })
      .catch( e => {
        loading.dismiss();
        console.log(e);
      })
    }else{
      this.getProduct()
      .then( e => {
        loading.dismiss();
        console.log(e);
      })
      .catch( e => {
        loading.dismiss();
        console.log(e);
      })
    }

  }

  getProduct(){
    return this.api.getProductDetail(this.id);
  }

  getWaste(){
    return this.api.getTrashDetail(this.id);
  }

}
