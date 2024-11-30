import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LatLng, LatLngExpression, LatLngTuple, LeafletMouseEvent, Map } from 'leaflet';
import { LocationService } from '../../../services/location.service';
import { Order } from '../../../shared/models/Order';

@Component({
  selector: 'map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  
  @Input()
  order!:Order;
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly DEFAULT_LATLNG: LatLngTuple = [47.45, 26.3];
  private MARKER_ICON: any;

  @ViewChild('map', { static: true })
  mapRef!: ElementRef;
  map!: Map;
  currentMarker: any;

  constructor(private locationService: LocationService) {}

  async ngOnInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Lazy load for Leaflet
      const leaflet = await import('leaflet');
      
      // Define MARKER_ICON here after importing leaflet
      this.MARKER_ICON = leaflet.icon({
        iconUrl:
          'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
        iconSize: [42, 42],
        iconAnchor: [21, 42],
      });

      this.initializeMap(leaflet);
    }
  }

  private initializeMap(leaflet: any): void {
    if (this.map) return;

    this.map = leaflet.map(this.mapRef.nativeElement, {
      attributionControl: false,
    }).setView(this.DEFAULT_LATLNG, 1);

    leaflet.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e:LeafletMouseEvent) => {
      this.setMarker(e.latlng)
    })
  }

  findMyLocation() {
    this.locationService.getCurentLocation().subscribe({
      next: (latlng) => {
        if (this.map) {
          this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
          this.setMarker(latlng);
        }
      }
    });
  }

  async setMarker(latlng: LatLngExpression) {
    this.addressLatLng = latlng as LatLng;
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
      return;
    }

    // Utilizează marker-ul din obiectul leaflet importat lazy
    const leaflet = await import('leaflet');
    this.currentMarker = leaflet.marker(latlng, {
      draggable: true,
      icon: this.MARKER_ICON
    }).addTo(this.map);

    this.currentMarker.on('dragend', () =>{
      this.addressLatLng = this.currentMarker.getLatLng();
    })
  }

  set addressLatLng(latlng: LatLng){
    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    this.order.adressLatLng = latlng;
    console.log(this.order.adressLatLng)
  }
}
