import { Component, Inject, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LoginPage } from '../login/login';
import { UtilsProvider } from '../../providers/utils/utils';
import { ContentPage } from '../content/content';

@Component({
  selector: 'page-contatti-crm',
  templateUrl: 'contatti-crm.html',
})
export class ContattiCrmPage {

  private items: any;
  private month: number = moment().month() + 1;
  private year: number = moment().year();
  private currentDate : Date = moment(`${this.year}/${this.month}/01`).toDate();
  private isLoading : boolean = false;

  @ViewChild('calendar') calendar: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    @Inject(ApiInterfaceToken) public api: ApiInterface,
    public storage: StorageProvider,
    public cfg: ConfigProvider,
    public utils: UtilsProvider
  ) {

  }

  ionViewDidLoad() {
    console.log({month:this.month,year:this.year});
    return this.getContacts();
  }


  getContacts () {

    if (this.isLoading) return;

    const startOfMonth = moment(this.currentDate).startOf('month').format('YYYY/MM/DD');
    const endOfMonth   = moment(this.currentDate).endOf('month').add(1,"day").format('YYYY/MM/DD');

    console.log(`contacts: ${startOfMonth} - ${endOfMonth}`);

    this.isLoading = true;

    this.api.getContattiCRM(
      this.storage.get(this.cfg.config.AUTH_USERNAME),
      startOfMonth,
      endOfMonth
    )
    .then(res => {

      let _items = [];
      let days = new Set([]);

      let contacts = _.get(res,"data",[]);

      contacts.forEach(c => {
        if (c.Data_programmata != undefined) {
          let date = moment(c.Data_programmata, 'YYYY-MM-DD hh:mm:ss');
          
          if (!days.has(this.pad(date.date()))) {
            _items.push({
              type: "header",
              value: this.pad(date.date()) + ", " + this.getDayName(date.day())
            })
            days.add(this.pad(date.date()));
          }
          
          _items.push({
            type: "contact",
            value: Object.assign(
              c, 
              {
                hour: this.pad(date.hour()) + ":" + this.pad(date.second())
              })
          });

        }
      })      

      this.items = _items;
    })
    .catch(this.utils.handle401(this.navCtrl))
    .then(() => { this.isLoading = false; });

  }

  pad (value) {
    return _.padStart(value.toString(),2,'0');
  }

  triggerCalendar() {
    if (this.isLoading) return;
    this.calendar.open();
  }

  calendarChanged() {
    if (this.isLoading) return;
    this.year = moment(this.currentDate).year();
    this.month = moment(this.currentDate).month() + 1;
    return this.getContacts();
  }

  getMonthName(month:number) {
    const months = {
      1: "Gennaio",
      2:"Febbraio",
      3:"Marzo",
      4:"Aprile",
      5:"Maggio",
      6:"Giugno",
      7:"Luglio",
      8:"Agosto",
      9:"Settembre",
      10:"Ottobre",
      11:"Novembre",
      12:"Dicembre"
    }
    return months[month] || "";
  }

  getDayName(day:number) {
    const days = {
      1: "Lunedì",
      2: "Martedì", 
      3: "Mercoledì",
      4: "Giovedì",
      5: "Venerdì",
      6: "Sabato",
      7: "Domenica"
    }
    return days[day] || "";
  }

  // getPrevMonthName(month) {
  //   if (month <= 1) {
  //     month = 12;
  //   } else {
  //     month--;
  //   }
  //   return this.getMonthName(month);
  // }

  // getNextMonthName(month) {
  //   if (month >= 12) {
  //     month = 1;
  //   } else {
  //     month++;
  //   }
  //   return this.getMonthName(month);
  // }

  goToNextMonth() {
    if (this.isLoading) return;
    this.currentDate = moment(this.currentDate).add(1,"M").toDate();
    return this.calendarChanged();
  }

  goToPrevMonth() {
    if (this.isLoading) return;
    this.currentDate = moment(this.currentDate).add(-1,"M").toDate();
    return this.calendarChanged();
  }

  goToDetail(id) {
    this.navCtrl.push(ContentPage, { urlAction: `/sm_api.php?nome_entita=contatti&id_entita=${id}&op=view`});
  }

}
