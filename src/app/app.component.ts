import {Component} from '@angular/core';
import * as L from 'leaflet';
// @ts-ignore
import {objects} from "../assets/objects.js";
import {LeafletEvent} from "leaflet";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  map!: L.Map;
  selectedObject!: { objectData: { id: number, coords: number[][] }, leafObject: any };
  objectsOptions!: { objectData: { id: number, coords: number[][] }, leafObject: any }[];

  ngOnInit() {
    console.log(document.querySelector('#map'))
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.objectsOptions = [];
    objects.forEach((objectData: { id: number, coords: any }) => {
      let leafObjectInstance = undefined;
      if (objectData.coords.length === 1)
        leafObjectInstance = L.circle(objectData.coords)
      else
        leafObjectInstance = L.polygon(objectData.coords)
      leafObjectInstance.addTo(this.map)
      leafObjectInstance.on({click: this.onMapObjectClick})
      this.objectsOptions.push({objectData: objectData, leafObject: leafObjectInstance})
    })
    this.selectedObject = this.objectsOptions[0];
  }

  onSelect(){
    this.map.fitBounds(this.selectedObject.leafObject.getBounds())
  }

  onMapObjectClick(event:LeafletEvent){
    this.map.fitBounds(event.target.getBounds());
  }
}
