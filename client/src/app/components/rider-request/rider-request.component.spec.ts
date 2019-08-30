import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiderRequestComponent } from './rider-request.component';
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { TripService } from "../../services/trip.service";
import { TripFactory } from "../../testing/factories";
import { Router } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";

fdescribe("Rider Request Component", () => {

  let component: RiderRequestComponent;
  let fixture: ComponentFixture<RiderRequestComponent>;
  let tripService: TripService;
  let router: Router;
    
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        FormsModule, 
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      declarations: [ RiderRequestComponent ]
    });
    fixture = TestBed.createComponent(RiderRequestComponent);
    component = fixture.componentInstance;
    tripService = TestBed.get(TripService);
    router = TestBed.get(Router);
  });
  
  it("should confirms rider request components are created", () => {
    expect(component).toBeTruthy();
  });
  
  it("should handle form submissions by users", () => {
    const spyCreateTrip = spyOn(tripService, "createTrip");
    const spyNavigateByUrl = spyOn(router, "navigateByUrl");
    component.trip = TripFactory.create();
    component.onSubmit();
    expect(spyCreateTrip).toHaveBeenCalledWith(component.trip);
    expect(spyNavigateByUrl).toHaveBeenCalledWith("/rider")
  });

});