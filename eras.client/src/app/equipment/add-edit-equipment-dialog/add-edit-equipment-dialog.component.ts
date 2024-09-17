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
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-edit-equipment-dialog',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule],
  templateUrl: './add-edit-equipment-dialog.component.html',
  styleUrls: ['./add-edit-equipment-dialog.component.css']
})

export class AddEditEquipmentDialogComponent {
  equipmentForm: FormGroup;
  areaList: any[] = [];
  equipmentModelList: any[] = [];
  selectedImage: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = 'assets/images/add-image-icon.jpg';

  constructor(
    public dialogRef: MatDialogRef<AddEditEquipmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: any, isEditMode: boolean },
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      alias: [''],
      ipAddress: ['', Validators.required],
      hostName: ['', Validators.required],
      vncUserName: ['', Validators.required],
      vncPassword: ['', Validators.required],
      areaId: ['', Validators.required],
      equipmentModelId: ['', Validators.required],
      image: [null]
    });

    this.loadDropdownData();

    if (this.data.isEditMode) {
      this.populateForm(this.data.equipment)
    }
  }

  loadDropdownData() {
    this.http.get<any[]>('/api/Area').subscribe((response: any) => this.areaList = response.areas);
    this.http.get<any[]>('/api/EquipmentModel').subscribe((response: any) => this.equipmentModelList = response.equipmentModels);
  }

  populateForm(equipment: any): void {
    this.equipmentForm.patchValue({
      name: equipment.name,
      alias: equipment.alias,
      ipAddress: equipment.ipAddress,
      hostName: equipment.hostName,
      vncUserName: equipment.vncUserName,
      vncPassword: equipment.vncPassword,
      areaId: equipment.areaId,
      equipmentModelId: equipment.equipmentModelId
    });

    if (equipment.image) {
      this.imagePreviewUrl = `data:image/png;base64,${equipment.image}`;
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreviewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }


  onSave() {
    if (this.equipmentForm.valid) {
      console.log('Save button clicked')
      const formData = new FormData();
      formData.append('name', this.equipmentForm.get('name')?.value);
      formData.append('alias', this.equipmentForm.get('alias')?.value);
      formData.append('ipAddress', this.equipmentForm.get('ipAddress')?.value);
      formData.append('hostName', this.equipmentForm.get('hostName')?.value);
      formData.append('vncUserName', this.equipmentForm.get('vncUserName')?.value);
      formData.append('vncPassword', this.equipmentForm.get('vncPassword')?.value);
      formData.append('areaId', this.equipmentForm.get('areaId')?.value);
      formData.append('equipmentModelId', this.equipmentForm.get('equipmentModelId')?.value);

      if (this.selectedImage) {
        formData.append('image', this.selectedImage, this.selectedImage.name);
      }

      const request = this.data.isEditMode
        ? this.http.put(`/api/Equipment/${this.data.equipment.id}`, formData)
        : this.http.post('/api/Equipment', formData);

      request.subscribe({
        next: (response: any) => {
          this.snackBar.open(response.message, "Close", { duration: 3000, panelClass: ['success-snackbar'] });
          this.dialogRef.close(true);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.snackBar.open(error.error.message, "Close", { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
