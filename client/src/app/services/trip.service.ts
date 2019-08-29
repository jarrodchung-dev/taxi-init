import { Injectable } from "@angular/core";
import { User } from "./auth.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

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
      User.create(data.driver)
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
  // sends a request to the server and resolves the response as a list of Trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>("/api/trip").pipe(
    map(trips => trips.map(trip => Trip.create(trip)))
  );
  }
}
