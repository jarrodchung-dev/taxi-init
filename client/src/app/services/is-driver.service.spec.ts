import { UserFactory } from "../testing/factories";
import { IsDriver } from "./is-driver.service";

fdescribe("Is Driver", () => {
  it("should allow drivers to access routes", () => {
    const isDriver: IsDriver = new IsDriver();
    localStorage.setItem("taxi.user", JSON.stringify(
      UserFactory.create({group: "driver"})
    ));
    expect(isDriver.canActivate()).toBeTruthy();
  });
  it("should not allow non-drivers to access a route", () => {
    const isDriver: IsDriver = new IsDriver();
    localStorage.setItem("taxi.user", JSON.stringify(
      UserFactory.create({group: "rider"})
    ));
    expect(isDriver.canActivate()).toBeFalsy();
  });
});

