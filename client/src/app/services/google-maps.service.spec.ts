import { TestBed } from "@angular/core/testing";
import { GoogleMapsService } from "./google-maps.service";

fdescribe("Google Maps Service", () => {
  let googleMapsService: GoogleMapsService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ GoogleMapsService ]
    });
    googleMapsService = TestBed.get(GoogleMapsService);
  });
  it("should exist within the application", () => {
    expect(googleMapsService).toBeTruthy();
  });
});
