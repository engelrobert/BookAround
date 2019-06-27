import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

import { Locationdata } from '../../models/locationdata.model';
import { Location } from '../../models/location.model';

import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { GeoFireCollectionRef } from 'geofirex';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  geo = geofirex.init(firebaseApp);
  points: Observable<any>;
  locations: GeoFireCollectionRef;
  location: Observable<Location>;
  locationDoc: AngularFirestoreDocument<Location>;
  url: string;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    public http: HttpClient
  ) {
    this.locations = this.geo.collection('locations')
  }

  addLocation(locationdata: Locationdata) {
    const lat: number = this.auth.lat;
    const lng: number = this.auth.lng;
    const point = this.geo.point(lat, lng);
    const location: Location = { position: point.data, data: locationdata };
    return this.locations.setDoc(this.auth.userId, location);
  }

  updateLocation(locationdata: Locationdata) {
    const lat: number = this.auth.lat;
    const lng: number = this.auth.lng;
    const point = this.geo.point(lat, lng);
    const location: Location = { position: point.data, data: locationdata };
    return this.locations.setDoc(this.auth.userId, location);
  }

  deleteLocation() {
    return this.locations.delete(this.auth.userId);
  }

  getLocation() {    
    this.locationDoc = this.afs.doc<Location>(`locations/${this.auth.userId}`);
    return this.location = this.locationDoc.valueChanges().pipe(take(1));
  }

  getUserLocation(locationId) {    
    this.locationDoc = this.afs.doc<Location>(`locations/${locationId}`);
    return this.location = this.locationDoc.valueChanges().pipe(take(1));
  }

  getLocationChanges() {
    this.locationDoc = this.afs.doc<Location>(`locations/${this.auth.userId}`);
    return this.location = this.locationDoc.valueChanges();
  }

  queryLocation(lat, lng, radius) {
    const center = this.geo.point(lat, lng);
    const field = 'position';
    return this.locations.within(center, radius, field);
  }

  searchAddress(address){
    this.url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyCgC1hqe1DjyopCYJb56hLoVoU5ABaKhWg';
    return this.http.get(this.url);
  }
}
