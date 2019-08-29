import { Injectable } from "@angular/core";
import { 
  ActivatedRouteSnapshot, Resolve, RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { Trip, TripService } from "../services/trip.service";

// "TripListResolver" mocks "TripService" functionality so that instead
// of loading it all of the dependencies, by passing back an "Observable" object
// so that it returns only the "trip services" required

@Injectable()
export class TripListResolver implements Resolve<Trip[]> {
  constructor(private tripService: TripService) {}
  resolve(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot): Observable<Trip[]> {
      return this.tripService.getTrips();
    }
  }