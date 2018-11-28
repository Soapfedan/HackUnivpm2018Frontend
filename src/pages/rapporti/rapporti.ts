import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import { UtilsProvider } from '../../providers/utils/utils';


import * as _ from 'lodash';
import { DettaglioRapportoPage } from '../dettaglio-rapporto/dettaglio-rapporto';

@Component({
  selector: 'page-rapporti',
  templateUrl: 'rapporti.html',
})
export class RapportiPage {

  rapporti: Array<any>;

  constructor(public navCtrl: NavController,
              public utilsProvider: UtilsProvider,
              @Inject(ApiInterfaceToken) public api: ApiInterface) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RapportiPage');
    this.getAllRapporti();
  }

  getAllRapporti(){
    this.api.getRapporti("79314")
    .then( r =>{
      this.rapporti = _.get(r,"data",{});
      console.log(this.rapporti);
    })
    .catch( e => console.log(e));
  }

  goToDettaglioRapporto(idRapporto) {
    this.navCtrl.push(DettaglioRapportoPage, { idRapporto });
  }


}
