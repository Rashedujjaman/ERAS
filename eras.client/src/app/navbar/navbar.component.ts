//NavbarComponent
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userRole: string | null = '';
  imageUrl: string = 'assets/images/profile.jpg';
  isDashboardRoute: boolean = false;
  isVNCRoute: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    const storedImageUrl = localStorage.getItem('imageUrl')
    this.imageUrl = storedImageUrl ? storedImageUrl :  'assets/images/profile.jpg';

    this.router.events.subscribe(() => {
      this.isDashboardRoute = this.router.url === '/dashboard';
    });
  }
  onProfileIconClick() {
    this.router.navigate(['/profile']);
  }
}
