// Angular Module Imports
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AgmCoreModule } from "@agm/core";
import { environment } from "../environments/environment";
import { ToastrModule } from "@ng6-toastr-notifications";
// Service Imports
import { AuthService } from "./services/auth.service";
import { TripService } from "./services/trip.service";
import { GoogleMapsService } from "./services/google-maps.service";
import { IsRider } from "./services/is-rider.service";
import { IsDriver } from "./services/is-driver.service";
import { TripListResolver } from "./services/trip-list.resolver";
import { TripDetailResolver } from "./services/trip-detail.resolver";
// Component Imports
import { AppComponent } from "./app.component";
import { SignUpComponent } from "./components/signup/signup.component";
import { LogInComponent } from "./components/login/login.component";
import { LandingComponent } from "./components/landing/landing.component";
import { RiderComponent } from "./components/rider/rider.component";
import { 
  RiderDashboardComponent 
} from "./components/rider-dashboard/rider-dashboard.component";
import { 
  RiderRequestComponent 
} from "./components/rider-request/rider-request.component";
import { 
  RiderDetailComponent
} from "./components/rider-detail/rider-detail.component";
import { TripCardComponent } from "./components/trip-card/trip-card.component";
import { DriverComponent } from "./components/driver/driver.component";
import { 
  DriverDashboardComponent 
} from "./components/driver-dashboard/driver-dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    LandingComponent,
    RiderComponent,
    RiderDashboardComponent,
    RiderRequestComponent,
    RiderDetailComponent,
    TripCardComponent,
    DriverComponent,
    DriverDashboardComponent,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({ apiKey: environment.GOOGLE_API_KEY }),
    RouterModule.forRoot([
      { path: "", component: LandingComponent },
      { path: "signup", component: SignUpComponent},
      { path: "login", component: LogInComponent },
      {
        path: "rider",
        component: RiderComponent,
        canActivate: [ IsRider ],
        children: [
          { path: "request", component: RiderRequestComponent },
          {
            path: ":id",
            component: RiderDetailComponent,
            resolve: { trip: TripDetailResolver }
          },
          {
            path: "",
            component: RiderDashboardComponent,
            resolve: { trips: TripListResolver }
          }
        ]
      },
      { 
        path: "driver", 
        component: DriverComponent,
        canActivate: [ IsDriver ],
        children: [
        {
          path: "",
          component: DriverDashboardComponent,
          resolve: { trips: TripListResolver }
        }]
     },
    ], { useHash: true }),
  ],
  providers: [
    AuthService,
    IsRider,
    IsDriver,
    TripService,
    TripListResolver,
    TripDetailResolver,
    GoogleMapsService
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }