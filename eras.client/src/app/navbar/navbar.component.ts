//NavbarComponent
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  UserRole: string | null = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.UserRole = localStorage.getItem('userRole');
  }
  onProfileIconClick() {
    console.log('Profile Icon is Clicked');
    this.router.navigate(['/profile']);
  }
}
