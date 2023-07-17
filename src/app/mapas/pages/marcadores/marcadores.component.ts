import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  centro: [number, number] = [-2.9647692257274967, 43.28455265787752];
  marcadores: MarcadorColor[] = [];

  ngOnDestroy(): void {
    this.mapa.off('click', () => { });
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit', this.divMapa)
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centro,
      zoom: this.zoomLevel
    });
    this.leerLocalStorage();

    this.mapa.on('click', (ev) => {
      const micolor = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
      const mimarker = new mapboxgl.Marker({ color: micolor, draggable: true })
        .setLngLat(ev.lngLat)
        .addTo(this.mapa);
      this.marcadores.push({ color: micolor, marker: mimarker });
      this.guardarMarcadoresLocalStorage();
    })
    // const marker1= new mapboxgl.Marker()
    // .setLngLat(this.centro)
    // .addTo((this.mapa));
    // const el = document.createElement('div');
    // el.className = 'marker';
    // el.style.backgroundImage = "url('https://placekitten.com/g/40/40')";
    // el.style.width = '40px';
    // el.style.height = '40px';
    // el.style.backgroundSize = '100%';

    // el.addEventListener('click', () => {
    //   window.alert('Hola');
    // });

    // Add markers to the map.
    // new mapboxgl.Marker(el)
    //   .setLngLat(this.centro)
    //   .addTo(this.mapa);
  }

  leerLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return;
    }
    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({ color: m.color, draggable: true })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      });
      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });

      // newMarker.on('dragend', () => {
      //   this.guardarMarcadoresLocalStorage();
      // });    
    });
  }

  agregarMarcador() {
    const micolor = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    console.log(micolor);
    const nuevoMarcador = new mapboxgl.Marker({ draggable: true, color: micolor })
      .setLngLat(this.centro)
      .addTo(this.mapa);
    this.marcadores.push({ color: micolor, marker: nuevoMarcador });
    this.guardarMarcadoresLocalStorage();
    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });

  }

  irMarcador(marker: mapboxgl.Marker) {
    console.log(marker);
    this.mapa.flyTo({ center: marker.getLngLat() })
  };

  guardarMarcadoresLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach(m => {
      // extraigo la longitud y la latitud 
      const { lng, lat } = m.marker!.getLngLat();
      // ! confia en mi, siempre va a existir.
      lngLatArr.push({
        color: m.color,
        centro: [lng, lat]
      });
    })
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
    // serializo porque en el localstorage solo se pueden guardar string
  }

  borrarMarcador(i: number) {
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }

}
