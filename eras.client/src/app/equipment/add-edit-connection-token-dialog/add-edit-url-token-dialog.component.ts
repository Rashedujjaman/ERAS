import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snackbar.service';


@Component({
  selector: 'add-edit-url-token-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatDialogModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-edit-url-token-dialog.component.html',
  styleUrls: ['./add-edit-url-token-dialog.component.css']
})
export class AddEditUrlTokenDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEditUrlTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number,  hostName: string, urlToken: string, isEditMode: boolean },
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: SnackBarService
  ) {
    this.form = this.fb.group({
      urlToken: ['', [Validators.required]]
    });

    if (this.data.isEditMode) {
      this.form.patchValue({ urlToken: this.data.urlToken.trim() });
    }
  }

  async onSubmit() {
    const urlToken = this.form.value.urlToken;

    this.http.put(`/api/Equipment/urlToken/${this.data.id}`, { urlToken })
      .subscribe({
        next: (response: any) => {
          this.snackBar.success(response.message, null, 2000);
          this.dialogRef.close(urlToken);
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error?.message || "An unexpected error occurred";
          this.snackBar.error(errorMessage, null, 3000);
          this.dialogRef.close(false);
        }
      });
  }
}
