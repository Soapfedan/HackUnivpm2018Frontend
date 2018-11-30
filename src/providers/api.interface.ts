import { InjectionToken } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

export const ApiInterfaceToken = new InjectionToken<ApiInterface>( "Api Interface" );

export interface ApiInterface {
        
    login(username:string, password:string) : Promise<any>;

    logout() : Promise<any>;

    sendLocalizationCode(deviceCode): Promise<any>;

    getWalletValues(): Promise<any>;

    getProductList(): Promise<any>;

    getProductDetail(id): Promise<any>;

    getTrashDetail(id): Promise<any>;

    checkLocalization(): Promise<any>;

    buyProduct(id,cost): Promise<any>;

    signup(user): Promise<any>;

}