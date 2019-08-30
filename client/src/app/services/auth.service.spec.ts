import { TestBed } from "@angular/core/testing";
import { 
  HttpClientTestingModule, HttpTestingController 
} from "@angular/common/http/testing";
import { AuthService, User } from "./auth.service";
import { UserFactory } from "../testing/factories";

fdescribe("Auth Service", () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AuthService ]
    });
    authService = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
    // Allow new users to register
  it("should allow new users to create an account", () => {
    const userData = UserFactory.create();
    const photo: File = new File(
      ["photo"], userData.photo, {type: "image/jpeg"}
    );
    authService.signUp(
      userData.username,
      userData.first_name,
      userData.last_name,
      "test_password",
      userData.group,
      photo
    ).subscribe(user => {
      expect(user).toBe(userData);
    });
    const request = httpMock.expectOne("/api/login/");
    request.flush(userData);
  });
  it("should allow existing users to log into their accounts", () => {
    const userData = UserFactory.create();
    localStorage.clear();
    authService.logIn(
      userData.username,
      "test_password"
    ).subscribe(user => {
      expect(user).toBe(userData);
    });
    const request = httpMock.expectOne("/api/login/");
    request.flush(userData);
    expect(localStorage.getItem("taxi.user")).toBe(JSON.stringify(userData));
  });
  it("should allow users to log out of their accounts", () => {
    const userData = {};
    localStorage.setItem("taxi.user", JSON.stringify({}));
    authService.logOut().subscribe(user => {
      expect(user).toEqual(userData);
    });
    const request = httpMock.expectOne("/api/logout/");
    request.flush(userData);
    expect(localStorage.getItem("taxi.user")).toBeNull();
  });
  it("should determine if users are currently logged in", () => {
    localStorage.clear();
    expect(User.getUser()).toBeFalsy();
    localStorage.setItem("taxi.user", JSON.stringify(
      UserFactory.create()));
    expect(User.getUser()).toBeTruthy();
  });
});