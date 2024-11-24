import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar-main',
  templateUrl: './navbar-main.component.html',
  styleUrl: './navbar-main.component.css'
})
export class NavbarMainComponent {
  public fullName: string = '';
  public idEmployeeRole: number = 2;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.fullName = localStorage.getItem('fullname') || 'User';
    this.idEmployeeRole = parseInt(localStorage.getItem('id_employee_role') || '2', 10);
  }

  logout(): void {
    this.authService.logout();
  }

}
