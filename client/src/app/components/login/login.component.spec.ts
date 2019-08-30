import {
  HttpClientTestingModule, HttpTestingController
} from "@angular/common/http/testing";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { UserFactory } from "../../testing/factories";
import { AuthService } from "../../services/auth.service";
import { LogInComponent } from "../login/login.component";

fdescribe("Login Component", () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let router: Router;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ LogInComponent ],
      providers: [ AuthService ]
    });
    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    httpMock = TestBed.get(HttpTestingController);
  });
  it("should let existing users to login", () => {
    const spy = spyOn(router, "navigateByUrl");
    const user = UserFactory.create();
    component.user = UserFactory.create();
    component.user = {username: user.username, password: "test_password"};
    component.onSubmit();
    const request = httpMock.expectOne("http://localhost:8000/api/login/");
    request.flush(user);
    expect(localStorage.getItem("taxi.user")).toEqual(JSON.stringify(user));
    expect(spy).toHaveBeenCalledWith("");
  });
  afterEach(() => {
    httpMock.verify();
  });
});