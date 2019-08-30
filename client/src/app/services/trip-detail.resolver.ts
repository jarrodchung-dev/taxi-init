import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { 
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { Trip, TripService } from "../services/trip.service";


@Injectable({
  providedIn: "root"
})
export class TripDetailResolver implements Resolve<Trip>  {
  constructor(private tripService: TripService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<Trip> {
    return this.tripService.getTrip(route.params.id);
  }
}
