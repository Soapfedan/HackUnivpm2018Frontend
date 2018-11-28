import { Component, ViewChild, Inject } from '@angular/core';
import { NavParams, Content, LoadingController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import * as consts from '../../consts';
import * as _ from 'lodash';

@Component({
  selector: 'page-content',
  templateUrl: 'content.html',
})
export class ContentPage {

  private title: string = "";
  private content : any;
  private urlAction : string;

  constructor(
    @Inject(ApiInterfaceToken) public api: ApiInterface,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
  ) {
      this.urlAction = this.navParams.get("urlAction");
      this.title = this.navParams.get("title");
      this.content = this.navParams.get("content");
  }

  ionViewWillEnter() {
  //ionViewDidEnter () {
  //ionViewDidLoad() {
    
    console.log("asdasd", this.urlAction);

    if (!_.isEmpty(this.content)) {

      // NOTHING
      console.log("nothing");

    } else {

      let loading = this.loadingCtrl.create({ });
      loading.present();

      this.api.getContent(this.urlAction)
      .then(content => {
        this.content = content;
        if (_.isEmpty(this.title)) { 
          if (this.content.title) {
            this.title = this.content.title;
          } else if (this.content.type == consts.CMP_LIST_VIEW) {
            this.title = "Dettaglio";
          } else if (this.content.type == consts.CMP_LIST_EDIT) {
            this.title = "Modifica";
          }
        }
        console.log("urlAction",this.urlAction);
        console.log("content",this.content);

        return loading.dismiss();
      })
      .catch(err => {
        console.error("si è verificato un errore",err);

        return loading.dismiss();
      })

    }
  }
  

}
