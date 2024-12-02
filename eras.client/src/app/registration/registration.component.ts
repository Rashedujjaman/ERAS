import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { SnackBarService } from '../services/snackbar.service';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatCheckboxModule, MatRadioModule]
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: SnackBarService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      UserName: new FormControl<string | null>(null, [Validators.required]),
      Name: new FormControl<string | null>(null, [Validators.required]),
      Alias: new FormControl<string | null>(null, [Validators.required]),
      Email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      Password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]),
      UserRoleId: new FormControl<number | null>(null, [Validators.required])
    });
  }

  passwordStrengthValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasNonAlphanumeric = /[\W_]/.test(value);
    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasNonAlphanumeric;

    if (!valid) {
      return { passwordStrength: true };
    }
    return null;
  }

  get f() { return this.registrationForm.controls; }

  register(): void {
    this.loading = true;

    if (this.registrationForm.invalid) {
      this.loading = false;

      return;
    }

    const registrationData = this.registrationForm.value;

    this.http.post('/api/registration/register', registrationData)
      .subscribe({
        next: (response: any) => {
          this.snackBar.success(response.message, null, 2000)
          this.registrationForm.reset();
        this.loading = false;
      },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 200) {
            this.snackBar.error('You are not authorized to perform this action.', null, 3000);
            this.loading = false;
          } else if (error.status === 400) {
            this.snackBar.error(error.error.message, null, 4000);
            this.loading = false;
          }
          else {
            this.snackBar.error(error.error.message, null, 4000);
            this.loading = false;
          }
        }
        }
      );
  }
}
