import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snackbar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-equipment-model-dialog',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './add-edit-equipment-model-dialog.component.html',
  styleUrls: ['./add-edit-equipment-model-dialog.component.css']
})

export class AddEditEquipmentModelDialogComponent {
  equipmentModelForm: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditEquipmentModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipmentModel: any, isEditMode: boolean },
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: SnackBarService

  ) {
    this.equipmentModelForm = this.fb.group({
      name: ['', Validators.required],
      alias: ['']
    });

    if (this.data.isEditMode) {
      this.equipmentModelForm.patchValue(this.data.equipmentModel);
    }
  }

  onSubmit() {
    if (this.equipmentModelForm.valid) {
      console.log('Form Submitted', this.equipmentModelForm.value);
    }
  }

  onSave() {
    this.loading = true;
    const request = this.data.isEditMode
      ? this.http.put(`/api/EquipmentModel/UpdateEquipmentModel/${this.data.equipmentModel.id}`, this.equipmentModelForm.value)
      : this.http.post('/api/EquipmentModel/AddEquipmentModel', this.equipmentModelForm.value);

    request.subscribe({
      next: (response: any) => {
        const message = this.data.isEditMode
          ? 'Equipment model updated successfully!'
          : 'Equipment model added successfully!';
        this.loading = false;

        this.snackBar.success(message, null, 1000);
        this.dialogRef.close(response);
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = this.data.isEditMode
          ? 'An error occurred while updating the equipment model.'
          : 'An error occurred while adding the equipment model.';
        this.loading = false;
        this.snackBar.error(errorMessage, null, 3000);
        console.log(error);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
