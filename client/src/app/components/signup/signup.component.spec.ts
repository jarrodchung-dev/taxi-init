import {
  HttpClientTestingModule, 
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing"
import { FormsModule } from "@angular/forms";
import { UserFactory } from "../../testing/factories"
import { AuthService } from "../../services/auth.service";
import { User } from "../../services/auth.service";
import { SignUpComponent } from "./signup.component";


fdescribe("Sign Up Component", () => {
  // Adds instances of the SignUpComponent and HttpTestingController
  // aand ComponentFixture, a class for test cases
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let router: Router;
  let httpMock: HttpTestingController;
  // Initializes the configured testing variables
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ SignUpComponent ],
      providers: [ AuthService ]
    });
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
  });
  // Sets up a mock backend to interact with the "api/signup/" server API as 
  // expected
  it("should allow new users to sign up for an account", () => {
    const spy = spyOn(router, "navigateByUrl");
    const user = UserFactory.create();
    const photo = new File(["photo"], user.photo, {type: "image/jpeg"});
    component.user = {
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      password: "test_password",
      group: user.group,
      photo
    };
    // sends the component's user data to the server from data bindings found 
    //in the HTML componenr
    component.onSubmit();
    const request = httpMock.expectOne("/api/signup/");
    request.flush(user);
    expect(spy).toHaveBeenCalledWith("/login");
  });
});