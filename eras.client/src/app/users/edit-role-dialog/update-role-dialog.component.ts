import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snackbar.service';


@Component({
  selector: 'app-update-role-dialog',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatRadioModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-role-dialog.component.html',
  //styleUrls: ['./edit-role-dialog.component.css']
})
export class UpdateRoleDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number, userRoleId: number, userName: string },
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: SnackBarService
  ) {
    this.form = this.fb.group({
      userRoleId: new FormControl<number | null>(null, [Validators.required])
    });

    //this.form.patchValue({ userRoleId: this.data.userRoleId });
    this.form.get('userRoleId')?.setValue(this.data.userRoleId);

  }

  updateRole() {
    const newUserRoleId = this.form.value.userRoleId;
    const updateData = {
      userRoleId: newUserRoleId
    }
    this.http.put(`/api/Users/updateUserRole/${this.data.userId}`, updateData)
      .subscribe({
        next: (response: any) => {
          this.snackBar.bottomSuccess(response.message, "Close", 3000);
          this.dialogRef.close(newUserRoleId);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.bottomError(error.error.message, "Close", 3000);
          this.dialogRef.close(false);
        }
      });
  }
}
