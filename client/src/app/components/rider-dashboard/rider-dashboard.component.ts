import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Trip, TripService } from "../../services/trip.service";
import { Subscription } from "rxjs";
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
  selector: "app-rider-dashboard",
  templateUrl: "./rider-dashboard.component.html",
  styleUrls: ["./rider-dashboard.component.css"]
})
export class RiderDashboardComponent implements OnInit {
  messages: Subscription;
  trips: Trip[];

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private toastr: ToastrManager
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      ( data: { trips: Trip[] }) => this.trips = data.trips );
    this.tripService.connect();
    this.messages = this.tripService.messages.subscribe(( message: any ) => {
      const trip: Trip = Trip.create( message.data );
      this.updateTrips( trip );
      this.updateToast( trip );
    });
  }

  updateToast( trip: Trip ): void {
    if ( trip.status === "STARTED" ) {
      this.toastr.infoToastr(`${trip.driver.username} will be your driver.`);
    } else if ( trip.status === "IN_PROGRESS" ) {
      this.toastr.infoToastr(`${trip.driver.username} is dropping you off.`);
    } else if ( trip.status === "COMPLETED" ) {
      this.toastr.infoToastr(`${trip.driver.username} has dropped you off.`);
    }
  }

  get currentTrips(): Trip[] {
    return this.trips.filter( trip => {
      return trip.driver !== null && trip.status !== "COMPLETED";
    });
  }

  get completedTrips(): Trip[] {
    return this.trips.filter( trip => {
      return trip.status === "COMPLETED";
    });
  }

  updateTrips( trip: Trip ): void {
    this.trips = this.trips.filter( thisTrip => thisTrip.id !== trip.id );
    this.trips.push( trip );
  }

  ngOnDestroy(): void {
    this.messages.unsubscribe();
  }
}
