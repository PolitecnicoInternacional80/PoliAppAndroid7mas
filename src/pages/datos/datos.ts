import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';


import { RestProvider } from '../../providers/rest/rest';
import { ActualizaDatosPage } from '../actualiza-datos/actualiza-datos';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DatosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})
export class DatosPage {
  /** Variable donde se almacenara los datos obtenidos del proveedor REST */
  public users: any =[];
  user;
  /** Variable correspondiente al id del documento, guarda el mismo valor que tiene el Proveedor de inicio de sesión */
  identificacion: string;
  /** Variable para administrar la ventana emergente del LoadingController */
  public loading;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider,
    public loadingCtrl: LoadingController, public storage:Storage) {
    
  }

  ionViewWillEnter() {
    this.iniciarLoadingPOPOVER();
    this.storage.get('sesionUser')
    .then((res)=>{this.user=res})
    .then(()=>{this.obtenerId()})
    .then(()=>{this.iniciarBusquedaDatos()})
  }
  /**
   * Este metodo inicia una ventana emergente de carga en espera de los datos de WS
   */  
  iniciarLoadingPOPOVER() {
    this.loading = this.loadingCtrl.create({

      spinner: 'hide',
      content: `<img src="assets/imgs/loading-POLI1.gif" />`,
    });
    console.log('Inicio de Spinner');
    this.loading.present();
  }

  obtenerId(){
    this.user.forEach(element =>{
      this.identificacion=element.numeroIdentificacion;
    })
  }

  /**
   * Este metodo hace la peticion al proveedor de la información del estudiante
   @param id corresponde al documento del estudiante a consultar.
   */
  iniciarBusquedaDatos(){
    this.restProvider.obtenerDatos(this.identificacion).then(results => {console.log(results); this.users = results['retorno']})
    .catch(err => {console.log(err.status+'Error de conexión');})
    .then(()=>{this.loading.dismiss()});
  }

  editar(campo){
    console.log(campo);
    this.navCtrl.push(ActualizaDatosPage, {key1:campo, key2:this.identificacion});
  }
  
  

}

