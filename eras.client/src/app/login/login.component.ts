//LoginComponent
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../services/snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { GuacamoleVncService } from '../services/guacamole-vnc.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent{
  UserName: string = '';
  Password: string = '';
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackBarService,
    private guacamoleService: GuacamoleVncService,
  ) { }

  login() {
    this.loading = true;

    const loginData = {
      UserName: this.UserName,
      Password: this.Password
    };

    this.http.post('/api/authentication/login', loginData)
      .subscribe({
        next: (response: any) => {

          this.authService.setLogin(response.userRole, response.userId);

          this.loading = false;

          this.authenticate();
          this.router.navigate(['/dashboard']);
      },

       error: (error: HttpErrorResponse) => {
         console.error(error);
         this.snackBar.error(error.error.message, null, 3000);
         this.loading = false;
        }
        }
      );
  }

  async authenticate() {
    try {
      const response = await this.guacamoleService.authenticate();
      localStorage.setItem('authToken', response.authToken);
      localStorage.setItem('dataSource', response.dataSource);
      console.log('User authenticated with Guacamole server.');
    } catch (error) {
      console.error('Authentication failed', error);
      throw new Error('Authentication failed. Please try again.');
    }
  }
}
