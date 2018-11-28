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

    getContent(uri:string) : Promise<any>;

    post(uri:string, data:any) : Promise<any>;

    getFilteringSelectContent(tab:string,
        campoValue:string,
        campoText:string,
        filtroSQL:string,
        orderBy:string,
        start:number,
        count:number,
        label:string
    ) : Promise<any>;

    searchEntries(term, urlAction: string)
    
    getRapporti(idEnte ?: string) : Promise<any>;

    getDettaglioRapporto() : Promise<any>;

    getContattiCRM(username:string, from:string, to:string) : Promise<any>;

    getListaRapporti(idPratica ?: string): Promise<any>;

    printPreventivo(idPratica ?: string): Promise<any>;
    getLastAlert(): Promise<any>;

    postMarcaEvento(idEvento): Promise<any>;

}