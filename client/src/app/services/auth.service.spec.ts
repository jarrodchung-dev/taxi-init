import { TestBed } from "@angular/core/testing";
import { AuthService, User } from "./auth.service";
import { UserFactory } from "../testing/factories";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";


describe("AuthService", () => {
  let authService: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [],
      providers: [ AuthService ]
    });
    authService = TestBed.get(AuthService);
  });
  it("should be created", () => {
    expect(authService).toBeTruthy();
  });
});

describe("Authentication using a service", () => {
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

  it("should allow users to sign up for new accounts", () => {
    const user = UserFactory.create();
    const photo: File = new File( ["photo"], user.photo, {type: "image/jpeg"});

    authService.signUp(
      user.username,
      user.first_name,
      user.last_name,
      "test_password",
      user.group,
      photo
    ).subscribe( user => {
      expect( user ).toBe( user )
    });
    const request = httpMock.expectOne("/api/sign_up/");
    request.flush( user );
  });

  it("should allow users to log in to existing accounts", () => {
    const user = UserFactory.create();
    localStorage.clear();
    authService.logIn(
      user.username,
      "test_password"
    ).subscribe( user => {
      expect( user ).toBe( user );
    });
    const request = httpMock.expectOne("/api/log_in/")
    request.flush( user );
    expect(localStorage.getItem("taxi.user")).toBe(JSON.stringify(user));
  });

  it("should allow users to log out", () => {
    const user = {};
    localStorage.setItem( "taxi.user", JSON.stringify({}) );
    authService.logOut().subscribe( user => {
      expect( user ).toEqual( user );
    });
    const request = httpMock.expectOne("/api/log_out/");
    request.flush( user );
  })

  it("should determine when users are logged in", () => {
    localStorage.clear();
    expect( User.getUser() ).toBeFalsy();
    localStorage.setItem("taxi.user", JSON.stringify(
      UserFactory.create()
    ));
    expect( User.getUser() ).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

});