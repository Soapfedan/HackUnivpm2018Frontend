import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';
import * as _ from 'lodash';
import { ContentPage } from '../content/content';

@Component({
  selector: 'page-alert',
  templateUrl: 'alert.html',
})
export class AlertPage {

  private items: any;
  private isLoading : boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {
  }

  ionViewWillEnter() {
    return this.getAlert();
  }

  // ionViewDidLoad() {
    
  // }

  private getAlert () {
    return this.api.getLastAlert()
      .then(data => {
        this.items = _.get(data, 'data');
      })
      .catch(err => {

      })
  }

  private goTo (item) {
    this.api.postMarcaEvento(_.get(item,"id"));
    this.navCtrl.push(ContentPage, { urlAction: `/sm_api.php?nome_entita=${_.get(item,"data.entita")}&id_entita=${_.get(item,"data.id")}&op=view` })
  }

}
