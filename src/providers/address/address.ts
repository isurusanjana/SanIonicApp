import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HTTP} from "@ionic-native/http";

/*
  Generated class for the AddressProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var google: any;
@Injectable()
export class AddressProvider {

  constructor(private http: HTTP,) {
    console.log('Hello AddressProvider Provider');
  }

  getAddress(data){
    let geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      geocoder.geocode({'location': {lat: data.lat, lng: data.lng}}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            //console.log(results[0].formatted_address);
            observer.next(results[0].formatted_address);
            observer.complete();
          } else {
            observer.next("");
            observer.complete();
          }
        } else {
          observer.next("");
          observer.complete();
        }
      });
    });
  }

}
