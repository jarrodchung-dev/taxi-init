import { Component, } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

class UserData {
  constructor(
    public username?: string,
    public firstName?: string,
    public lastName?: string,
    public password?: string,
    public group?: string,
    public photo?: any
    ) {}
}

@Component({
  selector: "app-signup", // changed from "app-sign-up"
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignUpComponent {
  user: UserData = new UserData();
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}  
  onChange(event): void {
    if (event.target.files && event.target.files.length > 0) {
      this.user.photo = event.target.files[0];
    }
  }
  // Submits the form data ot the server via AuthService
  onSubmit(): void {
    this.authService.signUp(
      this.user.username,
      this.user.firstName,
      this.user.lastName,
      this.user.password,
      this.user.group,
      this.user.photo
    // Redirects the user to "login" page if registered successfully
    ).subscribe(() => {
      this.router.navigateByUrl("/login") // "/login"
    }, (error) => {
      console.error(error);
    });
  }
}