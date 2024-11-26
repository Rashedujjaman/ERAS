import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCamera, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { SnackBarService } from '../services/snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResetPasswordDialogComponent } from '../resetpassworddialog/resetpassworddialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Profile } from '../models/profile';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule,
    CommonModule,
    MatDialogModule,
    ResetPasswordDialogComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  //@ViewChild('fileInput') fileInput!: ElementRef;

  selectedImage: File | null = null;
  isImageSelected: boolean = false;

  //icons
  faCamera = faCamera;
  faSignOut = faSignOut;

  profile: Profile = {
    userId: '',
    userName: '',
    name: '',
    alias: '',
    email: '',
    userRole: '',
    imageUrl: 'assets/images/profile.jpg'
  };

  loading: boolean = false;
  errorMessage: string = '';
  userId: string | null = localStorage.getItem('userId');

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: SnackBarService,
    private dialogBox: MatDialog,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.profileDataFetch();

    this.profileForm = this.formBuilder.group({
      userName: new FormControl<string | null>(null, [Validators.required]),
      name: new FormControl<string | null>(null, [Validators.required]),
      alias: new FormControl<string | null>(null, [Validators.required]),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    });
  }

  profileDataFetch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get(`/api/profile/getProfile/${this.userId}`)
      .subscribe({
        next: (response: any) => {
          this.profile = response;
          this.patchFormValue();
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching profile data:', error);
          this.loading = false;
          if (error.error.sessionOut === true) {
            this.router.navigate(['']);
            this.snackBar.error(error.error.message, 'Close')
          } else {
            this.snackBar.error(error.error.message, 'Close')
          }
        }
      });
  }

  patchFormValue() {
    this.profileForm.patchValue({
      alias: this.profile.alias,
      name: this.profile.name,
      userName: this.profile.userName,
      email: this.profile.email,
      role: this.profile.userRole
    })


  }

  updateProfile() {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('userName', this.profileForm.get('userName')?.value);
      formData.append('name', this.profileForm.get('name')?.value);
      formData.append('alias', this.profileForm.get('alias')?.value);
      formData.append('email', this.profileForm.get('email')?.value);

      // Add the image file
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.http.put(`/api/profile/updateProfile/${this.userId}`, formData).subscribe({
        next: (response: any) => {
          this.profile = response;
          this.snackBar.success("Profile Updated Successfully", 'Close', 3000);
          this.profileDataFetch();

          this.profileForm.markAsPristine();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating profile:', error);
          if (error.error.sessionOut === true) {
            this.router.navigate(['']);
            this.snackBar.error(error.error.message, 'Close')
          } else {
            this.snackBar.error(error.error.message, 'Close')
          }
        }
      });
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage = file;
      this.isImageSelected = true;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profile.imageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);

    }
  }

  resetPassword() {
    this.dialogBox.open(ResetPasswordDialogComponent, {
      width: '400px',
      data: {
        userId: this.profile.userId,
        userName: this.profile.userName
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
