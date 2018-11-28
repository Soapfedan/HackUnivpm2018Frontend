import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import _ from 'lodash';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';


/**
 * TODO:
 * - aggiungere valore selezionato in lista;
 * in questo modo, i valori non ammissibili, es.: "" o inesistenti,
 * vengono cmq inseriti dentro la lista
 * X infinite scroll con search=input, non va avanti;
 * X alla seconda entrata, mantiene la vecchia selezione
 * - gestire meglio la scritta "non ci sono più elementi"
 * 
 */



@Component({
  selector: 'page-cmp-filtering-select',
  templateUrl: 'cmp-filtering-select.html',
})
export class CMPFilteringSelectPage {

  input: string;
  eventId: string;

  items: string[];

  search: string = "";

  submitAttempted: boolean;

  error: any;

  urlParameters : object;

  start : number = 0;
  count : number = 100;
  isPageEnd: boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    @Inject(ApiInterfaceToken) public api: ApiInterface) {

      this.input = navParams.get("input");
      this.eventId = navParams.get("eventId");
      this.urlParameters = navParams.get("urlParameters");

      console.log(this.input);
      console.log(this.eventId);
      console.log(this.urlParameters);

      this.items = [];
      this.submitAttempted = false;
      
      // if(!_.isEmpty(this.input)){
      //   this.search = this.input;
      // }

      this._search(this.start, this.count);

  }

  searchItem(){
    this.items = [];
    this.isPageEnd = false;
    this.start = 0;
    if(this.search.length > 1){
      this._search(this.start, this.count, this.search);
    }
  }

  clearSearchText(){
    this.search = "";
    this.items = [];
    this.start = 0;
    this.isPageEnd = false;
  }

  selectItem(item){
    console.log(item);
    this.dismiss(item);
  }

  dismiss(item = undefined) {
    let data;
    if(item == undefined){
      //data = { key: this.input };
      throw Error("item non definito");
    } else {
      data = { key: item.ID, value: item.label };
    }   
    this.events.publish(this.eventId, data);
    this.navCtrl.pop();
  }

  dismissWithoutData(){
    this.navCtrl.pop();
  }

  private _search (start, count, label = "") {
    this.start += this.count;
    label = label.trim();
    label = label.replace('*','');
    label = `*${label}*`;
    return this.api.getFilteringSelectContent(
      this.urlParameters["tab"],
      this.urlParameters["campoValue"],
      this.urlParameters["campoText"],
      this.urlParameters["filtroSQL"],
      this.urlParameters["orderBy"],
      start,
      count,
      label
    ).then(data => {
      if (data.numRows < count) {
        this.isPageEnd = true;
      }
      console.log(this.items.length);
      this.items = (this.items || []).concat(data.items);
    })
  }



  doInfinite(infiniteScroll) {
    console.log('Begin async operation',this.start,this.count);

      this._search(this.start, this.count, this.search)
        .then(() => {
          infiniteScroll.complete();
        })
        .catch(err => {
          infiniteScroll.complete();
        });

      console.log('Async operation has ended');
      
  }

}
