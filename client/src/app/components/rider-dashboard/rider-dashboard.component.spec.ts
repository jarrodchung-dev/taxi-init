import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { ActivatedRoute, Data } from "@angular/router";
import { Observable, of } from "rxjs";
import { RiderDashboardComponent } from "./rider-dashboard.component";
import { TripFactory } from "../../testing/factories";
import { RouterTestingModule } from "@angular/router/testing";
import { TripCardComponent } from "../../components/trip-card/trip-card.component";
import { TripService } from "../../services/trip.service";
import { ToastrModule } from "ng6-toastr-notifications";

describe("RiderDashboardComponent", () => {
  let component: RiderDashboardComponent;
  let fixture: ComponentFixture<RiderDashboardComponent>;
  const tripOne = TripFactory.create({ driver: null });
  const tripTwo = TripFactory.create({ status: "COMPLETED" });
  const tripThree = TripFactory.create();

  class MockActivatedRoute {
    data: Observable<Data> = of({
      trips: [ tripOne, tripTwo, tripThree ]
    });
  }

  class MockTripService {
    messages: Observable<any> = of();
    connect(): void {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ToastrModule.forRoot()
      ],
      declarations: [
       RiderDashboardComponent,
       TripCardComponent
     ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: TripService,
          useClass: MockTripService
        }
      ]
    });
    fixture = TestBed.createComponent( RiderDashboardComponent );
    component = fixture.componentInstance;
  });

  it("should get current trips", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentTrips).toEqual( [tripThree] )
    });
    component.ngOnInit();
  }));

  it("should get completed trips", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.completedTrips).toEqual( [tripTwo] );
    });
    component.ngOnInit();
  }));
});