import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DriverDashboardComponent } from "./driver-dashboard.component";
import { TripCardComponent } from "../../components/trip-card/trip-card.component";
import { Observable, of } from "rxjs";
import { TripFactory } from "../../testing/factories";
import { ActivatedRoute, Data } from "@angular/router";
import { TripService } from "../../services/trip.service";
import { ToastrModule } from "ng6-toastr-notifications";


describe("DriverDashboardComponent", () => {
  let component: DriverDashboardComponent;
  let fixture: ComponentFixture<DriverDashboardComponent>;
  const tripOne = TripFactory.create({ driver: null });
  const tripTwo = TripFactory.create({ status: "COMPLETED" });
  const tripThree = TripFactory.create({ status: "IN_PROGRESS" });

  class ModckActivatedRoute {
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
        DriverDashboardComponent,
        TripCardComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: ModckActivatedRoute
        },
        {
          provide: TripService,
          useClass: MockTripService
        }
      ]
    });
    fixture = TestBed.createComponent( DriverDashboardComponent );
    component = fixture.componentInstance;
  });

  it("should get current trips", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentTrips).toEqual( [tripThree] );
    });
    component.ngOnInit();
  }));

  it("should get requested trips", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.requestedTrips).toEqual( [tripOne] );
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