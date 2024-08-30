import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName: string = '';
  Name: string = '';
  Alias: string = '';
  userEmail: string = '';
  userRole: string = '';
  userPhotoUrl: string = 'assets/images/profile.jpg';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.profileDataFetch();
  }

  profileDataFetch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get('/api/profile/profile')
      .subscribe({
        next: (response: any) => {
          this.userName = response.profile.userName || '';
          this.Name = response.profile.name || '';
          this.Alias = response.profile.alias || '';
          this.userEmail = response.profile.email || '';
          this.userPhotoUrl = response.profile.photoUrl || this.userPhotoUrl;
          this.userRole = response.profile.userRole || '';
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching profile data:', error);
          this.errorMessage = 'Failed to load profile data. Please try again later.';
          this.loading = false;
          if (error.error.sessionOut === true) {
            this.router.navigate(['']);
            this.snackBar.open(error.error.message, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            })
          } else if (error.status === 404) {
            this.errorMessage = 'Profile not found.';
          } else if (error.status === 500) {
            this.errorMessage = 'An error occurred on the server. Please try again later.';
          }
        }
      });
  }

  logout() {
    this.http.post('/api/authentication/logout', {})
      .subscribe({
        next: (response: any) => {
          localStorage.removeItem('userRole');
          this.router.navigate(['']);
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          })
        },
        error: (error: any) => {
          console.error('Error logging out:', error);
        }
      });
  }
}
