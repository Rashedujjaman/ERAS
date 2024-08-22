import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userName: string = 'MrUser';
  userEmail: string = 'user@gmail.com';
  userMobile: string = '123456789';
  userRole: string = '';
  userPhotoUrl: string = 'assets/images/profile.jpg';

  constructor(private router: Router) { }

  ngOnInit() {
    // Fetch user details from local storage 
    this.userRole = localStorage.getItem('userRole') || '';
    //this.userName = localStorage.getItem('userName') || '';
    //this.userEmail = localStorage.getItem('userEmail') || '';
    //this.userMobile = localStorage.getItem('userMobile') || '';
    //// If you're storing the user's photo URL in local storage, fetch it as well
    //this.userPhotoUrl = localStorage.getItem('userPhotoUrl') || 'assets/images/profile.jpg';
  }

  logout() {
    localStorage.removeItem('userRole');
    this.router.navigate(['']);
  }
}
