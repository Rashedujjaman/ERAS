import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../services/snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResetPasswordDialogComponent } from '../resetpassworddialog/resetpassworddialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatDialogModule, ResetPasswordDialogComponent, ReactiveFormsModule, FormsModule, MatFormFieldModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  userId: string = '';
  userName: string = '';
  name: string = '';
  alias: string = '';
  userEmail: string = '';
  userRole: string = '';
  userPhotoUrl: string = 'assets/images/profile.jpg';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: SnackBarService,
    private dialogBox: MatDialog
  ) { }


  ngOnInit(): void {
    this.profileDataFetch();
    this.profileForm = this.formBuilder.group({
      UserName: new FormControl<string | null>(null, [Validators.required]),
      Name: new FormControl<string | null>(null, [Validators.required]),
      Alias: new FormControl<string | null>(null, [Validators.required]),
      Email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    });
  }

  profileDataFetch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get('/api/profile/profile')
      .subscribe({
        next: (response: any) => {
          this.userId = response.profile.userId;
          this.userName = response.profile.userName || '';
          this.name = response.profile.name || '';
          this.alias = response.profile.alias || '';
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
            this.snackBar.error(error.error.message, 'Close')
          } else if (error.status === 404) {
            this.errorMessage = 'Profile not found.';
          } else if (error.status === 500) {
            this.errorMessage = 'An error occurred on the server. Please try again later.';
          }
        }
      });
  }

  resetPassword() {
    this.dialogBox.open(ResetPasswordDialogComponent, {
      width: '400px',
      data: {
        userId: this.userId,
        userName: this.userName
      }
    });
  }

  logout() {
    this.http.post('/api/authentication/logout', {})
      .subscribe({
        next: (response: any) => {
          localStorage.removeItem('userRole');
          this.router.navigate(['']);
          this.snackBar.success(response.message, 'Close', 3000);
        },
        error: (error: any) => {
          console.error('Error logging out:', error);
        }
      });
  }
}
