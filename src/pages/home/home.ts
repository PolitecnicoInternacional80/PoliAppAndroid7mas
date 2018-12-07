import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /**Arreglo para recibir los datos del estudiante */
  public infoEst = this.navParams.get('key2');
  userFB= [];
  showUserFB: boolean;


  /**Iniciar los componentes y habilita es el menu de navegación para la App*/
  constructor(public navCtrl: NavController, public navParams:NavParams,private menu: MenuController,
    public splashScreen:SplashScreen, public storage: Storage) {
      this.menu.enable(true);
      console.log('Welcome to Home');
  }

  ionViewWillEnter(){
    this.showUserFB=false;
    this.storage.get('userFB')
    .then((res)=>{this.userFB=res; this.showUserFB=true})
    .catch(err=>err)
  }
  
}
