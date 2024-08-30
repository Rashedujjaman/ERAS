import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
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
      userId: this.data.userId,
      newPassword: this.form.value.newPassword
    }
    this.http.post('/api/authentication/reset-password', resetData)
      .subscribe({
        next: (response: any) => {
          this.snackBar.open(response.message, "Close", {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, "Close", {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
          this.dialogRef.close(false);
        }
      });
  }
}
