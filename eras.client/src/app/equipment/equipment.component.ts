import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { SnackBarService } from '../services/snackbar.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AddEditEquipmentDialogComponent } from './add-edit-equipment-dialog/add-edit-equipment-dialog.component';



@Component({
  standalone: true,
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.css',
  imports: [CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule]
})
export class EquipmentComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'name', 'alias', 'ipAddress', 'hostName', 'vncUserName', 'model', 'zone', 'userCreated', 'dateCreated', 'userModified', 'dateModified', 'actions'];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.loadEquipments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEquipments() {
    this.isLoading = true;

    this.http.get('/api/Equipment')
      .subscribe({
        next: (response: any) => {
          console.log(response.message);
          this.dataSource = new MatTableDataSource(response.equipments);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 200) {
            this.snackBar.error('You are not authorized to perform this action.', 'Close', 6000);
            this.router.navigate(['']);

          } else if (error.error.sessionOut === true) {
            this.snackBar.error(error.error.message, 'Close', 4000);
            this.router.navigate(['']);
          }
          else {
            this.snackBar.error(error.error.message, 'Close', 4000);
          }
          this.isLoading = false;
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddEquipmentDialog() {
    console.log("Add Dialog Button Pressed");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '800px';
    dialogConfig.data = { isEditingMode: false }

    const dialogRef = this.dialog.open(AddEditEquipmentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadEquipments();
      }
    });
  }

  editEquipment(equipment: any) {
    console.log("Edit Button Pressed");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '800px';
    dialogConfig.data = { equipment: equipment, isEditMode: true }
    const dialogRef = this.dialog.open(AddEditEquipmentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadEquipments();
      }
    });
  }

  deleteEquipment(id: number) {
    console.log("Delete Button Pressed");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = { commingFrom: 'equipment'};
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`/api/Equipment/${id}`)
          .subscribe({
            next: (response: any) => {
              this.snackBar.bottomSuccess(response.message, 'Close', 3000);
            },
            error: (error: HttpErrorResponse) => {
              this.snackBar.bottomError(error.error.message, 'Close', 3000);
            }
          });
      }
    });

  }

}
