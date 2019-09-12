// Modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AgmCoreModule } from "@agm/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ng6-toastr-notifications";
// Environment
import { environment } from "../environments/environment";
// Services
import { AuthService } from "./services/auth.service";
import { IsRider } from "./services/is-rider.service";
import { IsDriver } from "./services/is-driver.service";
import { TripService } from "./services/trip.service";
import { GoogleMapsService } from "./services/google-maps.service";
// Resolvers
import { TripListResolver } from "./services/trip-list.resolver";
import { TripDetailResolver } from "./services/trip-detail.resolver";
// Components
import { AppComponent } from "./app.component";
import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { LogInComponent } from "./components/log-in/log-in.component";
import { LandingComponent } from "./components/landing/landing.component";
import { RiderComponent } from "./components/rider/rider.component";
import {
  RiderDashboardComponent
} from "./components/rider-dashboard/rider-dashboard.component";
import {
  RiderRequestComponent
} from "./components/rider-request/rider-request.component";
import { RiderDetailComponent } from "./components/rider-detail/rider-detail.component";
import { TripCardComponent } from "./components/trip-card/trip-card.component";
import { DriverComponent } from "./components/driver/driver.component";
import {
  DriverDashboardComponent
} from "./components/driver-dashboard/driver-dashboard.component";
import {
  DriverDetailComponent
} from "./components/driver-detail/driver-detail.component";


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
    DriverDetailComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: environment.GOOGLE_API_KEY }),
    HttpClientModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(
      [
        { path: "sign-up", component: SignUpComponent },
        { path: "log-in", component: LogInComponent },
        { path: "", component: LandingComponent },
        {
          path: "rider",
          component: RiderComponent,
          canActivate: [ IsRider ],
          children: [
            {
              path: "",
              component: RiderDashboardComponent,
              resolve: { trips: TripListResolver }
            },
            {
              path: "request",
              component: RiderRequestComponent
            },
            {
              path: ":id",
              component: RiderDetailComponent,
              resolve: { trip: TripDetailResolver }
            },
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
            },
            {
              path: ":id",
              component: DriverDetailComponent,
              resolve: { trip: TripDetailResolver }
            }
          ]
        },
      ], { useHash: true }
    )
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