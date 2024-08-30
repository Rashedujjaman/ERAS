import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTableModule, MatSlideToggleModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'email', 'role', 'status', 'actions'];
  users: any[] = []; // Replace 'any' with your actual user data type
  userRole: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    this.loadUsers();
  }

  loadUsers() {
    
    //this.userService.getUsers().subscribe((users) => {
    //  this.users = users;
    //});
  }

  toggleUserStatus(user: any) {
    //// Call your UserService or API to enable/disable the user's account
    //this.userService.toggleUserStatus(user.id, !user.isEnabled).subscribe(() => {
    //  // Update the user's status in the local data
    //  user.isEnabled = !user.isEnabled;
    //});
  }

  resetPassword(user: any) {
    //// Call your UserService or API to initiate the password reset process
    //this.userService.resetPassword(user.id).subscribe(() => {
    //  // You might want to display a success message or notification here
    //});
  }
}
