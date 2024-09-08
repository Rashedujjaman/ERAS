import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AddEditAreaDialogComponent } from '../add-edit-area-dialog/add-edit-area-dialog.component';



@Component({
  standalone: true,
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.css',
  imports: [CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule]  
})
export class AreaComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'alias', 'userCreated', 'dateCreated', 'userModified', 'lastModified', 'actions'];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas() {
    this.isLoading = true;
    this.http.get<any[]>('/api/Area')
      .subscribe({
        next: (response: any) => {
          console.log('Response: ', response);
          this.dataSource = response.areas;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);

          if (error.status === 200) {
            this.snackBar.open('You are not authorized to perform this action.', 'Close', {
              duration: 8000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
          else {
            this.snackBar.open(error.error.message, 'Close', {
              duration: 4000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
          this.router.navigate(['']);
        }
      });
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
        this.http.delete(`/api/Area/${id}`)
          .subscribe({
            next: (response: any) => {
                this.snackBar.open(response.message, 'Close', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                })
              this.loadAreas();
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
