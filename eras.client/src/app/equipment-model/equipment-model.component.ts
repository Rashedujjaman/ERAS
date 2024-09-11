import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AddEditEquipmentModelDialogComponent } from '../add-edit-equipment-model-dialog/add-edit-equipment-model-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-equipment-model-management',
  templateUrl: './equipment-model.component.html',
  styleUrls: ['./equipment-model.component.css'],
  imports: [CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule]
})
export class EquipmentModelComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'alias', 'userCreated', 'dateCreated', 'userModified', 'lastModified', 'actions'];
  dataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadEquipmentModels();
  }

  loadEquipmentModels() {
    this.isLoading = true;
    this.http.get<any[]>('/api/EquipmentModel')
      .subscribe({
        next: (response: any) => {
          this.dataSource = new MatTableDataSource(response.equipmentModels);
          //this.dataSource = response;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);

          if (error.status === 200) {
            this.snackBar.open('You are not authorized to perform this action.', 'Close', {
              duration: 8000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackBar']
            });
            this.router.navigate(['']);
          } else if (error.error.sessionOut === true) {
            this.snackBar.open(error.error.message, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackBar']
            });
            this.router.navigate(['']);
          } else {
            this.snackBar.open('An error occurred while fetching user Equipment Model data', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackBar']
            });
          }
          this.isLoading = false;
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddEquipmentModelDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = { isEditingMode: false }

    const dialogRef = this.dialog.open(AddEditEquipmentModelDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEquipmentModels();
      }
    });
  }

  editEquipmentModel(equipment: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = { equipment: equipment, isEditMode: true }
    const dialogRef = this.dialog.open(AddEditEquipmentModelDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEquipmentModels();
      }
    });
  }

  deleteEquipmentModel(id: number) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = { comingFrom : 'equipmentModel' };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`/api/equipmentmodel/${id}`)
          .subscribe( {
            next: (response: any) => {
              this.snackBar.open(response.message, 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
              this.loadEquipmentModels();
            },
            error: (error: HttpErrorResponse) => {
              this.snackBar.open(error.error.message, 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              })
            }
          });
      }
    });
  }
}
