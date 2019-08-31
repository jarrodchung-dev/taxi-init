import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiderRequestComponent } from "./rider-request.component";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { TripService } from "../../services/trip.service";
import { TripFactory } from "../../testing/factories";
import { Router } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AgmCoreModule } from "@agm/core";
import { GoogleMapsService } from "../../services/google-maps.service";

// Configure [ngModel] for the rider-request.component.html form input values

fdescribe("Rider Request Component", () => {

  let component: RiderRequestComponent;
  let fixture: ComponentFixture<RiderRequestComponent>;
  let tripService: TripService;
  let router: Router;
    
  class MockGoogleMapsService {}
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        FormsModule, 
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      declarations: [ RiderRequestComponent ],
      providers: [ 
        { provide: GoogleMapsService, useClass: MockGoogleMapsService }
      ]
    });
    fixture = TestBed.createComponent(RiderRequestComponent);
    component = fixture.componentInstance;
    tripService = TestBed.get(TripService);
    router = TestBed.get(Router);
  });
  
  it("should create the rider request component", () => {
    expect(component).toBeTruthy();
  });
  it("should handle requests made through form submissions", () => {
    const spyCreateTrip = spyOn(tripService, "createTrip");
    const spyNavigateByUrl = spyOn(router, "navigateByUrl");
    component.trip = TripFactory.create();
    component.onSumbit();
    expect(spyCreateTrip).toHaveBeenCalledWith(component.trip);
    expect(spyNavigateByUrl).toHaveBeenCalledWith("/rider");
  });
});
