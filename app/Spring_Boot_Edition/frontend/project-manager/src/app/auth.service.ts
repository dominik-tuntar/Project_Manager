import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiServerUrl = 'https://localhost:8080';
  private inactivityTimeout: any;
  private readonly INACTIVITY_LIMIT = 900000;
  public logoutEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router, private http: HttpClient) {
    if (localStorage.getItem('token')) {
      this.startInactivityTimer();
    }
  }

  public login(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.apiServerUrl}/api/login`, body, { headers });
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.logoutEvent.emit();
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  public setToken(username: string, token: string, fullname: string, id_employee_role: number, id_employee: number): void {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('fullname', fullname);
    localStorage.setItem('id_employee_role', id_employee_role.toString());
    localStorage.setItem('id_employee', id_employee.toString());
    this.startInactivityTimer();
  }

  private startInactivityTimer(): void {
    this.resetInactivityTimer();
    const resetTimer = () => this.resetInactivityTimer();

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
  }

  private resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);

    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, this.INACTIVITY_LIMIT);
  }
}
