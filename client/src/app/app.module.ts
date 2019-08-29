// AngularJS Module Imports
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
// Service Imports
import { AuthService } from "./services/auth.service";
// Component Imports
import { AppComponent } from "./app.component";
import { SignUpComponent } from "./components/signup/signup.component";
import { LogInComponent } from "./components/login/login.component";
import { LandingComponent } from "./components/landing/landing.component";


@NgModule({
  declarations: [ 
    AppComponent, 
    SignUpComponent, 
    LogInComponent, 
    LandingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    // RouterModule maps each component to a unique path
    RouterModule.forRoot([
      { path: "singup", component: SignUpComponent },
      { path: "login", component: LogInComponent },
      { path: "", component: LandingComponent }
      ], { useHash: true })
    ],
  providers: [ AuthService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }