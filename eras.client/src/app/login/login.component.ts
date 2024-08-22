//LoginComponent
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  constructor(private http: HttpClient, private router: Router) { }
  login() {
    this.loading = true;

    const loginData = {
      UserName: this.UserName,
      Password: this.Password
    };

    this.http.post('/api/authentication/login', loginData)
      .subscribe(
        (response: any) => {
          console.log(response);

          localStorage.setItem('userRole', response.userRole);

          console.log(localStorage.getItem('userRole'));
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },

        (error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 401) {
            alert('Invalid username or password.');
          } else {
            alert(`An error occurred: ${error.message}`);
          }
          this.loading = false;
        }
      );
  }
}
