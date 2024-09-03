//NavbarComponent
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  UserRole: string | null = '';
  isDashboardRoute: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.UserRole = localStorage.getItem('userRole');

    this.router.events.subscribe(() => {
      this.isDashboardRoute = this.router.url === '/dashboard';
    });
  }
  onProfileIconClick() {
    console.log('Profile Icon is Clicked');
    this.router.navigate(['/profile']);
  }
}
