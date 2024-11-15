import { Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../services/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResetPasswordDialogComponent } from '../resetpassworddialog/resetpassworddialog.component';
import { UpdateRoleDialogComponent } from './edit-role-dialog/update-role-dialog.component';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { CdkColumnDef } from '@angular/cdk/table';


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
    FontAwesomeModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [CdkColumnDef]
})
export class UsersComponent implements OnInit{
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'alias', 'userName', 'email', 'role', 'status', 'actions'];
  tableData = new MatTableDataSource<any>();
  isLoading: boolean = false;

  //icon
  faEdit = faEdit;
  faRotate = faRotateLeft;

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

  loadUsers() {
    this.isLoading = true;

    this.http.get<User[]>(`/api/users/getAllUsers`)
      .subscribe({
        next: (response: User[]) => {
          console.log(response);
          this.users = response;
          this.updateTableData();
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

  updateTableData() {
    if (!this.tableData) {
      this.tableData = new MatTableDataSource();
    }
    this.tableData.data = this.users.length ? this.users : [];
    this.tableData.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }


  toggleUserStatus(user: any) {
    user.IsActive = !user.IsActive;

    this.http.put(`api/users/accountStatus/${user.id}`, {})
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

  updateRole(user: any) {
    const dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
      width: '400px',
      data: { userId: user.id, userName: user.userName, userRoleId: user.userRoleId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 1) {
          user.role = 'Admin';
        } else if (result === 2) {
          user.role = 'Engineer';
        } else {
          user.role = 'Viewer';
        }
      }
      console.log('Error occured during role edit.')
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
