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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackBarService } from '../services/snackbar.service';
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
    FontAwesomeModule,
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

  //Icon
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlusCircle;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: SnackBarService
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
            this.snackBar.error('You are not authorized to perform this action.', 'Close', 8000);
            this.router.navigate(['']);

          } else if (error.error.sessionOut === true) {
            this.snackBar.error(error.error.message, 'Close', 4000);
            this.router.navigate(['']);

          } else {
            this.snackBar.error('An error occurred while fetching user Equipment Model data', 'Close', 3000);
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
              this.snackBar.bottomSuccess(response.message, 'Close', 3000);
              this.loadEquipmentModels();
            },
            error: (error: HttpErrorResponse) => {
              this.snackBar.bottomError(error.error.message, 'Close', 3000);
            }
          });
      }
    });
  }
}
