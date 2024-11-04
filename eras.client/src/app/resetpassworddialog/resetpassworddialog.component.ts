import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../services/snackbar.service';


@Component({
  selector: 'app-reset-password-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './resetpassworddialog.component.html',
  styleUrls: ['./resetpassworddialog.component.css']
})
export class ResetPasswordDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number, userName: string },
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: SnackBarService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator]]
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

  resetPassword() {
    const resetData = {
      newPassword: this.form.value.newPassword
    }
    this.http.post(`/api/Users/resetPassword/${this.data.userId}`, resetData)
      .subscribe({
        next: (response: any) => {
          this.snackBar.bottomSuccess(response.message, "Close", 3000);
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.bottomError(error.error.message, "Close", 3000);
          this.dialogRef.close(false);
        }
      });
  }
}
