import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiInterface } from '../api.interface';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import * as configs from '../../configs';
import { StorageProvider } from '../storage/storage';
import { ConfigProvider } from '../config/config';
import _ from 'lodash';


let basePath = configs.API_BASE;
let filteringSelectPath = `${basePath}${configs.API_FILTERING_SELECT}`;


@Injectable()
export class HttpApiProvider implements ApiInterface {
 

  token : string = "";

  constructor(
    private http: HttpClient,
    private cfg: ConfigProvider,
    private storage: StorageProvider){

  }

  _getOpts = () => ({ headers : { "Auth-Key": this.storage.get(this.cfg.config.AUTH_TOKEN) } })

  login(username:string, password:string): Promise<any> {
    return this.http.post(`${basePath}/sm_auth.php`, {
      "username": username,
      "pwd": password
    }).toPromise()
      .then(data => {
        if (_.get(data, "server_status") == 200) {
          this.storage.set(this.cfg.config.AUTH_TOKEN, _.get(data, "items.token"));
          this.storage.set(this.cfg.config.AUTH_USERNAME, username);
        }
        return data;
      })
      .catch(err => {
        throw err;
      });
  }
  
  logout(): Promise<any> {
    this.storage.remove(this.cfg.config.AUTH_TOKEN);
    //this.storage.remove(this.cfg.config.AUTH_USERNAME);
    return Promise.resolve();
  }
  
  getRapporti(idEnte ?: string): Promise<any> {
    return this.http.get(`${basePath}/sm_proto.php?type=lista_rapporti${idEnte?'&id_entita='+idEnte:''}`,this._getOpts()).toPromise();
  }

  getContent(uri:string): Promise<any> {
    return this.http.get(`${basePath}${uri}`,this._getOpts()).toPromise();
  }

  post(uri:string, data:any): Promise<any> {
    return this.http.post(`${basePath}${uri}`, data, this._getOpts()).toPromise();
  }

  getFilteringSelectContent (
    tab:string,
    campoValue:string,
    campoText:string,
    filtroSQL:string,
    orderBy:string,
    start:number = 0,
    count:number = 100,
    label:string = "**" ) : Promise<any> {
    let uri = `${filteringSelectPath}?tab=${tab}&campoValue=${campoValue}&campoText=${campoText}&filtroSql=${filtroSQL}&orderBy=${orderBy}&label=${label}&start=${start}&count=${count}`;
    return this.http.get(encodeURI(uri)).toPromise();
  }

  searchEntries(term, urlAction: string) {
    return this.http.get(urlAction + term).map(res => res);
  }

  getDettaglioRapporto(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  getContattiCRM(username:string, from:string, to:string): Promise<any> {
    return this.http.get(`${basePath}/sm_proto.php?type=lista_contatti_crm&username=${username}&from=${from}&to=${to}`,this._getOpts()).toPromise();
  }

  getListaRapporti(idPratica?: string): Promise<any> {
    return this.http.get(`${basePath}/sm_proto.php?type=lista_rapporti_per_pratica&id_pratica=${idPratica}`,this._getOpts()).toPromise();
  }

  printPreventivo(idPratica?: string): Promise<any> {
    let obj : Object = this._getOpts;
    _.set(obj,"responseType","text");
    return this.http.get(`/confidisystema/wfc/wfc_stampa_preventivo.php?IdPratica=${idPratica}`,obj).toPromise();
  }
  
  getLastAlert(): Promise<any> {
    return this.http.get(`${basePath}/sm_proto.php?type=lista_avvisi&limit=10`,this._getOpts()).toPromise();
  }

  postMarcaEvento(idEvento): Promise<any> {
    return this.http.get(`${basePath}/sm_proto.php?type=marca_evento&id_evento=${idEvento}`,this._getOpts()).toPromise();
  }
 

}
