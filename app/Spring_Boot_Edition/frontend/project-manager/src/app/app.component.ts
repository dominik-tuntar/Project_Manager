import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project Manager';
  public isLoggedIn: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.logoutEvent.subscribe(() => {
      this.isLoggedIn = false;
    });
  }

  onLoginSuccess(): void {
    this.isLoggedIn = true;
  }

  loadingScreenTest(): void {
    for (let index = 0; index < 99999; index++) {
      console.log(index)
    }
  }
}
