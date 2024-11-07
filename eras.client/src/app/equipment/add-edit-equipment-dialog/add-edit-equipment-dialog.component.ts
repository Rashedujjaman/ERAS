import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snackbar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GuacamoleVncService } from '../../services/guacamole-vnc.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AddEditUrlTokenDialogComponent } from '../add-edit-connection-token-dialog/add-edit-url-token-dialog.component';
import { Connection, ConnectionResponse } from '../../models/guacamole-connection.model';


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

  //guacamole
  private authToken: string | null = '';
  private dataSource: string | null = '';

  constructor(
    public dialogRef: MatDialogRef<AddEditEquipmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: any, isEditMode: boolean },
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private guacamoleService: GuacamoleVncService
  ) {
    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      alias: [''],
      ipAddress: ['', Validators.required],
      hostName: ['', Validators.required],
      vncUserName: [''],
      vncPassword: ['', Validators.required],
      areaId: ['', Validators.required],
      equipmentModelId: ['', Validators.required],
      image: [null]
    });

    this.loadDropdownData();

    if (this.data.isEditMode) {
      this.populateForm(this.data.equipment)
    }

    this.authToken = localStorage.getItem('authToken');
    this.dataSource = localStorage.getItem('dataSource');
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

      try {
        const request = this.data.isEditMode
          ? this.http.put(`/api/Equipment/updateEquipment/${this.data.equipment.id}`, formData)
          : this.http.post('/api/Equipment/addEquipment', formData);

        request.subscribe({
          next: async (response: any) => {
            const newEquipment = response.equipment;
            this.snackBar.success(response.message, "Close", 3000);

            //If equipment is being edited and any of the connection data changed.
            if (this.data.isEditMode && this.connectionDataChangeCheck()) {
              await this.handleGuacamoleConnection();

              //If new equipment is being added to the system.
            } else if (!this.data.isEditMode) {
              const existingConnection = await this.checkExistingGuacamoleConnection(newEquipment.hostName).toPromise();
              if (existingConnection) {
                //If the selected hostName is available in guacamole server update the existing guacamole server instead of creating new.
                //hostName sould be unique in the entire system.
                await this.updateGuacamoleConnection(existingConnection.connectionId);
              } else {
                //Create new connection if the connection does not exist in guacamole server.
                await this.createGuacamoleConnection();
              }
            }
            this.dialogRef.close(newEquipment);
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            this.snackBar.error(error.error.message, "Close", 5000);
          }

        });

      } catch (error) {
        console.error(error);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }



  private checkExistingGuacamoleConnection(hostName: string): Observable<any> {
    if (this.authToken && this.dataSource) {
      return this.guacamoleService.getExistingConnections(this.authToken, this.dataSource).pipe(
        map((response: ConnectionResponse) => {
          const existingConnections = Object.values(response);
          const existingConnection = existingConnections.find((connection: Connection) => connection.name === hostName);
          return existingConnection ? { connectionId: existingConnection.identifier } : null;
        }),
        catchError((error) => {
          console.log('Failed to get existing connections', error);
          return of({ error: true });
        })
      );
    } else {
      return of({ error: true });
    }
  }

  //Handel Guacamole connection if equipment edit mode is active
  private async handleGuacamoleConnection() {
    const hostName = this.equipmentForm.get('hostName')?.value;
    const existingConnection = await this.checkExistingGuacamoleConnection(hostName).toPromise();

    if (existingConnection?.connectionId) {
      await this.updateGuacamoleConnection(existingConnection.connectionId);
    } else if (!existingConnection?.connectionId) {
      await this.createGuacamoleConnection();
    } else if (existingConnection?.error) {
      throw new Error('Failed to retrieve existing connections.');
    }
  }

  //Handel Guacamole connection if equipment add mode is active
  private async createGuacamoleConnection() {
    const currentFormValue = this.equipmentForm.value;
    if (this.authToken && this.dataSource) {
      return this.guacamoleService.createConnection(currentFormValue.hostName, currentFormValue.ipAddress, currentFormValue.vncPassword, currentFormValue.vncUserName, this.authToken, this.dataSource)
        .toPromise()
        .then(connectionResponse => {
          console.log('Connection created successfully', connectionResponse);
        })
        .catch(error => {
          console.log('Failed to create new connection.', error);
          throw error;
        });
    }
  }

  //Update existing connection if the connection data is changed
  private async updateGuacamoleConnection(connectionId: string) {
    const currentFormValue = this.equipmentForm.value;
    if (this.authToken && this.dataSource) {
      return this.guacamoleService.updateConnection(connectionId, currentFormValue.hostName, currentFormValue.ipAddress, currentFormValue.vncPassword, currentFormValue.vncUserName, this.authToken, this.dataSource)
        .toPromise()
        .then(() => {
          console.log('Connection updated successfully');
        })
        .catch(error => {
          console.log('Failed to update connection', error);
          throw error;
        });
    }
  }
}
