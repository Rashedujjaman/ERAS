import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../../services/snackbar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-area-dialog',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './add-edit-area-dialog.component.html',
  styleUrls: ['./add-edit-area-dialog.component.css']
})

export class AddEditAreaDialogComponent {
  areaForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEditAreaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { area: any, isEditMode: boolean },
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: SnackBarService
  ) {
    this.areaForm = this.fb.group({
      name: ['', Validators.required],
      alias: ['']
    });

    if (this.data.isEditMode) {
      this.areaForm.patchValue(this.data.area);
    }
  }

  onSubmit() {
    if (this.areaForm.valid) {
      console.log('Form Submitted', this.areaForm.value);
    }
  }

  onSave() {
    const request = this.data.isEditMode
      ? this.http.put(`/api/Area/editArea/${this.data.area.id}`, this.areaForm.value)
      : this.http.post('/api/Area/addArea', this.areaForm.value);

    request.subscribe({
      next: (response: any) => {
        const message = this.data.isEditMode ? "Area updated successfully." : "Area added successfully."
        this.snackBar.success(message, null, 2000);
        this.dialogRef.close(true)
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.success(error.error.message, null, 3000);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
