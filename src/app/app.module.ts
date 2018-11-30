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
import { UtilsProvider } from '../providers/utils/utils';

import { ComponentsModule } from '../components/components.module';
import { LocalizationPage } from '../pages/localization/localization';
import { WalletPage } from '../pages/wallet/wallet';
import { DettaglioProdottoPage } from '../pages/dettaglio-prodotto/dettaglio-prodotto';
import { ListaProdottiPage } from '../pages/lista-prodotti/lista-prodotti';
import { SignupPage } from '../pages/signup/signup';
import { RankingPage } from '../pages/ranking/ranking';

let isDev = false;

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    LocalizationPage,
    WalletPage,
    DettaglioProdottoPage,
    ListaProdottiPage,
    SignupPage,
    RankingPage
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
    LocalizationPage,
    WalletPage,
    DettaglioProdottoPage,
    ListaProdottiPage,
    SignupPage,
    RankingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigProvider,
    StorageProvider,
    {provide: ApiInterfaceToken, useClass: isDev ? MockApiProvider : HttpApiProvider},
    ViewUtilsProvider,
    UtilsProvider,
    WalletPage
  ]
})
export class AppModule {}
