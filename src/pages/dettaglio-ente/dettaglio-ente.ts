import { Component, ViewChild, Inject } from '@angular/core';
import { NavParams, Content, LoadingController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import * as consts from '../../consts';
import * as _ from 'lodash';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { PreventivoScontiPage } from '../preventivo-sconti/preventivo-sconti';

@Component({
  selector: 'page-dettaglio-ente',
  templateUrl: 'dettaglio-ente.html',
})
export class DettaglioEntePage {

  private title: string = "";
  private content : any;
  private urlAction : string;
  private idEnte: string;
  private denominazione: string;
  
  schedaClienteDoc: string = "";
  noLink: boolean = true;

  constructor(
    @Inject(ApiInterfaceToken) public api: ApiInterface,
    private navParams: NavParams,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
  ) {
      this.urlAction = this.navParams.get("urlAction");
      
      let queryString = _.get(this.urlAction.split("&")
        .filter( e => {
          return _.includes(e,"id_entita");
        }),"[0]","");
      this.idEnte = _.get(queryString.split("="),"[1]","");

      this.title = this.navParams.get("title");

      this.getSchedaCliente();
  }

  // ionViewWillEnter() {
  ionViewDidLoad() {
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

        let value : Array<any> = _.get(this.content,"value",[]);

        value.forEach( e => {
          let label = _.get(e,"label","");
          if(label == "Denominazione"){
            console.log(label + " "+ _.get(e,"value",""));
            this.denominazione = _.get(e,"value","");
          }
        })

        console.log("urlAction",this.urlAction);
        console.log("content",this.content);

        return loading.dismiss();
      })
      .catch(err => {
        console.error("si è verificato un errore",err);

        return loading.dismiss();
      })

  }

  goToPraticheEnte(){
    this.navCtrl.push(PreventivoScontiPage,{ "idEnte": this.idEnte, "denominazione": this.denominazione })
  }


  getSchedaCliente(){
    let where = "TipoDoc = 'Scheda_cliente' AND Entita = 'enti' AND ID_entita = "+this.idEnte;
    where = btoa(where);

    this.api.getContent(`/sm_search.php?entita=entita_documenti_crm&righePerPag=1&pag=0&&qryWhere=${where}`)
    .then( e => {
      return this.api.getContent(`/sm_api.php?nome_entita=entita_documenti_crm&id_entita=${_.get(e,"value[0].title")}&op=view`)
    })
    .then( e => {
      let attrs : Array<any> = _.get(e,"value",[]);
      attrs.forEach( e => {
        if(_.get(e,"label","") == "File"){
          if(_.get(e,"value","") != ""){
            this.noLink = false;
            this.schedaClienteDoc = "http://151.12.186.233/confidisystema/"+ _.get(e,"value","");
          }
          console.log(this.schedaClienteDoc);
        }
      })
     
    })
    .catch( e => console.log(e))
  }

  

}
