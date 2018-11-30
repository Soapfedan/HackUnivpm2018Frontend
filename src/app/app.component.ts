import { Component, ViewChild, Inject } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StorageProvider } from '../providers/storage/storage';
import { ConfigProvider } from '../providers/config/config';
import { LoginPage } from '../pages/login/login';
import { ApiInterface, ApiInterfaceToken } from '../providers/api.interface';
import { LocalizationPage } from '../pages/localization/localization';
import { WalletPage } from '../pages/wallet/wallet';
import { ListaProdottiPage } from '../pages/lista-prodotti/lista-prodotti';
import { UtilsProvider } from '../providers/utils/utils';
import { RankingPage } from '../pages/ranking/ranking';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  // rootPage: any = ContattiCrmPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar,
              public splashScreen: SplashScreen, 
              public storage: StorageProvider,
              public utilsProvider: UtilsProvider,
              @Inject(ApiInterfaceToken) public api: ApiInterface,
              public cfg: ConfigProvider) {

    if(!this.isAuthenticated()){
      this.rootPage = LoginPage;
    }
    
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Wallet', component: HomePage },
      { title: 'Associa', component: LocalizationPage },/* 
      { title: 'Portafoglio', component: WalletPage }, */
      { title: 'Lista prodotti', component: ListaProdottiPage },
      { title: 'Classifiche', component: RankingPage },

     /*  { title: 'List', component: ListPage } */
    ];


  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  isAuthenticated(){
    return this.storage.get(this.cfg.config.AUTH_TOKEN,undefined) != undefined;
  }

  logout(){
    this.api.logout()
    .then( r => {
      console.log(r);
      this.nav.setRoot(LoginPage);
    })
    .catch( e => console.log(e));
  }

   shouldShow(isOpen = true) {
     return this.isAuthenticated() && this.utilsProvider.isDesktop();
   }

}
