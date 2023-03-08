import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  map: L.Map;

  constructor() {}

  ngOnInit() {}

  ionViewDidEnter() {
    console.log('OnviewDidEnter');
    this.loadMap();
  }

  loadMap() {
    console.log('loadMap');
    
    let latitud = 36.81433;
    let longitud = -5.747824;
    let zoom = 17;
    this.map = L.map('mapId').setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );


    var circle = L.circle([36.81433, -5.747824], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 30,
    }).addTo(this.map);
    var marker = L.marker([36.81433, -5.747824]).addTo(this.map);
    marker.bindPopup('<b>Tienda de televisores</b><br>Abierto de 9:00 a 14:00').openPopup();
    circle.bindPopup('Zona de aparcamiento');
  }
}
