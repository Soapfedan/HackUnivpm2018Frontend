import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import * as _ from 'lodash';
import { ContentPage } from '../content/content';


@Component({
  selector: 'page-dettaglio-rapporto',
  templateUrl: 'dettaglio-rapporto.html',
})
export class DettaglioRapportoPage {

  private idRapporto : string;
  private dettaglio : any;
  private lista : any;
  private title : string;

  urlAction: string = "";

  request: Object = {};

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private loadingCtrl: LoadingController,
      @Inject(ApiInterfaceToken) public api: ApiInterface

    ) {

    this.urlAction = this.navParams.get("urlAction"); 
    this.request = this.navParams.get("request");


    this.idRapporto = _.get(this.request,"querystring.idEntita");
    this.title = "Dettaglio Rapporto " + this.idRapporto;

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({ });
    loading.present();

    let base64Where = btoa(`ID_pratiche=${this.idRapporto}`);


    Promise.all([
      this.api.getContent(this.urlAction),
      this.api.getContent(`/sm_proto.php?type=lista_proventi&id_rapporto=${this.idRapporto}`),
    ])
    .then(([dettaglio, lista]) => {
      this.dettaglio = dettaglio;
      this.lista = _.get(lista, "data");

      return loading.dismiss();
    })
    .catch(err => {
      console.error("si è verificato un errore",err);
      return loading.dismiss();
    })
  }

  goToDettaglioProventiOneri(id,title) {
    this.navCtrl.push(ContentPage,
      {
        urlAction: `/sm_api.php?nome_entita=proventi_oneri&id_entita=${id}&op=edit`,
        title: `Modifica Prov/Oneri ${title}`
      })
  }

}


