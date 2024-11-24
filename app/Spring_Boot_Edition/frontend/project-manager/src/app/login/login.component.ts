import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Service } from '../service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  public passwordMatch: number | null = null;

  @Output() loginSuccess: EventEmitter<void> = new EventEmitter<void>();
  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private service: Service) { }

  login(): void {
    const params = new HttpParams()
      .set('username', this.username)
      .set('password', this.password);

    this.http.post('https://localhost:8080/api/login', {}, { params })
      .subscribe(
        (response: any) => {
          if (response && response.token) {
            const username = response.employee.username;
            const fullname = response.employee.fullname;
            const id_employee_role = response.employee.idEmployeeRole;
            const id_employee = response.employee.idEmployee;
            this.authService.setToken(username, response.token, fullname, id_employee_role, id_employee);
            this.loginSuccess.emit();
            this.router.navigate(['/']);
            this.passwordMatch = null;
            this.logActivity(username, "logged", 'in');
          } else {
            this.passwordMatch = 0;
          }
        },
        (error) => {
          alert('Login failed: ' + (error?.error?.message || 'Unknown error.'));
        }
      );
  }

  public logActivity(username: string, db_action: string, db_object: string): void {
    this.service.logActivity(username, db_action, db_object)
      .subscribe(
        (response: any) => {

        },
        (error: any) => {
          alert(error);
        }
      );


  }

}
