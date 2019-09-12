import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TripService } from "./trip.service";
import { TripFactory } from "../testing/factories";

describe("TripService", () => {
  let tripService: TripService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ TripService ]
    });
    tripService = TestBed.get( TripService );
    httpMock = TestBed.get( HttpTestingController );
  });

  it("should allow users to trip lists", () => {
    const tripOne = TripFactory.create();
    const tripTwo = TripFactory.create();
    tripService.getTrips().subscribe( trips => {
      expect(trips).toEqual([ tripOne, tripTwo ]);
    });
    const request: TestRequest = httpMock.expectOne("/api/trip/");
    request.flush([ tripOne, tripTwo ]);
  });

  it("should allow users to create trips", () => {
    tripService.webSocket = jasmine.createSpyObj( "webSocket", ["next"] );
    const trip = TripFactory.create();
    tripService.createTrip( trip );
    expect(tripService.webSocket.next).toHaveBeenCalledWith({
      type: "create.trip",
      data: {
        ...trip, rider: trip.rider.id
    }});
  });

  it("should allow a user to get a trip by ID", () => {
    const tripData = TripFactory.create();
    tripService.getTrip(tripData.id).subscribe( trip => {
      expect(trip).toEqual( tripData );
    });
    const request: TestRequest = httpMock.expectOne(`/api/trip/${tripData.id}/`);
    request.flush( tripData );
  });

  it("should allow users to update trips", () => {
    tripService.webSocket = jasmine.createSpyObj( "webSocket", ["next"] );
    const trip = TripFactory.create({ status: "IN_PROGRESS" });
    tripService.updateTrip( trip );
    expect(tripService.webSocket.next).toHaveBeenCalledWith({
      type: "update.trip",
      data: {
        ...trip,
        driver: trip.driver.id,
        rider: trip.rider.id
      }
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});