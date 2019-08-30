import {
 HttpClientTestingModule, HttpTestingController, TestRequest
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TripService } from "./trip.service";
import { TripFactory } from "../testing/factories";


fdescribe("Trip Service", () => {
  
  let tripService: TripService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ TripService ]
    });
    tripService = TestBed.get(TripService);
    httpMock = TestBed.get(HttpTestingController);
  });
  
  it("should allow users to retrieve a list of trip information", () => {
 
    const trip1 = TripFactory.create();
    const trip2 = TripFactory.create();
    tripService.getTrips().subscribe(trips => {
      expect(trips).toEqual([trip1, trip2])
    });
    const request: TestRequest = httpMock.expectOne("/api/trip/");
    request.flush([
      trip1, 
      trip2
    ]);
  });
  
  it("should allow a user to create a trip", () => {
    tripService.webSocket = jasmine.createSpyObj("websocket", ["next"]);
    const trip = TripFactory.create();
    tripService.createTrip(trip);
    expect(tripService.webSocket.next).toHaveBeenCalledWith({
      type: "create.trip",
      data: { ...trip, rider: trip.rider.id }
    });
  });
  
  it("should allow a user to get a trip by ID", () => {
    const tripData = TripFactory.create();
    tripService.getTrip(tripData.id).subscribe(trip => {
      expect(trip).toEqual(tripData);
    });
    const request: 
      TestRequest = httpMock.expectOne(`/api/trip/${tripData.id}/`);
    request.flush(tripData);
  });
  
  
  afterEach(() => {
    httpMock.verify();
  });
  
});

// Angular's HttpClient returns an "Observable" object that triggers an HTTP
// when an object is subscribed to it