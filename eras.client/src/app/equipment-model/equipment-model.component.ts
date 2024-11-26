import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AddEditEquipmentModelDialogComponent } from './add-edit-equipment-model-dialog/add-edit-equipment-model-dialog.component';
import { EquipmentModel } from '../models/equipment-model';
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
  equipmentModels: EquipmentModel[] = [];
  isLoading = false;
  displayedColumns = ['id', 'name', 'alias', 'userCreated', 'dateCreated', 'userModified', 'dateModified', 'actions'];
  tableData = new MatTableDataSource<any>();


  //Icon
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlusCircle;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: SnackBarService
  ) { }

  ngOnInit() {
    this.loadEquipmentModels();
  }

  ngAfterViewInit() {
    this.tableData.paginator = this.paginator;
  }

  loadEquipmentModels() {
    this.isLoading = true;

    this.http.get<EquipmentModel[]>('/api/EquipmentModel/GetEquipmentModels')
      .subscribe({
        next: (equipmentModels: EquipmentModel[]) => {
          this.equipmentModels = equipmentModels;
          console.log(equipmentModels);
          this.updateTableData();
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {

          if (error.status === 200) {
            this.snackBar.error('You are not authorized to perform this action.', null, 4000);
            this.router.navigate(['']);

          } else if (error.error.sessionOut === true) {
            this.snackBar.error(error.error.message, null, 4000);
            this.router.navigate(['']);

          } else {
            this.snackBar.error('An error occurred while fetching user Equipment Model data', null, 3000);
          }
          this.isLoading = false;
        }
      });
  }

  updateTableData() {
    if (!this.tableData) {
      this.tableData = new MatTableDataSource();
    }
    this.tableData.data = this.equipmentModels.length ? this.equipmentModels : [];
    this.tableData.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
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
        //this.loadEquipmentModels();
        this.equipmentModels.push(result);
        this.updateTableData();
      }
    });
  }

  editEquipmentModel(equipmentModel: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = { equipmentModel: equipmentModel, isEditMode: true }
    const dialogRef = this.dialog.open(AddEditEquipmentModelDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.equipmentModels.findIndex(eq => eq.id === equipmentModel.id);
        this.equipmentModels[index] = result;
        this.updateTableData();
        //this.loadEquipmentModels();
      }
    });
  }

  deleteEquipmentModel(id: number) {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = { comingFrom : 'equipmentModel' };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`/api/equipmentmodel/DeleteEquipmentModel/${id}`)
          .subscribe({
            next: (response: any) => {
              const index = this.equipmentModels.findIndex(eq => eq.id === id);
              this.equipmentModels.splice(index, 1);
              this.updateTableData();
              this.snackBar.success(response.message, null, 1000);
              //this.loadEquipmentModels();
            },
            error: (error: HttpErrorResponse) => {
              this.snackBar.error(error.error.message, null, 3000);
            }
          });
      }
    });
  }
}
