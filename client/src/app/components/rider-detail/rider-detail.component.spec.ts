import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RiderDetailComponent } from './rider-detail.component';
import { ActivatedRoute, Data } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable, of } from "rxjs";
import { TripFactory } from "../../testing/factories";


fdescribe("Rider Detail Component", () => {
  let component: RiderDetailComponent;
  let fixture: ComponentFixture<RiderDetailComponent>;
  const trip = TripFactory.create();
  
  class MockActivateRoute {
    data: Observable<Data> = of({
      trip
    });
  }
  beforeEach(() => {
     TestBed.configureTestingModule({
       imports: [ RouterTestingModule.withRoutes([]) ],
       declarations: [ RiderDetailComponent ],
       providers: [
       { provide: ActivatedRoute, useClass: MockActivateRoute }
       ],
     });
     fixture = TestBed.createComponent(RiderDetailComponent);
     component = fixture.componentInstance;
  });
  it("should udpate data on initialization", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.trip).toEqual(trip);
    });
    component.ngOnInit();
  }));
});