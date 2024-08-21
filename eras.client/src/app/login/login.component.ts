//LoginComponent
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
      PasswordHash: this.Password
    };

    this.http.post('/api/authentication/login', loginData, { responseType: 'text' })
      .subscribe(
        (response: any) => {
          console.log(response);
          this.router.navigate(['/dashboard']);
          this.loading = false;
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
