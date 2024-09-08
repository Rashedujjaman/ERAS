import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-equipment-dialog',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './add-edit-equipment-dialog.component.html',
  styleUrls: ['./add-edit-equipment-dialog.component.css']
})

export class AddEditEquipmentDialogComponent {
  equipmentModelForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEditEquipmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: any, isEditMode: boolean },
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.equipmentModelForm = this.fb.group({
      name: ['', Validators.required],
      alias: ['']
    });

    if (this.data.isEditMode) {
      this.equipmentModelForm.patchValue(this.data.equipment);
    }
  }

  onSubmit() {
    if (this.equipmentModelForm.valid) {
      console.log('Form Submitted', this.equipmentModelForm.value);
    }
  }

  onSave() {
    if (this.data.isEditMode) {
      this.http.put(`/api/EquipmentModel/${this.data.equipment.id}`, this.equipmentModelForm.value)
        .subscribe({
          next: (response: any) => {
            this.snackBar.open(response.message, "Close", {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true)
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, "Close", {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
    else {
      this.http.post('/api/EquipmentModel', this.equipmentModelForm.value)
        .subscribe({
          next: (response: any) => {
            this.snackBar.open(response.message, "Close", {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true)
          },
          error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.error.message, "Close", {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }});
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
