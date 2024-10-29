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
import { GuacamoleVncService } from '../../services/guacamole-vnc.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Connection {
  name: string;
  identifier: string;
  parentIdentifier: string;
  protocol: string;
  attributes: any;
  activeConnections: number;
  lastActive?: number;
}

interface ConnectionResponse {
  [key: string]: Connection;
}

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
    private snackBar: MatSnackBar,
    private guacamoleService: GuacamoleVncService
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

  connectionDataChangeCheck(): boolean {
    const currentFormValues = this.equipmentForm.value;
    const existingValues = this.data.equipment;

    return (
      currentFormValues.hostName !== existingValues.hostName ||
      currentFormValues.ipAddress !== existingValues.ipAddress ||
      currentFormValues.vncPassword !== existingValues.vncPassword ||
      currentFormValues.vncUserName !== existingValues.vncUserName
    );
  }


  async onSave() {
    if (this.equipmentForm.valid) {
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

          if (this.data.isEditMode && this.connectionDataChangeCheck()) {
            this.handleGuacamoleConnection();
          } else if (!this.data.isEditMode) {
            this.createGuacamoleConnection();
          }

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

  private checkExistingGuacamoleConnection(hostName: string): Observable<any> {
   return this.guacamoleService.getExistingConnections().pipe(  
     map((response: ConnectionResponse) => {  
       const existingConnections = Object.values(response);  
       const existingConnection = existingConnections.find((connection: Connection) => connection.name === hostName);  
       return existingConnection ? {connectionId: existingConnection.identifier } : null;  
     }),  
     catchError((error) => {  
       console.log('Failed to get existing connections', error);  
       return of({ error: true });  
     })  
   );  
  }

  //Handel Guacamole connection if equipment edit mode is active
  private handleGuacamoleConnection() {
    this.checkExistingGuacamoleConnection(this.equipmentForm.get('hostName')?.value).subscribe((response) => {
      if (response?.connectionId) {
        this.updateGuacamoleConnection(response.connectionId);
      } else if (!response?.connectionId) {
        this.createGuacamoleConnection();
      } else if (response?.error) {
        return;
      }
    });
  }

  //Handel Guacamole connection if equipment add mode is active
  private createGuacamoleConnection() {
    const currentFormValue = this.equipmentForm.value;
    this.guacamoleService.createConnection(currentFormValue.hostName, currentFormValue.ipAddress, currentFormValue.vncPassword, currentFormValue.vncUserName)
      .subscribe({
        next: (connectionResponse: Connection) => {
          console.log('Connection created successfully', connectionResponse);
        },
        error: (error) => {
          console.log('Failed to create new connection.', error);
        }
      });
  }

  //Update existing connection if the connection data is changed
  private updateGuacamoleConnection(connectionId: string) {
    console.log('ConnectionId : ', connectionId);
    const currentFormValue = this.equipmentForm.value;
    this.guacamoleService.updateConnection(connectionId, currentFormValue.hostName, currentFormValue.ipAddress, currentFormValue.vncPassword, currentFormValue.vncUserName)
      .subscribe({
        next: (response: any) => {
          console.log('Connection updated successfully');
        },
        error: (error) => {
          console.log('Failed to update connection', error);
        }
      });
  }

  deleteGuacamoleConnection() {

  }
}
