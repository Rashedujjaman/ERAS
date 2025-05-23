import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AddEditAreaDialogComponent } from './add-edit-area-dialog/add-edit-area-dialog.component';



@Component({
  standalone: true,
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
  imports: [CommonModule,
    MatTableModule,
    CdkTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    FontAwesomeModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule]  
})
export class AreaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'alias', 'userCreated', 'dateCreated', 'userModified', 'lastModified', 'actions'];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;

  //Icon
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: SnackBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAreas();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  loadAreas() {
    this.isLoading = true;
    this.http.get<any[]>('/api/Area/getAllArea')
      .subscribe({
        next: (response: any) => {
          this.dataSource = new MatTableDataSource(response.areas);
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);

          if (error.status === 200) {
            this.snackBar.error('You are not authorized to perform this action.', 'Close', 8000);
          }
          else {
            this.snackBar.error(error.error.message, 'Close', 4000);
          }
          this.router.navigate(['']);
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    console.log('Filtered Data Length: ', this.dataSource.filteredData.length);
  }

  openAddAreaDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = { isEditingMode: false }

    const dialogRef = this.dialog.open(AddEditAreaDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAreas();
      }
    });
  }

  editArea(area: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = { area: area, isEditMode: true }
    const dialogRef = this.dialog.open(AddEditAreaDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAreas();
      }
    });
  }

  deleteArea(id: number) {
    const comingFrom = 'area'
    const dialogConfig = new MatDialogConfig;
    dialogConfig.data = { comingFrom };
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`/api/Area/deleteArea/${id}`)
          .subscribe({
            next: (response: any) => {
              this.snackBar.success(response.message, null, 2000);
              this.loadAreas();
            },
            error: (error: HttpErrorResponse) => {
              this.snackBar.error(error.error.message, null, 3000);
            }
          });
      }
    });
  }
}
