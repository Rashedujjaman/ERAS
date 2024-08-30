//LoginComponent
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private snackBar: MatSnackBar
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
        this.snackBar.open(response.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['mat-primary']
        })
      },

       error: (error: HttpErrorResponse) => {
          console.error(error);
            this.snackBar.open(error.error.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            })
          this.loading = false;
        }
        }
      );
  }
}
