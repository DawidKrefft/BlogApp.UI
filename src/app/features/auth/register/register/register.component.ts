import { Component } from '@angular/core';
import { RegisterRequest } from '../../models/register-request.model';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  model: RegisterRequest;
  validationErrors: string[] = []; // Initialize an empty array to store validation errors

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.model = {
      email: '',
      password: '',
      // Other properties from your RegisterRequest model
    };
  }

  onFormSubmit(): void {
    this.authService.register(this.model).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        if (error.error && error.error.detail) {
          this.validationErrors = [error.error.detail];
        } else {
          this.validationErrors = ['An unknown error occurred.'];
        }
        console.error('Registration error:', error);
      },
    });
  }
}
