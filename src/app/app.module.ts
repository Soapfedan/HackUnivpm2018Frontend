import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, InjectionToken } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigProvider } from '../providers/config/config';
import { StorageProvider } from '../providers/storage/storage';
import { MockApiProvider } from '../providers/mock-api/mock-api';
import { HttpApiProvider } from '../providers/http-api/http-api';
import { ApiInterface, ApiInterfaceToken } from '../providers/api.interface';
import { ViewUtilsProvider } from '../providers/view-utils/view-utils';
import { LoginPage } from '../pages/login/login';
import { EntiPage } from '../pages/enti/enti';
import { RapportiPage } from '../pages/rapporti/rapporti';
import { UtilsProvider } from '../providers/utils/utils';
import { DettaglioRapportoPage } from '../pages/dettaglio-rapporto/dettaglio-rapporto';

import { ComponentsModule } from '../components/components.module';
import { ContentPage } from '../pages/content/content';
import { CMPFilteringSelectPage } from '../pages/cmp-filtering-select/cmp-filtering-select';
import { DettaglioEntePage } from '../pages/dettaglio-ente/dettaglio-ente';
import { PreventivoScontiPage } from '../pages/preventivo-sconti/preventivo-sconti';
import { ContattiCrmPage } from '../pages/contatti-crm/contatti-crm';
import { DynamicComponent } from '../components/dynamic/dynamic';
import { CustomComponent } from '../components/custom/custom';
import { DettaglioPraticaPage } from '../pages/dettaglio-pratica/dettaglio-pratica';
import { ListaDocumentiPage } from '../pages/lista-documenti/lista-documenti';
import { ListaValutazioniPage } from '../pages/lista-valutazioni/lista-valutazioni';
import { CaricaValutazionePage } from '../pages/carica-valutazione/carica-valutazione';
import { AlertPage } from '../pages/alert/alert';

let isDev = true;

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    EntiPage,
    RapportiPage,
    DettaglioRapportoPage,
    ContentPage,
    CMPFilteringSelectPage,
    DettaglioEntePage,
    PreventivoScontiPage,
    ContattiCrmPage,
    ListaDocumentiPage,
    DettaglioPraticaPage,
    ListaValutazioniPage,
    CaricaValutazionePage,
    AlertPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    EntiPage,
    RapportiPage,
    DettaglioRapportoPage,
    ContentPage,
    CMPFilteringSelectPage,
    DettaglioEntePage,
    PreventivoScontiPage,
    ContattiCrmPage,
    DynamicComponent,
    CustomComponent,
    ListaDocumentiPage,
    DettaglioPraticaPage,
    ListaValutazioniPage,
    CaricaValutazionePage,
    AlertPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    StorageProvider,
    {provide: ApiInterfaceToken, useClass: isDev ? MockApiProvider : HttpApiProvider},
    ViewUtilsProvider,
    UtilsProvider
  ]
})
export class AppModule {}
