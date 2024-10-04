import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../services/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResetPasswordDialogComponent } from '../resetpassworddialog/resetpassworddialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'userName', 'email', 'role', 'status', 'actions'];
  users = new MatTableDataSource<any>();
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private http: HttpClient,
    private snackBar: SnackBarService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.users.paginator = this.paginator;
  }

  loadUsers() {
    this.isLoading = true;

    this.http.get<any[]>(`/api/users/users`)
      .subscribe({
        next: (response: any) => {
          this.users = new MatTableDataSource(response);
          this.users.paginator = this.paginator;
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);

          if (error.status === 200) {
            this.snackBar.success('You are not authorized to perform this action.', 'Close', 8000)
          } else if (error.error.sessionOut === true) {
            this.snackBar.error(error.error.message, 'Close', 5000);
            this.router.navigate(['']);
          } else {
            this.snackBar.error('An error occurred while fetching user data', 'Close', 3000)
          }

          this.isLoading = false;
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.users.filter = filterValue;
  }


  toggleUserStatus(user: any) {
    user.IsActive = !user.IsActive;

    this.http.put(`api/users/${user.id}/toggle`, {})
      .subscribe({
        next: (response: any) => {
          console.log('User status updated:', response);
          this.snackBar.success(`${response.message} ${user.name}`, "", 3000);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to update user status:', error);
          user.IsActive = !user.IsActive;
          this.snackBar.error(error.error.message, 'Close', 3000);
        }
      });
  }

  resetPassword(user: any) {
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '400px',
      data: { userId: user.id, userName: user.userName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Password reset dialog was closed');
      }
      console.log('Error occured during password reset.')
    });
  }

}
