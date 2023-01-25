import { Injectable } from '@angular/core';
import { Televisor } from './televisor';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore,
      private angularFireStorage: AngularFireStorage) {}

  public insertar(coleccion: string, datos: Televisor) {
    return this.angularFirestore.collection(coleccion).add(datos);
  }
  /**
   * name
   */
  public consultar(coleccion: string) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public borrar(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public actualizar(coleccion, documentId, datos) {
    return this.angularFirestore
      .collection(coleccion)
      .doc(documentId)
      .set(datos);
  }

  public consultarPorId(coleccion, documentId) {
    return this.angularFirestore
      .collection(coleccion)
      .doc(documentId)
      .snapshotChanges();
  }

  public uploadImage(nombreCarpeta,nombreArchivo, imagenBase64){
    let storageRef= 
    this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo)
    return storageRef.putString("data:iamge/jpeg;base64,"+imagenBase64,'data_rul');

  }

  public deleteFileFromURL(fileURL) {

    return this.angularFireStorage.storage.refFromURL(fileURL).delete();
    
  }
  
}
