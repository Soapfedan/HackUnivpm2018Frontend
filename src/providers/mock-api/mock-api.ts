import { Injectable } from '@angular/core';
import { ApiInterface } from '../api.interface';
import { ConfigProvider } from '../config/config';
import { StorageProvider } from '../storage/storage';
import { MockData } from './mock/mock-data';



@Injectable()
export class MockApiProvider implements ApiInterface {
 
  postMarcaEvento(idEvento): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getLastAlert(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  
  mockData : MockData;

  constructor(
    private cfg: ConfigProvider,
    private storage: StorageProvider) {
      
      console.log('Hello MockApiProvider Provider');
      this.mockData = new MockData();
      console.log(this.mockData.LISTARAPPORTI)
    }
    
  login(username:string, password:string): Promise<any> {
   /*  if (username == undefined && password == undefined) { */
      this.storage.set(this.cfg.config.AUTH_TOKEN, "asd-asd-asd-asd");
      return Promise.resolve({ server_status : 200, data: "ehiii"});
   /*  } else {
      return Promise.resolve({ server_status : 401, data: "not authenticated"});
    } */
  }
    
  logout(): Promise<any> {
    this.storage.remove(this.cfg.config.AUTH_TOKEN);
    return Promise.resolve("Hai effettuato la logout");
  }
    

  sendLocalizationCode(deviceCode): Promise<any> {
    throw new Error("Method not implemented.");
  }
  
}

