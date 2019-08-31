import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// Angular Google Maps adds an asynchronous call to load the Google Maps API

// Defines a global environment variable not explicitly defined in the code
declare var google: any;

@Injectable()
export class GoogleMapsService {
  constructor() {}
  
  // Creates an Observable object which calls the Google Maps API
  directions(
      pickupAddress: string,
      dropoffAddress: string,
    ): Observable<any> {
    const request: any = {
      origin: pickupAddress,
      destination: dropoffAddress,
      travelMode: "DRIVING"
    };
    const directionService = new google.maps.DirectionsService();
    return Observable.create(observer => {
      directionService.route(request, (result, status) => {
        if (status === "OK") { 
          observer.next(result);
        } else {
          observer.error("Please use two valid addresses");
        }
        observer.complete();
      });
    });
  }}
