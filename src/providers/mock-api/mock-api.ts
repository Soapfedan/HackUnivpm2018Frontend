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
    if (username == undefined && password == undefined) {
      this.storage.set(this.cfg.config.AUTH_TOKEN, "asd-asd-asd-asd");
      return Promise.resolve({ server_status : 200, data: "ehiii"});
    } else {
      return Promise.resolve({ server_status : 401, data: "not authenticated"});
    }
  }
    
  logout(): Promise<any> {
    this.storage.remove(this.cfg.config.AUTH_TOKEN);
    return Promise.resolve("Hai effettuato la logout");
  }
    
  getRapporti(): Promise<any> {
    return Promise.resolve(this.mockData.LISTARAPPORTI);
  }

  getContent(uri:string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  post(uri:string, data:any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  getFilteringSelectContent(tab: string, campoValue: string, campoText: string, filtroSQL: string, orderBy: string, start: number, count: number, label: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  searchEntries(term: any, urlAction: string) {
    throw new Error("Method not implemented.");
  }

  getDettaglioRapporto(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  getContattiCRM(username:string, from:string, to:string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  getListaRapporti(idPratica?: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  printPreventivo(idPratica?: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  
}

