import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Trip } from "../services/trip.service";
import { TripFactory } from "../testing/factories";
import { TripDetailResolver } from "./trip-detail.resolver";

fdescribe("Trip Detail Resolver", () => {
  it("should resolve trip details", () => {
    const tripMock: Trip = TripFactory.create();
    const tripServiceMock: any = {
      getTrip: (id: string): Observable<Trip> => {
        return new Observable<Trip>(observer => {
          observer.next(tripMock);
          observer.complete();
        });
      }
    };
    const tripDetailResolver: 
      TripDetailResolver = new TripDetailResolver(tripServiceMock);
    const route: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    route.params = {id: tripMock.id}
    tripDetailResolver.resolve(route, null).subscribe(
      trip => {expect(trip).toBe(tripMock);
    });
  });
});