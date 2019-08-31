import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { ActivatedRoute, Data } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable, of } from "rxjs";
import { TripService } from "../../services/trip.service"; // new
import { TripFactory } from "../../testing/factories";
import { RiderDashboardComponent } from "./rider-dashboard.component";
import { ToastrModule } from "ng6-toastr-notifications";
import { 
  TripCardComponent
} from "../../components/trip-card/trip-card.component";

fdescribe("Rider Dashboard Component", () => {
  let component: RiderDashboardComponent;
  let fixture: ComponentFixture<RiderDashboardComponent>;
  const trip1 = TripFactory.create({driver: null});
  const trip2 = TripFactory.create({status: "COMPLETED"});
  const trip3 = TripFactory.create();

  class MockActivateRoute {
    data: Observable<Data> = of({
      trips: [trip1, trip2, trip3]
    });
  }
  
  class MockTripService {
    messages: Observable<any> = of();
    connect(): void {}
  }
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule.withRoutes([]), ToastrModule.forRoot() ],
      declarations: [
        RiderDashboardComponent,
        TripCardComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivateRoute },
        { provide: TripService, useClass: MockTripService }
      ]
    });
    fixture = TestBed.createComponent(RiderDashboardComponent);
    component = fixture.componentInstance;
  });
  
  it("should get current trips", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentTrips).toEqual([trip3])
    });
    component.ngOnInit();
  }));
  
  it("should get completed trips", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.completedTrips).toEqual([trip2]);
    });
    component.ngOnInit();
  }));
  
  it("should get completed trips", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.completedTrips).toEqual([trip2]);
    });
    component.ngOnInit();
  }));
});
