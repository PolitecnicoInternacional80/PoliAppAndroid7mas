import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DiaemergentePage } from '../diaemergente/diaemergente';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the HorarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-horario',
  templateUrl: 'horario.html',
})
export class HorarioPage {
  public user;  
  public identificacion:string;
  public day:string;
  public horario: any[];
  public facultades;
  public horarioDia;
  public loading;
  /**Variable con el programa seleccionado */
  public fac;
  public selectOptions;
  public cicloAcademico;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,
              public restProvider: RestProvider, public loadingCtrl: LoadingController, public storage: Storage) {
    this.selectOptions={
      title: 'Programas',
      subTitle: 'Seleccione una opción',
      mode: 'md',
    }
  }

  ionViewDidLoad() {
    this.iniciarLoadingPOPOVER();
  }

  ionViewWillEnter(){
    this.storage.get('sesionUser')
    .then((res)=>{this.user=res})
    .then(()=>{this.obtenerId()}) 
    .then(()=>{this.iniciarBusquedaHorario()})
    .catch(err=>err)
  }

  obtenerId(){
    this.user.forEach(element =>{
      this.identificacion=element.numeroIdentificacion;
    })
  }

  presentPopoverDia(day) {
    this.horarioDia=[];
    this.filtrarHorario(day, this.fac);
    switch(day){
      case "1" : day="Lunes"; break;
      case "2" : day="Martes"; break;
      case "3" : day="Miércoles"; break;
      case "4" : day="Jueves"; break;
      case "5" : day="Viernes"; break;
      case "6" : day="Sabado"; break;
    }
    const popover = this.popoverCtrl.create(DiaemergentePage, {key1:day, key3:this.horarioDia});
    popover.present();
  }

  iniciarLoadingPOPOVER(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="assets/imgs/loading-POLI1.gif" />`
    });
    this.loading.present();
  }

  iniciarBusquedaHorario(){
    this.restProvider.obtenerHorario(this.identificacion)
    .then((obj)=>{this.horario=obj['retorno'], console.log(obj)})
    .catch(err=> {err})
    .then(()=>{this.cargarFacultades();})
    .then(()=>{this.loading.dismiss()})
  }

  cargarFacultades(){    
    this.facultades=[];    
    this.horario.forEach(itemHorario=>{
      if(this.facultades.length==0){  
        this.facultades.push(itemHorario.nombrePlan);
        this.fac= itemHorario.nombrePlan;//Valor seleccionado por defecto para Lista de programas
        this.cicloAcademico= itemHorario.nombreCiclo;
      }else{
        if(!this.facultades.includes(itemHorario.nombrePlan)){
          this.facultades.push(itemHorario.nombrePlan);
        }
      }
    });
  }

  filtrarHorario(dia, facultad){
    this.horario.forEach(itemHorario => {
      if(itemHorario.diaNumeroAsignatura==dia && itemHorario.nombrePlan==facultad){
        this.horarioDia.push(itemHorario);
      }
    });    
    this.horarioDia.sort((a,b)=>{//Organizar el array del horario por hora
      if(a.horaInicialAsignatura<b.horaInicialAsignatura){
        return -1;
      }
      if(a.horaInicialAsignatura>b.horaInicialAsignatura){
        return 1;
      }
      return 0;
    });
  }
}