import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { HomePage } from '../home/home';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';


@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
})
export class RankingPage {

  ranks = [
    {
      "city" : "Ancona",
      "bins": [
        {
          "id": "Ancona01",
          "coin": 2200,
          "users":[
            {
              "name": "Luca M.",
              "coin": 999
            },
            {
              "name": "Federico S.",
              "coin": 501
            },
            {
              "name": "Simone S.",
              "coin": 200
            },
            {
              "name": "Niccolo R.",
              "coin": 200
            },
            {
              "name": "Giovanni T.",
              "coin": 200
            },
            {
              "name": "Alberto A.",
              "coin": 200
            },
            {
              "name": "Stefano C.",
              "coin": 100
            }
          ]
        },
        {
          "id": "Ancona02",
          "coin": 1856,
          "users":[
            {
              "name": "Alessandro P.",
              "coin": 800
            },
            {
              "name": "Fede S.",
              "coin": 501
            },
            {
              "name": "Simone S.",
              "coin": 499
            },
            {
              "name": "Niccolo R.",
              "coin": 56
            }
          ]
        }
      ]
    }
  ]

  constructor(public navCtrl: NavController, 
    public viewUtils: ViewUtilsProvider,
    public utilsProvider: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RankingPage');
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

}
