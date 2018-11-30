import { Component, Inject } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ApiInterface, ApiInterfaceToken } from '../../providers/api.interface';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {



  signup: {
    email ? : string,
    password ? : string
    name ? : string,
    surname ? : string,
  } = {
    email: "",
    password: "",
    name: "",
    surname: ""
  };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public viewUtils: ViewUtilsProvider,
    @Inject(ApiInterfaceToken) public api: ApiInterface, 
   ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  goToLogin(){
    this.navCtrl.setRoot(LoginPage);
  }

  submit(){

    this.api.signup(this.signup)
    .then(data => {
      switch (data.status) {
        case 200:
          this.viewUtils.showToast(this.toastCtrl, "Registrazione riuscita");
          this.navCtrl.setRoot(LoginPage);
          break;
        case 409:
          this.viewUtils.showToastError(this.toastCtrl, "Email già presente");
          this.signup.password = "";
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

}
