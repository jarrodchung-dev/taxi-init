import { IsRider } from "./is-rider.service";
import { UserFactory } from "../testing/factories";

describe("IsRider", () => {
  it("should allow riders to access routes", () => {
    const isRider: IsRider = new IsRider();
    localStorage.setItem("taxi.user", JSON.stringify(
      UserFactory.create({ group: "rider" })
    ));
    expect(isRider.canActivate()).toBeTruthy();
  });

  it("should not allow non-riders to access routes", () => {
    const isRider: IsRider = new IsRider();
    localStorage.setItem("taxi.user", JSON.stringify(
      UserFactory.create({ group: "driver" })
    ));
    expect(isRider.canActivate()).toBeFalsy();
  });
});