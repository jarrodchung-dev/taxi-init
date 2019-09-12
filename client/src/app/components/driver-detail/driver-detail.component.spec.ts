import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { ActivatedRoute, Data } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable, of } from "rxjs";
import { TripFactory } from "../../testing/factories";
import { DriverDetailComponent } from "./driver-detail.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TripService } from "../../services/trip.service";

describe("DriverDetailComponent", () => {
  let component: DriverDetailComponent;
  let fixture: ComponentFixture<DriverDetailComponent>;
  let tripService: TripService;
  const trip = TripFactory.create();

  class MockActivatedRoute {
    data: Observable<Data> = of({
      trip
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      declarations: [ DriverDetailComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        }
      ]
    });
    fixture = TestBed.createComponent( DriverDetailComponent );
    component = fixture.componentInstance;
    tripService = TestBed.get( TripService );
  });

  it("should update data on init", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.trip).toEqual( trip );
    });
    component.ngOnInit();
  }));

  it("should update trip status", () => {
    const spyUpdateTrip = spyOn( tripService, "updateTrip" );
    component.trip = TripFactory.create();
    component.updateTripStatus( "STARTED" );
    expect(spyUpdateTrip).toHaveBeenCalledWith( component.trip );
  });
});
