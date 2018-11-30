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

import * as sha from 'sha.js';



let basePath = configs.API_BASE;


@Injectable()
export class HttpApiProvider implements ApiInterface {

 

  token : string = "";

  constructor(
    private http: HttpClient,
    private cfg: ConfigProvider,
    private storage: StorageProvider){

  }

  _getOpts_old = () => ({ headers : { "Auth-Key": this.storage.get(this.cfg.config.AUTH_TOKEN) } })

  _getOpts_xxx = () => ({ headers : { "Content-Type": this.cfg.config.URL_FORM_ENCODED } })

  _getOpts_json = () => ({ headers : { "Content-Type": this.cfg.config.JSON_CONTENT_TYPE } })

  login(username:string, password:string): Promise<any> {

    password = sha('sha256').update(password).digest('hex');

    return this.http.post(`${basePath}/user/login`, {
      "username": username,
      "password": password
    }).toPromise()
      .then(data => {
        if (_.get(data, "status") == 200) {
          this.storage.set(this.cfg.config.AUTH_TOKEN, _.get(data, "result"));
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
  

  sendLocalizationCode(deviceCode): Promise<any> {
    let user_token = this.storage.get(this.cfg.config.AUTH_TOKEN) || btoa("Prova");

    let body = {
      "trash": deviceCode,
      "user": user_token,
    }

    return this.http.post(`${basePath}/localization`,body,this._getOpts_json()).toPromise();
  }

  getWalletValues(): Promise<any> {
    
    let user_token = this.storage.get(this.cfg.config.AUTH_TOKEN) || btoa("Prova");

    return this.http.get(`${basePath}/wallet/transaction/${user_token}`).toPromise();
  }

  getProductList(): Promise<any> {
    return this.http.get(`${basePath}/products`).toPromise();
  }

  getProductDetail(id: any): Promise<any> {
    return this.http.get(`${basePath}/products/get/${id}`).toPromise();
  }
  getTrashDetail(id: any): Promise<any> {
    return this.http.get(`${basePath}/products/waste/${id}`).toPromise();
  }

  buyProduct(id: any,cost: any): Promise<any> {

    let user_token = this.storage.get(this.cfg.config.AUTH_TOKEN) || btoa("Prova");

    let body = {
      "id_product": id,
      "user": user_token,
      "cost": cost
    }

    return this.http.post(`${basePath}/wallet/buy/`,body,this._getOpts_json()).toPromise();
  }

  checkLocalization(): Promise<any> {

    let user_token = this.storage.get(this.cfg.config.AUTH_TOKEN) || btoa("Prova");

    return this.http.get(`${basePath}/localization/check/${user_token}`).toPromise();
  }


  signup(user: any): Promise<any> {

    let password = _.get(user,"password","");

    password = sha('sha256').update(password).digest('hex');

    _.set(user,"password",password);

    return this.http.post(`${basePath}/user/register`,user,this._getOpts_json()).toPromise();
  }
 
 

 

}
