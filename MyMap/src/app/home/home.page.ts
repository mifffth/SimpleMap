import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  latitude: number;
  longitude: number;

  constructor() {
    this.longitude = 110.377364; // Longitude UGM
    this.latitude = -7.770639;   // Latitude UGM
  }

  public async ngOnInit() {
    // Buat instance peta
    const map = new Map({
      basemap: "topo-vector"
    });

    const view = new MapView({
      container: "container",
      map: map,
      zoom: 15,
      center: [this.longitude, this.latitude]
    });

    // Buat marker di lokasi UGM
    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    const markerSymbol = new SimpleMarkerSymbol({
      color: [226, 119, 40],  // Warna marker
      outline: {
        color: [255, 255, 255], // Warna outline
        width: 2
      }
    });

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol
    });

    // Tambahkan marker ke view
    view.graphics.add(pointGraphic);

    // Dapatkan posisi saat ini (opsional)
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
  }
}
