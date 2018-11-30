import { Component, Input, Inject } from '@angular/core';
import { Content, NavController, LoadingController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import _ from 'lodash';

@Component({
  selector: 'rec-transaction',
  templateUrl: 'rec-transaction.html'
})
export class RecTransactionComponent {

  @Input() content: Content; // per scroll

  text: string;

  loading: boolean = false;
  init: boolean = false;

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
    console.log('Hello RecTransactionComponent Component');
    this.text = 'Hello World';
  }

  ionViewDidLoad() { }

  onEnter() {
   
    
    // this.menuController.enable(true, this.configProvider.config.SIDE_MENU_ID);

    if (_.isEmpty(_.get(this.wallet,"transaction"))) {
        this.loadData();
    }

    // fine inizializzazione altrimenti trigghera l'onChange degli input
    this.init = true;
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
        console.log(e);
        let transactions: Array<any> = _.get(this.wallet,"transaction",[]);
        transactions.forEach( (prod,i) =>{
          let el = _.get(e[i],"result[0].name","");
          console.log(el);
          _.set(prod,"wcn",el);
          /* prod.wcn = el; */
        }) 
     
        transactions.filter( t => {
          return t.trash_token != null;
        })
        _.set(this.wallet,"transactions",transactions);
        console.log(transactions);
        loading.dismiss();
      })
      .catch(e => console.log(e))
  }

  

}
