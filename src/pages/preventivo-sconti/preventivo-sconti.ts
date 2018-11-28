import { Component, Inject } from '@angular/core';
import { NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import * as consts from '../../consts';

import _ from 'lodash';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { DettaglioEntePage } from '../dettaglio-ente/dettaglio-ente';
import { Page } from 'ionic-angular/navigation/nav-util';
import { DettaglioRapportoPage } from '../dettaglio-rapporto/dettaglio-rapporto';
import { CustomComponent } from '../../components/custom/custom';
import { DettaglioPraticaPage } from '../dettaglio-pratica/dettaglio-pratica';

@Component({
  selector: 'page-preventivo-sconti',
  templateUrl: 'preventivo-sconti.html',
})
export class PreventivoScontiPage {

  items: string[];

  pratiche: Array<any>;

  cfg : any = consts; // necessario per la vista

  search: string = "";
  whereCondition: string = "";

  statusSelected: string;
  statusSconto: string;

  submitAttempted: boolean;

  error: any;

  urlParameters : object;

  start : number = 0;
  count : number = 10;

  pageIndex: number = 0;
  limit: number = 10;

  isPageEnd: boolean = false;

  loading = true;

  urlAction: string;

  statusList: Array<any> = [];

  content: any = undefined;

  pageToRender: Page = DettaglioPraticaPage;

  idEnte: string = undefined;
  denominazione: string = undefined;

  pageTitle: string = "Lista Pratiche";


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public viewUtils: ViewUtilsProvider,
    @Inject(ApiInterfaceToken) public api: ApiInterface) {
      this.items = [];
      this.submitAttempted = false;

      
      this.statusSelected = "all";
      this.statusSconto = "all";  

      this.idEnte = this.navParams.get("idEnte");
      
      if(_.isEmpty(this.idEnte)){
        this.pageTitle = "Lista Preventivi";
        this.limit = 100;
        this.initSearchableList();
      }else{
        this.denominazione = this.navParams.get("denominazione") || "";
        this.pageTitle = "Lista Pratiche "+ this.denominazione;
        this.initCustomerList();
      }
     
      

  }

  initSearchableList(){

      
    Promise.all([
      this.getListaStatus(),
      this._search(this.start, this.count)  
    ])
    .then( ()=> {
        console.log("Caricamento effettuato");
        this.loading = false;
    })
    .catch(e => {
      console.log(e);
      this.loading = false;
    });

  }

  initCustomerList(){

    

    this. whereCondition = `ID_enti = ${this.idEnte}`;

    this.pageIndex = this.start / this.limit;
    this.urlAction = `/sm_search.php?entita=wfc_pratica&righePerPag=${this.limit}&pag=${this.pageIndex}`;

    this.whereCondition = btoa(this.whereCondition);
    this.urlAction = this.urlAction + `&qryWhere=${this.whereCondition}`


    this.api.getContent(this.urlAction)
    .then( e => {
      this.content = e;
      this.getListaStatus();
      /* 
      _.set(this.content,"idEnte",this.idEnte); */
    })
    .catch( e => console.log(e));
    
    this.loading = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntiPage');
  }

  getListaStatus(){
    
    const statusListUrl = `/sm_search.php?entita=wfc_tab_status&righePerPag=100&pag=${this.pageIndex}`;

    return this.api.getContent(statusListUrl)
    .then((data) => {
      this.statusList = _.get(data,"value",[]);
    })
    .catch(e => console.log(e));
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
    this.statusSelected = "all";
    this.statusSconto = "all";
    this.isPageEnd = false;
    this._search(this.start, this.count, this.search);
  }

  private _search (start, count, label = "") {
    this.start += this.count;
    /* label = label.trim();
    label = label.replace('*','');
    label = `*${label}*`; */

    this.whereCondition = "";

    this.pageIndex = this.start / this.limit;
    this.urlAction = `/sm_search.php?entita=wfc_pratica&righePerPag=${this.limit}&pag=${this.pageIndex}`;
    console.log(this.statusSelected);

    if(!_.isEmpty(this.idEnte)){
      this. whereCondition += ` ID_enti = ${this.idEnte}`;
    }else {
      this. whereCondition = " ID_wfc_tab_processi IN (1)";
    }


    if(!_.isEmpty(this.statusSelected) && this.statusSelected != "all"){

      this.whereCondition += ` AND Status_pratica=${this.statusSelected}`;
    }

    if(this.search.trim().length > 0){
      this.whereCondition += ` AND ID_enti IN (
        SELECT ID FROM enti WHERE Denominazione LIKE '%${this.search.trim()}%'
      ) `
    }

    this.whereCondition = btoa(this.whereCondition);
    this.urlAction = this.urlAction + `&qryWhere=${this.whereCondition}`;

    return this.api.getContent(this.urlAction)
    .then((data) => {
      _.set(data,"statusSconto",this.statusSconto);
      this.content = !_.isEmpty(data) ? data : {};
      this.pratiche = !_.isEmpty(data) ? data : {};
      
    })
    .catch(e => console.log(e));
  }


  setFieldsCallback(c){

    let statusSconto = _.get(c,"statusSconto","");
    let semaphore: number = 0;
    const fields = ["DesProcesso","DesStatus","Data inizio pratica"];
    let values: Array<any> = _.get(c,"value",[]);
    /* console.log(values); */
    let elem = [], filteredResults = [];
    values.forEach( v => {
      elem = _.get(v,"value",[]);
      filteredResults = elem.filter(e => {
        let res = fields.indexOf(_.get(e,"label",""));
        return res > -1 || _.get(e,"type","") != this.cfg.CMP_LIST_VIEW_ENTITY_LABELED_STRING;
      });
      _.set(v,"value",filteredResults);
    })
    _.set(c,"value",values);

    /*  TODO LIST 
      - VERIFICARE SE STAI MOSTRANDO LA LISTA DEI PREVENTIVI
      - VERIFICARE QUALE SIA LO STATO DELLA SELECT
      - SE DIVERSO DA "ALL" ESTRARRE I RAPPORTI DI QUELLA PRATICA
      - ITERARE SULLE PRATICHE ED ESTRARRE LO STATO DEI RAPPORTI
      - VERIFICARE SE CI SIA UN RAPPORTO SCONTATO
      - AGGANCIARE IL BADGE
    */


      let listaPratiche: Array<any> = _.get(c,"value",[]);
      let promises: Array<Promise<any>> = [];


      listaPratiche.forEach ( pratica => {
        let idPratica = _.get(pratica,"title","");
        let praticaValue: Array<any> = _.get(pratica,"value",[]);
        this.api.getContent(`/sm_proto.php?type=get_ente_denominazione&idPratica=${idPratica}`)
        .then( e => {
          let denom = _.get(e,"data.Denominazione","");
          let cmpDenominazione = [{type: "CMP_LIST_VIEW_ENTITY_LABELED_STRING", label: "Denominazione", value: denom}];
          
          praticaValue = cmpDenominazione.concat(praticaValue);
          
          _.set(pratica,"value",praticaValue);

          console.log(e);
        })
        .catch( err => console.log(err))
       /*   praticaValue.push(
          {
            "type": "CMP_CUSTOM_HTML",
            "cmp": CustomComponent,
            "value": {
              "type": "lista-rapporti",
              "rapporti": rapps
            }
          }); */

      });


      // listaPratiche.forEach( pratica => {
      //   promises.push(this.api.getListaRapporti(_.get(pratica,"title")));
      // });

      listaPratiche.forEach( (pratica,i) => {
       this.api.getListaRapporti(_.get(pratica,"title"))
       .then( res => {
         semaphore++;
         let rapps = _.get(res,"data",[]);

         let praticaValue: Array<any> = _.get(pratica,"value",[]);
         praticaValue.push(
          {
            "type": "CMP_CUSTOM_HTML",
            "cmp": CustomComponent,
            "value": {
              "type": "lista-rapporti",
              "rapporti": rapps
            }
          });
         _.set(pratica,"value",praticaValue);
         _.set(pratica,"rapporti",rapps);
         
         if(!_.isEmpty(statusSconto) && statusSconto != "all"){

          let toBeShowed: boolean = false;

            rapps.forEach( rapporto => {
              let mot = _.get(rapporto,"hasMotivazione",false);
              let auth = _.get(rapporto,"isAutorizzato","");
              if(mot){
                if( (auth == "-1" && statusSconto == "deny") ||
                    (auth == "1" && statusSconto == "accepted") ||
                    (auth == "0" && statusSconto == "wait")
                  ){
                    toBeShowed = true;
                  }
              }
            });

            _.set(pratica,"toBeShowed",toBeShowed);
            if(!toBeShowed){
              _.set(pratica,"value",undefined);
            }
          
         }

        })
       .catch(e => {
        semaphore++; 
        console.log(e)});


      });
      
      // if(semaphore == _.get(listaPratiche,"length") && !_.isEmpty(this.statusSconto) && this.statusSconto != "all"){
              
      //   console.log(semaphore);
      //   listaPratiche = listaPratiche.filter( pratica => {
      //     {
      //       console.log(_.get(pratica,"toBeShowed",false));
      //       return _.get(pratica,"toBeShowed",false)
      //     }
      //   })
      // }

    return c;
  }


  ionViewDidEnter(){
   // this.content = this.pratiche;
    if(!_.isEmpty(this.statusSconto) && this.statusSconto != "all"){
      let listaPratiche: Array<any> = _.get(this.content,"value",[]);
      
      listaPratiche = listaPratiche.filter( pratica => {
        {
          console.log(_.get(pratica,"toBeShowed",false));
          return _.get(pratica,"toBeShowed",false)
        }
      })
     
      _.set(this.content,"value",listaPratiche);

    }
  }

}
