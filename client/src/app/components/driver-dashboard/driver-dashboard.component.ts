import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Trip } from "../../services/trip.service";

// Driver Dashboard has a "Current Trip" and "Rececnt Trips" panel
// Unlike the rider dashbaord, the driver dashboard sohld have additional 
// panels for "Requested Trips". 
// Whenever a rider requests a trip, the details of the request will appear
// in the driver dashboard panel so they only see requests that have not been 
// accepted by any other drivers

@Component({
  selector: "app-driver-dashboard",
  templateUrl: "./driver-dashboard.component.html",
  styleUrls: ["./driver-dashboard.component.css"]
})
export class DriverDashboardComponent implements OnInit {
  trips: Trip[];
  constructor(private route: ActivatedRoute) {}
  
  get currentTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.driver !== null && trip.status !== "COMPLETED";
    });
  }
  
  get requestedTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.status === "REQUESTED";
    });
  }
  get completedTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.status === "COMPLETED";
    });
  }
  ngOnInit(): void {
    this.route.data.subscribe(
      (data: {trips: Trip[]}) => this.trips = data.trips);
  }
}