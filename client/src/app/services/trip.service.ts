import { Injectable } from "@angular/core";
import { User } from "./auth.service";
import { TripFactory } from "../testing/factories";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { WebSocketSubject } from "rxjs/webSocket";
import { map, share } from "rxjs/operators";

export class Trip {
  // "otherUser" refers to a "driver" if a user is "rider" and vice-versa
  public otherUser: User;
  constructor(
      public id?: string,
      public created?: string,
      public updated?: string,
      public pickup_address?: string,
      public dropoff_address?: string,
      public status?: string,
      public driver?: any,
      public rider?: any
    ) {
      this.otherUser = User.isRider() ? this.driver : this.rider;
    }
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
  
  // Adds and instantiates the instance variables
  webSocket: WebSocketSubject<any>;
  messages: Observable<any>;
  
  constructor( private http: HttpClient ) {}
  
  // Creates "webSocket" object when rider submit a new request
  connect(): void {
    if (!this.webSocket || this.webSocket.closed) {
      this.webSocket = new WebSocketSubject("ws://localhost:8000/taxi/");
      this.messages = this.webSocket.pipe(share());
      this.messages.subscribe(message => console.log(message));
    }
  }  
  // Store the rider's trip request as "Trip" object
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>("/api/trip/").pipe(
      map(trips => trips.map(trip => Trip.create(trip)))
    );
  }
  // Pushes the "Trip" to the server where "drivers" can access it
  createTrip(trip: Trip): void {
    this.connect();
    const message: any = {
      type: "create.trip",
      data: { ...trip, rider: trip.rider.id }
    };
    this.webSocket.next(message);
  };
  // Takes an "natural key" input parameter and returns a single "Trip" 
  // object from the server
  getTrip(id: string): Observable<Trip> {
    return this.http.get<Trip>(`/api/trip/${id}/`).pipe(
      map(trip => Trip.create(trip))  
    );
  }
}

// Using the public keyword on a property in the constructor tells ts compilers
// to allow outside access to it