import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/api.service';
import { DemoAuthService } from '../core/demo-auth.service';
import { LoginRequest, UserRole } from '../models';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  role: UserRole = 'STUDENT';

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly apiService: ApiService,
    private readonly auth: DemoAuthService,
    private readonly router: Router
  ) {}

  login() {
    if (!this.email || !this.password || !this.role) {
      this.errorMessage = 'Please enter your email, password, and role.';
      return;
    }

    const request: LoginRequest = {
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.apiService.login(request).subscribe({
      next: user => {
        this.auth.setCurrentUser(user);
        const targetRoute = user.role === 'STUDENT' ? '/student' : '/teacher';
        this.router.navigateByUrl(targetRoute);
      },
      error: error => {
        this.isSubmitting = false;

        if (error.status === 401) {
          this.errorMessage = 'Invalid email, password, or role.';
          return;
        }

        this.errorMessage = 'Unable to log in right now. Please try again.';
      }
    });
  }
}
