import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AddEditEquipmentModelDialogComponent } from './add-edit-equipment-model-dialog/add-edit-equipment-model-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
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
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule]
})
export class EquipmentModelComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'alias', 'userCreated', 'dateCreated', 'userModified', 'dateModified', 'actions'];
  dataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadEquipmentModels();
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'dateCreated':
        case 'dateModified':
          return new Date(item[property]) || 0;
        case 'userModified':
          return item.userModified ? item.userModified.toLowerCase() : '';
        default:
          return item[property];
      }
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEquipmentModels() {
    this.isLoading = true;
    this.http.get<any[]>('/api/EquipmentModel')
      .subscribe({
        next: (response: any) => {
          this.dataSource = new MatTableDataSource(response.equipmentModels);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {

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
