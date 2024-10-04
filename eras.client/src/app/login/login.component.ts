//LoginComponent
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../services/snackbar.service';
//import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 

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
    private router: Router,
    private snackBar: SnackBarService,
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
        console.log(response);

        localStorage.setItem('userRole', response.userRole);

        this.loading = false;
        this.router.navigate(['/dashboard']);
        this.snackBar.success(response.message, 'Close', 3000);
      },

       error: (error: HttpErrorResponse) => {
         console.error(error);
         this.snackBar.success(error.error.message, 'Close', 5000);
         this.loading = false;
        }
        }
      );
  }
}
