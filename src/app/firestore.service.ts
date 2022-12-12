import { Injectable } from '@angular/core';
import { Televisor } from './televisor';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore) { }

  public insertar(coleccion:string, datos:Televisor){
    return this.angularFirestore.collection(coleccion).add(datos);
  }
  /**
   * name
   */
  public consultar(coleccion:string) {

    return this.angularFirestore.collection(coleccion).snapshotChanges();
    
  }


  

}
