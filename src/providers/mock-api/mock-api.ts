import { Injectable } from '@angular/core';
import { ApiInterface } from '../api.interface';
import { ConfigProvider } from '../config/config';
import { StorageProvider } from '../storage/storage';
import { MockData } from './mock/mock-data';



@Injectable()
export class MockApiProvider implements ApiInterface {

   
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

  getWalletValues(): Promise<any> {

    let transaction: any = {
      
      "result": {
        "credit": 20,
        transaction: [
          {
            "product_id" : "Bottiglia vetro",
            "credit" : "0,25",
            "trash_token": "2" 
          },
          {
            "product_id" : "Biglietto cinema",
            "credit" : "5",
            "trash_token": "" 
          },
          {
            "product_id" : "Scatola uova",
            "credit" : "0,10",
            "trash_token": "2" 
          }
         
        ]
      }
    };

    return Promise.resolve(transaction);
  }

  getProductList(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  getProductDetail(id: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getTrashDetail(id: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  buyProduct(id: any,cost: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  checkLocalization(): Promise<any> {
    throw new Error("Method not implemented.");
  }
 
  
}

