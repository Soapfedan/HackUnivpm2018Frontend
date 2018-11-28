import { Component, Input, OnInit, Inject, OnChanges, SimpleChanges, SimpleChange, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { NavController, ToastController, AlertController, Events } from 'ionic-angular';
import { ContentPage } from '../../pages/content/content';
import * as consts from '../../consts';
import _ from 'lodash';
import { Page } from 'ionic-angular/navigation/nav-util';
import { CMPFilteringSelectPage } from '../../pages/cmp-filtering-select/cmp-filtering-select';
import { isNumber } from 'ionic-angular/util/util';

import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';

@Component({
  selector: 'dynamic',
  templateUrl: 'dynamic.html'
})
export class DynamicComponent implements OnInit, OnChanges {
 
  
  @Input() content: any;
  @Input() pageToRender: Page;
  @Input() preProcessingHook: Function;
  private form : object = {};
  private show : object = {};
  private errors : object = {};
  private goToPage: Page = ContentPage;
  private subscribeList : object[] = [];

  // LIST
  private currentRequest : any = {};
  private items : Array<any> = [];
  private isPageEnd: boolean = false;
  
  cfg : object = consts; // necessario per la vista

  @ViewChild('customHTML', {read: ViewContainerRef}) customHTML: ViewContainerRef;
  private refCustomHTML;

  
  constructor(
    protected navCtrl: NavController,
    protected toastCtrl: ToastController,
    protected alertCtrl: AlertController,
    @Inject(ApiInterfaceToken) public api: ApiInterface,
    public events: Events,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const _content: SimpleChange = changes.content;
    if (!_content.isFirstChange()) {
      this.content = _content.currentValue;
      this.init();
    }
   /*  if(_content.currentValue != _content.previousValue){
      this.init();
    } */
  }
  
  ngOnInit(): void {
    this.init();
  }


  ngOnDestroy() {
    if (this.refCustomHTML != undefined) {
      this.refCustomHTML.destroy(); 
    }
  }

  protected init () {

    if (_.isFunction(this.preProcessingHook)) {
      this.content = this.preProcessingHook(this.content);
    }

    if (this.content.type == consts.CMP_CUSTOM_HTML) {
      // https://www.thecodecampus.de/blog/angular-2-dynamically-render-components/
      // https://stackoverflow.com/questions/39243748/angular-2-passing-data-to-component-when-dynamically-adding-the-component
      if (this.content.cmp == undefined) {
        throw Error("this.content.cmp not defined");
      }
      let customHTMLComponent = this.componentFactoryResolver.resolveComponentFactory(this.content.cmp);
      this.refCustomHTML = this.customHTML.createComponent(customHTMLComponent);
      this.refCustomHTML.instance["value"]= this.content.value;
    }



    if (this.pageToRender != undefined) {
      this.goToPage = this.pageToRender;
    }


    if (this.content.type == consts.CMP_LIST) {
      this.items = this.content.value;
      /* this.isPageEnd = (this.items && this.items.length > 0) ? false : true; */  
      let righePerPag = _.get(this.content, "request.querystring.righePerPag", 0);
      this.isPageEnd = (this.items && this.items.length == righePerPag) ? false : true;
      this.currentRequest = this.content.request;
    }


    if (this.content.type == consts.CMP_LIST_EDIT) {
      this.content.value.forEach(v => {
        if (v.disabled == true) {
          return;
        }
        if (v.key) {
          this.form[v.key] = v.value;
        }
        if (v.type == consts.CMP_LIST_EDIT_ENTITY_LABELED_FILTERING_SELECT) {
          this.show[v.key] = v.selected ? v.selected.value : undefined;
        }
      })
    }


  }


  doInfiniteScroll(infiniteScroll) {
    console.log('infinite scroll, request', this.currentRequest);

    if (!_.has(this.currentRequest, "querystring")) {
      throw("request.querystring non specificata")
    }

    if (!_.has(this.currentRequest, "path")) {
      throw("request.path non specificato")
    }

    const querystring = Object.keys(this.currentRequest.querystring).map(term => {
      let value = this.currentRequest.querystring[term] != null
                    ? this.currentRequest.querystring[term]
                    : "";
      if (term == 'pag' && Number.isInteger(value)){
        value += 1;
      }
      return `${term}=${value}`;
    }).join('&');

    const uri = `${this.currentRequest.path}?${querystring}`;

    console.log('infinite scroll, uri', uri);

    this.api.getContent(uri)
      .then(newPage => {

        if (_.isFunction(this.preProcessingHook)) {
          newPage = this.preProcessingHook(newPage);
        }

        let newItems = _.get(newPage, "value",[]);
        let righePerPag = _.get(newPage, "request.querystring.righePerPag", 0);
        
        this.currentRequest = newPage.request;
        this.isPageEnd = (newItems.length < righePerPag) ? true : false;
        this.items = this.items.concat(newItems);
        infiniteScroll.complete();
      })
      .catch(err => {
        this.isPageEnd = true;
        infiniteScroll.complete();
      })
      
  }


  public goBack () {
    this.navCtrl.pop();
  }

  protected doAction(action) {
    if (action.type == consts.ACT_GO_TO) {

      this.navCtrl.push(this.goToPage, { urlAction: action.value, request: action.request });

    } else if (action.type == consts.ACT_DELETE) {
      
      this.createAlert(action, () => console.log("cancellata!")).present();
    
    } else if (action.type == consts.ACT_FORM_SUBMIT) {

      const ifOk = () => {

        let data = {};

        Object.keys(this.form).forEach(key => {
          if (this.form[key] === true) {
            data[key] = "1";
          } else if (this.form[key] === false) {
            data[key] = "0";
          } else if (this.form[key] === null) {
            data[key] = "";
            //delete data[key];
          } else {
            data[key] = this.form[key];
          }

          let rgex = new RegExp(/[1-9][0-9]*\.[0-9]*/);
          if (rgex.test(data[key])) {
            data[key] = data[key].toString().replace('.',',');
          }
        });

        const payload = {
          "nome_entita": action.entityName,
          "id_entita": action.entityId,
          "data": data
        }

        this.api.post(action.value, payload)
          .then(outcome => {
            if (outcome.status == 400) {
              this.errors = Object.assign({},outcome.errors);
              console.log("ERROR", this.errors);
              this.createMessageAlert("Attenzione","si è verificato un errore con i dati");
            } else {
              this.errors = {};
              console.log("SUCCESS");
              this.createMessageAlert("Modifica completata","continua a navigare");
            }
            console.log("form", this.form);
          })
          .catch(err => {
            this.createMessageAlert("Attenzione","si è verificato un errore con i dati");
            console.error(err);
            console.log({url:action.value,payload});
          })
      }

      this.createAlert(action, ifOk).present();

    }

  }

  protected goToFilteringSelectPage (input, eventId, urlParameters) {
    // WHAT TO DO WITH subscribeList
    this.events.subscribe(eventId, (item) => {
      this.form[eventId] = item.key;
      this.show[eventId] = item.value;
      const outcome = this.events.unsubscribe(eventId);
      console.log(`unsubscribed from ${eventId}: ${outcome}`);
    });    
    this.navCtrl.push(CMPFilteringSelectPage, { input, eventId, urlParameters });
  }


  
  protected createAlert(action, success) {
    return this.alertCtrl.create({
      title: action.title,
      subTitle: action.message,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Procedi',
          handler: success
        }
      ]
    });
  }


  protected createMessageAlert(title, message) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }




}
