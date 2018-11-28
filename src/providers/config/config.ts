
import { Injectable } from '@angular/core';
import { Configuration } from '../../configuration/app.config';


@Injectable()
export class ConfigProvider {

  private _conf:Configuration;

  constructor() {
    this._conf = new Configuration();
  }

  get config(): Configuration {
    return this._conf;
  }


}
