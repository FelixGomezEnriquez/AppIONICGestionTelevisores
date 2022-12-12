import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Televisor } from '../televisor';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  televisorEditando: Televisor;
  arrayColeccionTelevisores: any = [
    {
      id: '',
      data: {} as Televisor,
    },
  ];

  constructor(private firestoreService: FirestoreService) {
    this.televisorEditando = {} as Televisor;

    this.obtenerListaTelevisores();
  }

  clickBotonInsertar() {
    this.firestoreService.insertar('televisores', this.televisorEditando).then(
      () => {
        console.log('Televisor creado correctamente');
        //Limpiamos el contenido de televisrorEditanto
        this.televisorEditando = {} as Televisor;
      },
      (error) => {
        console.log(error);
      }
    );
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
}
