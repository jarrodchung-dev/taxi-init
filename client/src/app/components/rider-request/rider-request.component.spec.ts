import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { RiderRequestComponent } from "./rider-request.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { TripService } from "../../services/trip.service";
import { TripFactory } from "../../testing/factories";
import { AgmCoreModule } from "@agm/core";
import { GoogleMapsService } from "../../services/google-maps.service";


describe("RiderRequestComponent", () => {
  let component: RiderRequestComponent;
  let fixture: ComponentFixture<RiderRequestComponent>
  let tripService: TripService;
  let router: Router;

  class MockGoogleMapsService {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        AgmCoreModule.forRoot({})
      ],
      declarations: [ RiderRequestComponent ],
      providers: [
        {
          provide: GoogleMapsService,
          useClass: MockGoogleMapsService
        }
      ]
    });
    fixture = TestBed.createComponent( RiderRequestComponent );
    component = fixture.componentInstance;
    tripService = TestBed.get( TripService );
    router = TestBed.get( Router );
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should handle form submissions", () => {
    const spyCreateTrip = spyOn( tripService, "createTrip" );
    const spyNavigateByUrl = spyOn( router, "navigateByUrl" );
    component.trip = TripFactory.create();
    component.onSubmit();
    expect(spyCreateTrip).toHaveBeenCalledWith(component.trip);
    expect(spyNavigateByUrl).toHaveBeenCalledWith("/rider");
  });

});