import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { SimpleMarkerSymbol } from '@arcgis/core/symbols';
import Map from '@arcgis/core/Map';
import Graphic from '@arcgis/core/Graphic'; 
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  map: Map | any;

  constructor() {}

  async ngOnInit() {
    // Buat instance peta
    this.map = new Map({
      basemap: "topo-vector", // Default basemap (topographic)
    });

    this.mapView = new MapView({
      container: "container", // ID elemen HTML untuk map
      map: this.map,
      zoom: 8,
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceURL });
    this.map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);

    // Penambahan event listener untuk klik kanan (contextmenu)
    this.mapView.on("click", (event: any) => {
      if (event.button === 2) { // 2 untuk klik kanan
        this.showCoordinatesOnRightClick(event.mapPoint);
      }
    });
  }

  // Fungsi untuk menangani perubahan basemap dari dropdown (home.page.html)
  onBasemapChange(event: any) {
    const selectedBasemap = event.target.value;
    this.map.basemap = selectedBasemap;
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let geom = new Point({
      longitude: -80.04864979732648, //set koordinat manual
      latitude: 41.598256991280074,  
    });
  
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }

  // Fungsi untuk menampilkan koordinat ketika klik kanan di peta (muncul pop up)
  showCoordinatesOnRightClick(mapPoint: Point) {
    const latitude = mapPoint.latitude;
    const longitude = mapPoint.longitude;
    alert(`Koordinat: Latitude: ${latitude}, Longitude: ${longitude}`);
  }
  
}

const WeatherServiceURL = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';
