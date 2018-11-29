import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { HomePage } from '../home/home';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  login: {
    username ? : string,
    password ? : string
  } = {
    username: "user",
    password: "password"
  };

  constructor(
    public navCtrl: NavController,
    @Inject(ApiInterfaceToken) public api: ApiInterface,
    private toastCtrl : ToastController,
    private viewUtils: ViewUtilsProvider,
    private storage : StorageProvider,
    private cfg: ConfigProvider
  ) {
    this.login.username = storage.get(cfg.config.AUTH_USERNAME) || "user";
    this.login.password = storage.get(cfg.config.AUTH_USERNAME) || "password";
  }

  
  onLogin(){
    console.log(JSON.stringify(this.login));
    console.log("Login");
    this.api.login(this.login.username, this.login.password)
      .then(data => {
        switch (data.server_status) {
          case 200:
            this.viewUtils.showToast(this.toastCtrl, "autenticazione riuscita");
            this.navCtrl.setRoot(HomePage);
            break;
          case 401:
            this.viewUtils.showToastError(this.toastCtrl, "username e/o password errati");
            break;
          default:
            this.viewUtils.showToastError(this.toastCtrl, "si è verificato un problema");
            break;
        }
      })
      .catch(err => {
        this.viewUtils.showToastError(this.toastCtrl, "si è verificato un problema");
      });
  }


  onSignup(){
    console.log("Signup");
  }

  
  rememberPassword(){
    console.log("Remember Password");
  }

}
