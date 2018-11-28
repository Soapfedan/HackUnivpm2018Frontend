import { Component, Inject } from '@angular/core';
import { NavController, NavParams, Events, ViewController, LoadingController } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import * as consts from '../../consts';

import _ from 'lodash';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { DettaglioEntePage } from '../dettaglio-ente/dettaglio-ente';
import { Page } from 'ionic-angular/navigation/nav-util';

@Component({
  selector: 'page-enti',
  templateUrl: 'enti.html',
})
export class EntiPage {

  items: string[];

  cfg : any = consts; // necessario per la vista

  search: string = "";
  whereCondition: string = "";

  submitAttempted: boolean;

  error: any;

  urlParameters : object;

  start : number = 0;
  count : number = 10;

  pageIndex: number = 0;
  limit: number = 10;

  isPageEnd: boolean = false;

  urlAction: string;

  content: any = undefined;

  pageToRender: Page = DettaglioEntePage;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public viewUtils: ViewUtilsProvider,
    private loadingCtrl: LoadingController,
    @Inject(ApiInterfaceToken) public api: ApiInterface) {
      this.items = [];
      this.submitAttempted = false;
      
      // if(!_.isEmpty(this.input)){
      //   this.search = this.input;
      // }
      this._search(this.start, this.count);


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntiPage');
  }

  searchItem(){

      this.items = [];
      this.isPageEnd = false;
      this.start = 0;
      this._search(this.start, this.count, this.search);
  }

  clearSearchText(){
    this.search = "";
    this.items = [];
    this.start = 0;
    this.isPageEnd = false;
    this.content = undefined;
    this._search(this.start, this.count, this.search);
  }

  private _search (start, count, label = "") {
    let loading = this.loadingCtrl.create({ });
    loading.present();
    this.start += this.count;
    label = label.trim();
    label = label.replace('*','');

    this.pageIndex = this.start / this.limit;

    this.urlAction = `/sm_search.php?entita=enti&righePerPag=${this.limit}&pag=${this.pageIndex}`;
    this.whereCondition = "NaturaGiuridica != 'PRI'";
    if(this.search.trim().length > 0){
      this.whereCondition += " AND Denominazione LIKE '%" + label + "%'";
    }
    this.whereCondition = btoa(this.whereCondition);
    this.urlAction = this.urlAction + `&qryWhere=${this.whereCondition}`

    return this.api.getContent(this.urlAction)
    .then((data) => {
      this.content = !_.isEmpty(data) ? data : {};
      return loading.dismiss();
    })
    .catch(e => {
      console.log(e);
      return loading.dismiss();
    });
  }
  
}
