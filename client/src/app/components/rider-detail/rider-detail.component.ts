import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Trip } from "../../services/trip.service";

@Component({
  selector: "app-rider-detail",
  templateUrl: "./rider-detail.component.html",
  styleUrls: ["./rider-detail.component.css"]
})
// Component only supports a single trip, which populates when the API resolves
export class RiderDetailComponent implements OnInit {
  trip: Trip;
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.data.subscribe(
      (data: {trip: Trip}) => this.trip = data.trip);
  }
}

