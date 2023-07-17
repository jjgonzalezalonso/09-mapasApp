import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css']
})
export class ZoomRangeComponent implements AfterViewInit , OnDestroy{

  @ViewChild('mapa') divMapa!: ElementRef
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  centro: [number,number]=[-2.9647692257274967, 43.28455265787752];

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit', this.divMapa)
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centro,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom',() =>{
      this.zoomLevel=this.mapa.getZoom();
    })
    this.mapa.on('zoomend',() =>{
      if (this.mapa.getZoom()>18){
        this.mapa.zoomTo(18);
      };
    })
    this.mapa.on('move',(event) =>{
      const target = event.target;
      const {lng, lat} = target.getCenter();
      this.centro=[lng,lat]
    })

  }

  zoomOut() { 
    this.mapa.zoomOut(); 
    //this.zoomLevel = this.mapa.getZoom();
   }
  zoomIn() { 
    this.mapa.zoomIn(); 
    //this.zoomLevel = this.mapa.getZoom();
   }

   zoomCambio(valor: string){
    this.mapa.zoomTo(Number(valor));
   }

}
