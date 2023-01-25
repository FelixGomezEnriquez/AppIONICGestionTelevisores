import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Televisor } from '../televisor';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  idTelevisorSelec: string;
  televisorEditando: Televisor;
  arrayColeccionTelevisores: any = [
    {
      id: '',
      data: {} as Televisor,
    },
  ];

  constructor(private firestoreService: FirestoreService, private router:Router) {
    this.televisorEditando = {} as Televisor;

    this.obtenerListaTelevisores();
  }

  clickBotonInsertar() {

    this.router.navigate(['/detalle', "nuevo"]);

  }

  obtenerListaTelevisores() {
    this.firestoreService
      .consultar('televisores')
      .subscribe((resultadoConsultaTelevisores) => {
        this.arrayColeccionTelevisores = [];
        resultadoConsultaTelevisores.forEach((datosTelevisor: any) => {
          this.arrayColeccionTelevisores.push({
            id: datosTelevisor.payload.doc.id,
            data: datosTelevisor.payload.doc.data()
          });
        });
      });
  }


  selecTelevisor(televisorSelec) {
    console.log("Televisor seleccionado: ");
    console.log(televisorSelec);
    this.idTelevisorSelec = televisorSelec.id;
    this.televisorEditando.marca = televisorSelec.data.marca;
    this.televisorEditando.pulgadas = televisorSelec.data.pulgadas;
    this.televisorEditando.calidadImagen = televisorSelec.data.calidadImagen;
    this.televisorEditando.pulgadas = televisorSelec.data.pulgadas;
    this.televisorEditando.incluye_mando = televisorSelec.data.incluye_mando;
    this.televisorEditando.tipo_de_pantalla= televisorSelec.data.tipo_de_pantalla;
    this.router.navigate(['/detalle', this.idTelevisorSelec]);
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("televisores", this.idTelevisorSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTelevisores();
      // Limpiar datos de pantalla
      this.televisorEditando = {} as Televisor;
    })
  }


  clicBotonModificar() {
    this.firestoreService.actualizar("televisores", this.idTelevisorSelec, this.televisorEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaTelevisores();
      // Limpiar datos de pantalla
      this.televisorEditando = {} as Televisor;
    })
  }

}
