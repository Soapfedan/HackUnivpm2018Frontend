import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import * as consts from '../../consts';
import _ from 'lodash';



@Component({
  selector: 'page-carica-valutazione',
  templateUrl: 'carica-valutazione.html',
})
export class CaricaValutazionePage {

  private content : any;
  private urlAction : string;

  idPratica: string = "";
  statusPratica: string = "";
  idProcesso: string = "";

  username: string = "";
  
  title: string = "";

  request: Object = {};

  toCreate: boolean = false;

  constructor(   @Inject(ApiInterfaceToken) public api: ApiInterface,
  private navParams: NavParams,
  private navCtrl: NavController,
  private loadingCtrl: LoadingController,) {

    this.urlAction = this.navParams.get("urlAction");
    this.request = this.navParams.get("request");

    this.idPratica = _.get(this.request,"idPratica","");
    this.statusPratica = _.get(this.request,"statusPratica","");
    this.idProcesso = _.get(this.request,"idProcesso","");
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaricaValutazionePage');

    let loading = this.loadingCtrl.create({ });
    loading.present();


    this.api.getContent(this.urlAction)
      .then(content => {
        this.content = content;
        if (_.isEmpty(this.title)) { 
          if (this.content.title) {
            this.title = "Elenco valutazioni";
          } else if (this.content.type == consts.CMP_LIST_VIEW) {
            this.title = "Dettaglio";
          } else if (this.content.type == consts.CMP_LIST_EDIT) {
            this.title = "Modifica";
          }
        }

        if(_.isEmpty(_.get(content,"value",[]))){

          this.toCreate = true;
          this.title = "Inserimento valutazione";
          

          return this.api.getContent("/sm_api.php?nome_entita=wfc_valutazioni&id_entita=1&op=edit")
        }else{
          return Promise.resolve(this.content);
        }
       
      

      })
      .then( content => {
        _.set(content,"toCreate",this.toCreate);
        _.set(content,"idPratica",this.idPratica);
        _.set(content,"statusPratica",this.statusPratica);
        _.set(content,"idProcesso",this.idProcesso);
        this.content = content;
        console.log("urlAction",this.urlAction);
        console.log("content",this.content);
        return loading.dismiss();
      })
      .catch(err => {
        console.error("si è verificato un errore",err);

        return loading.dismiss();
      })
  }


  setFieldsCallback(c){

    let idPratica = _.get(c,"idPratica","");
    let statusPratica = _.get(c,"statusPratica","");
    let idProcesso = _.get(c,"idProcesso","");
    let oldValues = [];
    let newValues = [{
        "key": "ID_wfc_pratica",
        "value": idPratica
      }, {
        "key": "ID_wfc_tab_processi",
        "value": statusPratica
    }, {
        "value": null,
        "key": "ID_rapporto",
        "selected": null
    },  
     {
        "value": "",
        "key": "InserCura",
     
    }, {
        "value": "",
        "key": "NotaValutazione",
     
    }, {
        "value": idProcesso,
        "key": "FaseProcesso",
     
    },
    {
      "value": "42",
      "key": "TipoValutazione",
      "selected": {key: "42", value: "42 - VALUTAZIONE RESPONSABILE CREDITO"}
   
  }, {
      "value": "",
      "key": "Valutazione",
      "selected": null
     
  },
  ];
    
    if(_.get(c,"toCreate","") != ""){
      oldValues = _.get(c,"value",[]);
      newValues.forEach((v) => {
        let label = _.get(v,"key");
        let value = _.get(v,"value");
        let valueToSet = _.find(oldValues,["key", label]);
        _.set(valueToSet,"value",value);
        if(_.has(v,"selected")){
          _.set(valueToSet,"selected",_.get(v,"selected",""));
        }
        if(label == "ID_rapporto" || label == "InserCura"){
          _.set(valueToSet,"type",consts.CMP_LIST_EDIT_ENTITY_LABELED_DISABLED_STRING);
        }
      });

      _.set(c,"value",oldValues);

      _.set(c,"submit.action.entityId",null);

    }

    return c;
  }

}
