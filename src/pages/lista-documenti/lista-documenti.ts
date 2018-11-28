import {
  Component,
  ViewChild,
  Inject
} from '@angular/core';
import {
  NavParams,
  Content,
  LoadingController
} from 'ionic-angular';
import {
  ApiInterface,
  ApiInterfaceToken
} from '../../providers/api.interface';
import * as consts from '../../consts';
import * as _ from 'lodash';
import {
  NavController
} from 'ionic-angular/navigation/nav-controller';
import {
  PreventivoScontiPage
} from '../preventivo-sconti/preventivo-sconti';
import {
  CustomComponent
} from '../../components/custom/custom';



@Component({
  selector: 'page-lista-documenti',
  templateUrl: 'lista-documenti.html',
})
export class ListaDocumentiPage {

  private title: string = "";
  private content: any;
  private urlAction: string;
  private idPratica: string;

  private limit: number = 30;
  private pageIndex: number = 0;

  cfg: any = consts; // necessario per la vista

  rapporti: any;

  constructor(
    @Inject(ApiInterfaceToken) public api: ApiInterface,
    private navParams: NavParams,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
  ) {
    this.idPratica = this.navParams.get("idPratica") || "*";
    let where = `Entita = 'wfc_pratica' AND ID_entita = ${this.idPratica}`;
    where = btoa(where);

    this.urlAction = `/sm_search.php?entita=entita_documenti_crm&righePerPag=${this.limit}&pag=${this.pageIndex}&qryWhere=${where}`

  }

  // ionViewWillEnter() {
  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({});
    loading.present();



    this.api.getContent(this.urlAction)
      .then((content) => {
        this.content = content;
        return loading.dismiss();
      })
      .catch(err => {
        console.error("si è verificato un errore", err);
        return loading.dismiss();
      })



  }

  setFieldsCallback(c) {

    const fields = ["Titolo", "TipoDoc", "Data"];
    let values: Array < any > = _.get(c, "value", []);
    /* console.log(values); */
    let elem = [],
      filteredResults = [];
    values.forEach(v => {
      elem = _.get(v, "value", []);
      filteredResults = elem.filter(e => {
        let res = fields.indexOf(_.get(e, "label", ""));
        return res > -1 && _.get(e, "type", "") == this.cfg.CMP_LIST_VIEW_ENTITY_LABELED_STRING;
      });
      _.set(v, "value", filteredResults);
    })
    
    values.forEach( v =>{
      let title = _.get(v,"title","");
      let docValue: Array<any> = _.get(v,"value",[]);
      this.api.getContent(`/sm_api.php?nome_entita=entita_documenti_crm&id_entita=${title}&op=view`)
      .then(e => {
        let attrs: Array < any > = _.get(e, "value", []);
        attrs.forEach(e => {
          if (_.get(e, "label", "") == "File") {
            if (_.get(e, "value", "") != "") {
               docValue.push({
                "type": "CMP_CUSTOM_HTML",
                "cmp": CustomComponent,
                "value": {
                  "type": "documento",
                  "link": "http://151.12.186.233/confidisystema/" + _.get(e, "value", "")
                }
              });
            }
          }
        })

      })
      .catch(e => console.log(e))
    })

    _.set(c, "value", values);

    console.log(c);

    return c;
  }

}
