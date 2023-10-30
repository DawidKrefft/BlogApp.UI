import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { environment } from 'src/environments/environment';
import { RegisterRequest } from '../models/register-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.apiBaseUrl;
  private readonly userStorageKey = 'user-email';
  private readonly rolesStorageKey = 'user-roles';

  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  register(request: RegisterRequest): Observable<string> {
    const registerUrl: string = `${this.baseUrl}/api/auth/register`;

    return this.http.post<string>(registerUrl, {
      email: request.email,
      password: request.password,
    });
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    const loginUrl: string = `${this.baseUrl}/api/auth/login`;

    return this.http.post<LoginResponse>(loginUrl, {
      email: request.email,
      password: request.password,
    });
  }

  setUser(user: User): void {
    this.$user.next(user);
    localStorage.setItem(this.userStorageKey, user.email);
    localStorage.setItem(this.rolesStorageKey, user.roles.join(','));
  }

  user(): Observable<User | undefined> {
    return this.$user.asObservable();
  }

  getUser(): User | undefined {
    const email = localStorage.getItem(this.userStorageKey);
    const roles = localStorage.getItem(this.rolesStorageKey);

    if (email && roles) {
      const user: User = {
        email: email,
        roles: roles.split(','),
      };

      return user;
    }

    return undefined;
  }

  logout(): void {
    localStorage.removeItem(this.userStorageKey);
    localStorage.removeItem(this.rolesStorageKey);
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }
}
