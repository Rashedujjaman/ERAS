import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResetPasswordDialogComponent } from '../resetpassworddialog/resetpassworddialog.component';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTableModule, MatDialogModule, MatSlideToggleModule, MatIconModule, MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'userName', 'email', 'role', 'status', 'actions'];
  users: any[] = [];
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;

    this.http.get<any[]>(`/api/users/users`)
      .subscribe(users => {
        this.users = users;
    }
    );
    this.isLoading = false;
  }

  toggleUserStatus(user: any) {
    user.IsActive = !user.IsActive;

    this.http.put(`api/users/${user.id}/toggle`, {})
      .subscribe({
        next: (response: any) => {
          console.log('User status updated:', response);
          this.snackBar.open(`${response.message} ${user.name}`, "",{
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          })
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to update user status:', error);
          user.IsActive = !user.IsActive;
          this.snackBar.open(error.error.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          })
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
