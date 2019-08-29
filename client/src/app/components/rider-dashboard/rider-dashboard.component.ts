import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Trip } from "../../services/trip.service";

@Component({
  selector: "app-rider-dashboard",
  templateUrl: "./rider-dashboard.component.html",
  styleUrls: ["./rider-dashboard.component.css"]
})
export class RiderDashboardComponent implements OnInit {
  trips: Trip[];
  // Passes route in as a reference to the "ActivatedRoute"
  constructor(private route: ActivatedRoute ) {}
  get currentTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.driver !== null && trip.status !== "COMPLETED";
    });
  }
  get completedTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.status === "COMPLETED";
    });
  }
  // Updates the trips property
  ngOnInit(): void {
    this.route.data.subscribe(
      (data: {trips: Trip[]}) => this.trips = data.trips);
  };
};
