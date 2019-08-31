import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../services/auth.service";
import { Trip, TripService } from "../../services/trip.service";
import { GoogleMapsService } from "../../services/google-maps.service";

class Marker {
  constructor(
    public lat: number,
    public lng: number,
    public label?: string
  ) {}
}
@Component({
  selector: "app-rider-request",
  templateUrl: "./rider-request.component.html",
  styleUrls: ["./rider-request.component.css"]
})
export class RiderRequestComponent implements OnInit {
  trip: Trip = new Trip();
  lat = 0;
  lng = 0;
  zoom = 13;
  markers: Marker[];
  
  constructor( 
    private googleMapsService: GoogleMapsService,
    private router: Router,
    private tripService: TripService
  ) {}
  
  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.markers = [ new Marker(this.lat, this.lng) ];
      });
    }
  }
  // When "onSubmit()" is called, "tripService" creates a trip from the
  // infomration, sends the trip information, while the user is redirected to
  // the Rider Dashboard view
  onSumbit(): void {
    this.trip.rider = User.getUser();
    this.tripService.createTrip(this.trip);
    this.router.navigateByUrl("/rider");
  }
  // Takes the address submitted by the user and calls the "directions()" 
  // functionn which updates the maps
  
  onUpdate(): void {
    if (!!this.trip.pickup_address && !!this.trip.dropoff_address ) {
      this.googleMapsService.directions(
        this.trip.pickup_address, this.trip.dropoff_address  
    // "subscribe()" initiates the Google Maps API
    ).subscribe((data: any) => {
      const route: any = data.routes[0];
      const leg: any = route.legs[0];
      this.lat = leg.start_location.lat();
      this.lng = leg.start_location.lng();
      this.markers = [
        {
          lat: leg.start_location.lat(),
          lng: leg.start_location.lng(),
          label: "A"
        },
        {
          lat: leg.end_location.lat(),
          lng: leg.end_location.lng(),
          label: "B"
        }
      ];
    });
  }};
};