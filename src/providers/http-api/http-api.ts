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


@Injectable()
export class HttpApiProvider implements ApiInterface {

 

  token : string = "";

  constructor(
    private http: HttpClient,
    private cfg: ConfigProvider,
    private storage: StorageProvider){

  }

  _getOpts_old = () => ({ headers : { "Auth-Key": this.storage.get(this.cfg.config.AUTH_TOKEN) } })

  _getOpts = () => ({ headers : { "Content-Type": this.cfg.config.URL_FORM_ENCODED } })

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
  

  sendLocalizationCode(deviceCode): Promise<any> {
    let user_token = this.storage.get(this.cfg.config.AUTH_TOKEN) || btoa("Prova");

    let body = {
      "trash_token": deviceCode,
      "user_token": user_token,
    }

    console.log(body);

    return Promise.resolve("aa");

    /* return this.http.post(`${basePath}/localization`,body,this._getOpts()).toPromise(); */
  }
 

}
