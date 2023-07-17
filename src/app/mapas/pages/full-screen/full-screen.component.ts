import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
//import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.css']
})
export class FullScreenComponent implements OnInit{
  ngOnInit(): void {
    //(mapboxgl as any).accessToken= environment.mapboxToken
    var map= new mapboxgl.Map({
      container:'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center:[-2.9647692257274967,43.28455265787752],
      zoom:17

    });
  }
}
