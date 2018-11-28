import { Component, Inject } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { EntiPage } from '../enti/enti';
import { RapportiPage } from '../rapporti/rapporti';
import { ContentPage } from '../content/content';
import { DettaglioRapportoPage } from '../dettaglio-rapporto/dettaglio-rapporto';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { PreventivoScontiPage } from '../preventivo-sconti/preventivo-sconti';
import { ContattiCrmPage } from '../contatti-crm/contatti-crm';
import { CustomComponent } from '../../components/custom/custom';
import { AlertPage } from '../alert/alert';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username : string;

  constructor(
    private navCtrl: NavController,
    private cfg: ConfigProvider,
    private storage: StorageProvider
    ) {
    this.username = storage.get(cfg.config.AUTH_USERNAME) || "";

  }

  goToEnti(){
    this.navCtrl.push(EntiPage);
  }

  goToAlert(){
    this.navCtrl.push(AlertPage);
  }

  goToRapporti(){
    this.navCtrl.push(RapportiPage);
  }

  goToDettaglioRapporto(idRapporto) {
    this.navCtrl.push(DettaglioRapportoPage, { idRapporto: idRapporto || "168104" })
  }

  goToModificaProventiOneri() {
    this.navCtrl.push(ContentPage, { urlAction: "/sm_api.php?nome_entita=proventi_oneri&id_entita=8&op=edit" })
  }

  goToPreventivoSconti(){
    this.navCtrl.push(PreventivoScontiPage);
  }

  goToContattiCRM(){
    this.navCtrl.push(ContattiCrmPage);
  }

  goToCustomHTML() {
    this.navCtrl.push(
      ContentPage,
      {
        content: {
            "type": "CMP_LIST_VIEW",
            "value": [
                {
                    "type": "CMP_LIST_VIEW_ENTITY_BUTTON",
                    "value": "modifica",
                    "action": {
                        "type": "ACT_GO_TO",
                        "value": "checkboxEdit"
                    }
                },
                {
                    "type": "CMP_LIST_VIEW_ENTITY_LABELED_STRING",
                    "value": "SI",
                    "label": "Checkbox TRUE",
                    "innerType": "checkboxfld"
                },
                {
                  "type": "CMP_CUSTOM_HTML",
                  "cmp": CustomComponent,
                  "value": {
                    "type": "sconto-autorizzato"
                  }
                },
                {
                    "type": "CMP_LIST_VIEW_ENTITY_LABELED_STRING",
                    "value": "NO",
                    "label": "Checkbox FALSE",
                    "innerType": "checkboxfld",
                    "key": "checkBoxFalse"
                },
                {
                  "type": "CMP_CUSTOM_HTML",
                  "cmp": CustomComponent,
                  "value": {
                    "type": "sconto-non-autorizzato"
                  }
                }
            ]
        }
      }
    )
  }

}
