import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RiderDashboardComponent } from './rider-dashboard.component';
import { ActivatedRoute, Data } from "@angular/router";
import { Observable, of } from "rxjs";
import { TripFactory } from "../../testing/factories";

// Creates a "MockActivatedRoute" inside the test suite to patch to the 
// "ActivatedRoute" thta gets injeted into the "RiderDashboardComponent".

describe('RiderDashboardComponent', () => {
  let component: RiderDashboardComponent;
  let fixture: ComponentFixture<RiderDashboardComponent>;
  const trip1 = TripFactory.create({driver: null});
  const trip2 = TripFactory.create({status: "COMPLETED"});
  const trip3 = TripFactory.create();
  
  class MockActivatedRoute {
    data: Observable<Data> = of({
      trips: [trip1, trip2, trip3]
      });
    }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderDashboardComponent ],
      providers: [{
        provide: ActivatedRoute, useClass: MockActivatedRoute
      }]
    });
    fixture = TestBed.createComponent(RiderDashboardComponent);
    component = fixture.componentInstance;
  });
  it("should retrieve current trip information", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentTrips).toEqual([trip3]);
    });
    component.ngOnInit();
  }));
  it("should get completed trips", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.completedTrips).toEqual([trip2]);
    });
    component.ngOnInit()
  }));    
});
    