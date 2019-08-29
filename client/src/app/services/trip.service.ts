import { Injectable } from "@angular/core";
import { User } from "./auth.service";
import { TripFactory } from "../testing/factories";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class Trip {
  constructor(
      public id?: string,
      public created?: string,
      public updated?: string,
      public pickup_address?: string,
      public dropoff_address?: string,
      public status?: string,
      public driver?: any,
      public rider?: any
    ) {}
  static create(data: any): Trip {
    return new Trip(
        data.id,
        data.created,
        data.updated,
        data.pickup_address,
        data.dropoff_address,
        data.status,
        data.driver ? User.create(data.driver) : null,
        User.create(data.rider)
      );
  }
}
@Injectable({
  providedIn: "root"
})
export class TripService {
  constructor(
      private http: HttpClient
    ) {}
  // "getTrips()": sends a request to the server and resolves the response by
  // returning a list of "Trip" objects containing the trip information
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>("/api/trips").pipe(
      map(trips => trips.map(trip => Trip.create(trip)))
    );
  }
}



// Using the public keyword on a property in the constructor tells ts compilers
// to allow outside access to it