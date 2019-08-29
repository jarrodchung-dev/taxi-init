import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { User } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
// Service that only allows users in "rider" group can access guarded
// "riders" route
export class IsRider implements CanActivate {
  canActivate(): boolean {
    return User.isRider();
  }
}