import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Televisor } from '../televisor';
import { FirestoreService } from '../firestore.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string;
  document: any = {
    id: '',
    data: {} as Televisor,
  };
  nuevo: boolean;
  handlerMessage = '';
  roleMessage = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private loadingController: LoadingController,

    private alertController: AlertController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id == 'nuevo') {
      this.nuevo = true;
      this.document.data = {} as Televisor;
    } else {
      this.nuevo = false;

      this.firestoreService
        .consultarPorId('televisores', this.id)
        .subscribe((resultado) => {
          // Preguntar si se hay encontrado un document con ese ID
          if (resultado.payload.data() != null) {
            this.document.id = resultado.payload.id;
            this.document.data = resultado.payload.data();
            // Como ejemplo, mostrar el título de la tarea en consola
            console.log(this.document.data.marca);
          } else {
            // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
            this.document.data = {} as Televisor;
          }
        });
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¡¿Quieres borrar el televisor?!',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'SI',
          role: 'confirm',
          handler: () => {
            this.clicBotonBorrar();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }

  clicBotonBorrar() {
    this.firestoreService.borrar('televisores', this.id).then(() => {
      this.router.navigate(['/home']);
    });
  }

  clicBotonModificar() {
    this.firestoreService
      .actualizar('televisores', this.id, this.document.data)
      .then(() => {
        // Actualizar la lista completa
        this.router.navigate(['/home']);
      });
  }

  clickBotonInsertar() {
    this.firestoreService.insertar('televisores', this.document.data).then(
      () => {
        console.log('Televisor creado correctamente');
        // //Limpiamos el contenido de televisrorEditanto
        this.document.data = {} as Televisor;
      },
      (error) => {
        console.log(error);
      }
    );

    this.router.navigate(['/home']);
    this.presentToast('top');
  }

  async presentToast(position: 'top') {
    const toast = await this.toastController.create({
      message: 'Televisor añadido correctamente',
      duration: 1500,
      position: position,
      color: 'success',
    });

    await toast.present();
  }

  async uploadImagePicker() {
    const loading = await this.loadingController.create({
      message: 'please wait...',
    });

    const toast = await this.toastController.create({
      message: 'image was updated successfully',
      duration: 3000,
    });

    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          this.imagePicker
            .getPictures({
              maximumImagesCount: 1,
              outputType: 1,
            })
            .then(
              (results) => {
                let nombreCarpeta = 'imagenes';

                for (let i = 0; i < results.length; i++) {
                  loading.present();

                  let nombreImagen = `${new Date().getTime()}`;

                  this.firestoreService
                    .uploadImage(nombreCarpeta, nombreImagen, results[i])

                    .then((snapshot) => {
                      snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log('downloadURL:' + downloadURL);
                        toast.present();
                        loading.dismiss();
                      });
                    });
                }
              },
              (err) => {
                console.log(err);
              }
            );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  async deleteFile(fileURL){

    const toast = await this.toastController.create({
      message:"File was deleted sucesfully",
      duration: 3000
    });

    this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {

        toast.present();
      }, (err) => {
        console.log(err)

      });
  }
}
