import { Observable, of } from "rxjs";
import { Trip } from "../services/trip.service";
import { TripListResolver } from "./trip-list.resolver";
import { TripFactory } from "../testing/factories";

describe("Trip List Resolver", () => {
  it("should resolve a list of trips", () => {
    const tripsMock: Trip[] = [
      TripFactory.create(),
      TripFactory.create()
    ];
    const tripServieMock: any = {
      getTrips: (): Observable<Trip[]> => {
        return of(tripsMock);
      }
    };
    const tripListResolver: 
      TripListResolver = new TripListResolver(tripServieMock);
    tripListResolver.resolve(null, null).subscribe(trips => {
      expect(trips).toBe(tripsMock);
    });
  });
});