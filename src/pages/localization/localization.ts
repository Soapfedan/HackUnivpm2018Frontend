import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ApiInterfaceToken, ApiInterface } from '../../providers/api.interface';

import {Md5} from 'ts-md5/dist/md5';
import { ViewUtilsProvider } from '../../providers/view-utils/view-utils';
import { UtilsProvider } from '../../providers/utils/utils';

import _ from 'lodash';
import { HomePage } from '../home/home';
import jsQR from 'jsqr';

@Component({
  selector: 'page-localization',
  templateUrl: 'localization.html',
})
export class LocalizationPage {

  flag: boolean = false;
  loading: boolean = true;
  webOk: boolean = true;

  capture: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private viewUtils: ViewUtilsProvider,
    public utilsProvider: UtilsProvider,
    private alertCtrl: AlertController,
    @Inject(ApiInterfaceToken) public api: ApiInterface
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalizationPage');
    this.checkLink();
   
  }

  scanQRCode(){
    var page = this;
    var video: any = document.createElement("video");
    var canvasElement: any = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var outputData = document.getElementById("outputData");

    var tracks;
    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      tracks = stream.getVideoTracks();
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    },function(err){
      page.webOk = false;
    });



    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;

        canvasElement.height = 270;
        canvasElement.width = 360;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data != "" && !page.capture) {
          outputMessage.hidden = true;
          outputData.parentElement.hidden = false;
          outputData.innerText = code.data;
          video.pause();
          tracks[0].stop();
          console.log(code.data);
          page.capture = true;
          page.navCtrl.setRoot(HomePage);
          page.sendCode(code.data);
        } else {
          outputMessage.hidden = false;
          outputData.parentElement.hidden = true;
        }
      }
      requestAnimationFrame(tick);
    }
  }

  sendCode(data){
    let loading = this.loadingCtrl.create({ });
    loading.present();
    
    let code = Md5.hashStr(data);
    this.api.sendLocalizationCode(code)
    .then(e => {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: "Messaggio",
        subTitle: "Associazione eseguita!",
        buttons: [{text: 'Prosegui',handler: ()=> {
          if(!this.webOk){
            this.navCtrl.setRoot(HomePage);
          }
        }}]
      });
      alert.present();
    })
    .catch(e => console.log(e))
  }

  checkLink(){
    this.api.checkLocalization()
    .then( r => {
      this.flag = _.get(r,"result","0") == "0" ? false : true;
      if(!this.flag){
        this.scanQRCode();
      }
      this.loading = false;
    })
    .catch( e => {
      this.loading = false;
      console.log(e);
    })
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

}
