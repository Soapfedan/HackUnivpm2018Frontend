import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';

import * as consts from '../../consts';
import _ from 'lodash';
import { Page } from 'ionic-angular/navigation/nav-util';
import { ContentPage } from '../content/content';
import { CaricaValutazionePage } from '../carica-valutazione/carica-valutazione';

@Component({
  selector: 'page-lista-valutazioni',
  templateUrl: 'lista-valutazioni.html',
})
export class ListaValutazioniPage {

  idPratica: string;

  cfg : any = consts; // necessario per la vista

  valutazioni: Array<any> = [];

  datiPratica: Object = {};

  statusPratica: string = "*";

  listaValutazioniModificabili: any;

  private limit: number = 30;
  private pageIndex: number = 0;

  pageToRender: Page = CaricaValutazionePage;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    @Inject(ApiInterfaceToken) public api: ApiInterface) {

      let loading = this.loadingCtrl.create({ });
      loading.present();


    this.idPratica = this.navParams.get("idPratica");

    let where = ` ID_wfc_pratica = ${this.idPratica}`;
    where = btoa (where);  


    this.api.getContent(`/sm_search.php?entita=wfc_valutazioni&righePerPag=${this.limit}&pag=${this.pageIndex}&qryWhere=${where}`)
    .then((val) => {
      this.valutazioni = val;
      return this.api.getContent(`/sm_api.php?nome_entita=wfc_pratica&id_entita=${this.idPratica}&op=view`)
    })
    .then( data => {
      this.datiPratica = data;

      let values: Array<any> = _.get(this.datiPratica,"value",[]);

      values.forEach( val => {
        if(_.get(val,"label","") == "Processi"){
          let proc: string = _.get(val,"value"," ");
          proc = proc.replace(" ","");
          proc = _.get(proc.split("-"),"[0]","");
          this.statusPratica = proc;
          console.log("Status Pratica " + this.statusPratica);
        }
      })

      console.log(this.datiPratica);
   
      let where = ` Processo = ${this.statusPratica} AND Fase = ${this.statusPratica}`;
      where = btoa (where); 

      return this.api.getContent(`/sm_search.php?entita=wfc_tab_tipo_valutazioni&righePerPag=${this.limit}&pag=${this.pageIndex}&qryWhere=${where}`)
    })
    .then( valutazioniModificabili => {
      _.set(valutazioniModificabili,"request.idPratica",this.idPratica);
      _.set(valutazioniModificabili,"request.statusPratica",this.statusPratica);
      this.listaValutazioniModificabili = valutazioniModificabili;
      console.log(this.listaValutazioniModificabili);
      return loading.dismiss();
    })
    .catch( err => {
      console.log(err);
      return loading.dismiss();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaValutazioniPage');
  }

  setFieldsCallback(c){
    const fields = ["Codice","TipoKY","Descrizione"];
    let idPratica = _.get(c,"request.idPratica","");
    let statusPratica = _.get(c,"request.statusPratica","");
    let values: Array<any> = _.get(c,"value",[]);

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


    values.forEach( v=> {
      let entityValue: Array<any> = _.get(v,"value",[]);
     

      entityValue.forEach( entity => {
      let type = _.get(entity,"type","");
        if(type == this.cfg.CMP_LIST_VIEW_ENTITY_BUTTON){
          console.log(entity);
          _.set(entity,"value","Visualizza valutazione");
          let where = ` ID_wfc_pratica = ${idPratica} AND FaseProcesso = ${_.get(v,"title")}`;
          where = btoa(where);
          _.set(entity,"action.request",{"idPratica": idPratica, "statusPratica": statusPratica,"idProcesso":_.get(v,"title")})
          _.set(entity,"action.value",`/sm_search.php?entita=wfc_valutazioni&righePerPag=5&pag=0&qryWhere=${where}`)
        }
      })
      
    })

        _.set(c,"value",values); 

    return c;
  }

}
