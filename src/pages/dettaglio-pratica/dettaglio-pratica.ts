import { Component, ViewChild, Inject } from '@angular/core';
import { NavParams, Content, LoadingController, AlertController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import * as consts from '../../consts';
import * as _ from 'lodash';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { PreventivoScontiPage } from '../preventivo-sconti/preventivo-sconti';
import { CustomComponent } from '../../components/custom/custom';
import { ListaDocumentiPage } from '../lista-documenti/lista-documenti';
import { Page } from 'ionic-angular/navigation/nav-util';
import { DettaglioRapportoPage } from '../dettaglio-rapporto/dettaglio-rapporto';
import { ListaValutazioniPage } from '../lista-valutazioni/lista-valutazioni';

@Component({
  selector: 'page-dettaglio-pratica',
  templateUrl: 'dettaglio-pratica.html',
})
export class DettaglioPraticaPage {

  private title: string = "";
  private content : any;
  private urlAction : string;
  private idPratica: string;

  private limit: number = 30;
  private pageIndex: number = 0;

  isPreventivo: boolean = false;
  pageToRender: Page = DettaglioRapportoPage; 
  

  rapporti: any;

  constructor(
    @Inject(ApiInterfaceToken) public api: ApiInterface,
    private navParams: NavParams,
    private navCtrl: NavController,
    protected alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {
      this.urlAction = this.navParams.get("urlAction");
      
      let queryString = _.get(this.urlAction.split("&")
        .filter( e => {
          return _.includes(e,"id_entita");
        }),"[0]","");
      this.idPratica = _.get(queryString.split("="),"[1]","");

      this.title = this.navParams.get("title");

  }

  // ionViewWillEnter() {
  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({ });
    loading.present();

   
    
      this.api.getContent(this.urlAction)
      .then((content) => {
        this.content = content;
        _.set(this.content,"idPratica",this.idPratica);
        if (_.isEmpty(this.title)) { 
          if (this.content.title) {
            this.title = this.content.title;
          } else if (this.content.type == consts.CMP_LIST_VIEW) {
            this.title = "Dettaglio";
          } else if (this.content.type == consts.CMP_LIST_EDIT) {
            this.title = "Modifica";
          }
        }

        let praticaValue: Array<any> = _.get(this.content,"value",[]);
       
        praticaValue.forEach( e =>{
         if(_.get(e,"label","") == "Processi"){
           if(_.get(e,"value","") == "1 - PREVENTIVO"){
             this.isPreventivo = true;
           }
         }
        })

        console.log("urlAction",this.urlAction);
        console.log("content",this.content);

        let where = `pratiche.ID IN ( SELECT ID_rapporto FROM wfc_pratica_rapporti_fasi WHERE ID_wfc_pratica = ${this.idPratica} )`;
        where = btoa (where);
        return this.api.getContent(`/sm_search.php?entita=pratiche&righePerPag=${this.limit}&pag=${this.pageIndex}&qryWhere=${where}`)
      })
      .then( (rapps) => {
        console.log(rapps);
        this.rapporti = rapps;
        _.set(this.rapporti,"idPratica",this.idPratica);
        return loading.dismiss();
        
      })
      .catch(err => {
        console.error("si è verificato un errore",err);

        return loading.dismiss();
      })

    

  }

  setFieldsCallback(c){

    this.api.getListaRapporti(_.get(c,"idPratica"))
    .then( res => {
      let rapportiProto = _.get(res,"data",[]);
      let listaRapportiApi: Array<any> = _.get(c,"value",[]);

      listaRapportiApi.forEach((rapporto,index) => {
        let rapportoValues: Array<any> = _.get(rapporto,"value",[]);
        let rapportoProtoValues = rapportiProto[index];

        let autorizzato = _.get(rapportoProtoValues,"isAutorizzato", "0");
        let hasMotivazione = _.get(rapportoProtoValues,"hasMotivazione", false);

        if(hasMotivazione == true && autorizzato == '0'){
          rapportoValues.unshift(
            {
              "type": "CMP_CUSTOM_HTML",
              "cmp": CustomComponent,
              "value": {
                "type": "attesa-autorizzazione-sconto"
              }
            }
          )
        } else if (hasMotivazione == true && autorizzato == '1'){
          rapportoValues.unshift(
            {
              "type": "CMP_CUSTOM_HTML",
              "cmp": CustomComponent,
              "value": {
                "type": "sconto-autorizzato"
              }
            }
          )
        } else if (hasMotivazione == true && autorizzato == '-1'){
          rapportoValues.unshift(
            {
              "type": "CMP_CUSTOM_HTML",
              "cmp": CustomComponent,
              "value": {
                "type": "sconto-non-autorizzato"
              }
            }
          )
        } else if (hasMotivazione == false){
          // NOTHING
        }

      });
    })
    .catch(e => console.log(e));

        

    /* let rapps: Array<any> = _.get(c,"value",[]);

      

    rapps.forEach( rapporto => {
        let rapportoValues: Array<any> = _.get(rapporto,"value",[])
    }); */

    return c;
  }

  goToListaDocumenti(){
    this.navCtrl.push(ListaDocumentiPage, { "idPratica" : this.idPratica });
  }

  goToListaValutazioni(){
    this.navCtrl.push(ListaValutazioniPage, { "idPratica": this.idPratica })
  }


  printDocument(){
    let loading = this.loadingCtrl.create({ });
    loading.present();
    console.log("Stampa preventivo");
    this.api.printPreventivo(this.idPratica)
    .then( c => {
      var regex = /files\s*(.*?)\s*"/g;
      var cc;
      var matches = [];
      while (cc = regex.exec(c)) {
        matches.push(cc[1]);
      }
      console.log(c);
      loading.dismiss();
      this.alertCtrl.create({
        title: "Preventivo creato correttamente",
        subTitle: "Accedi alla lista dei documenti per visualizzarlo",
        buttons: ['OK']
      }).present();
    })
    .catch(e => {
      console.log(e);
      loading.dismiss();
    })
  }



}
