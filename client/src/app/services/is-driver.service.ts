import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";
import { User } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
// Function returns whether a user is a driver or not
export class IsDriver implements CanActivate {
  canActivate(): boolean {
    return User.isDriver();
  }
}