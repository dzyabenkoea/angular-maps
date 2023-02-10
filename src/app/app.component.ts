import {Component} from '@angular/core';
import * as L from 'leaflet';
// @ts-ignore
import {objects} from "../assets/objects.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  map!: L.Map;
  selectedObject!: { objectData: { id: number, coords: number[][] }, leafObject: any };
  objectsOptions!: { objectData: { id: number, coords: number[][] }, leafObject: any }[];
  prevSelectedObject!: any

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
      leafObjectInstance.on({
        click: (e) => {
          this.focusObject(e.target)
        }
      })
      this.objectsOptions.push({objectData: objectData, leafObject: leafObjectInstance})
    })
    this.map.setView([57.15163209165796, 65.53978475553994], 15);
    // this.selectedObject = this.objectsOptions[0];
    // this.map.fitBounds(this.selectedObject.leafObject.getBounds());
  }

  onSelect() {
    // this.map.fitBounds(this.selectedObject.leafObject.getBounds())
    this.focusObject(this.selectedObject.leafObject);
  }

  focusObject(leafObject: any) {

    const result = this.objectsOptions.find(option=>option.leafObject === leafObject)
    console.log(result);

    this.map.fitBounds(leafObject.getBounds(), {maxZoom: 18});
    leafObject.setStyle({color: "red"})
    if (this.prevSelectedObject) {
      this.prevSelectedObject.setStyle({color: "blue"})
    }
    this.prevSelectedObject = leafObject;
  }
}
