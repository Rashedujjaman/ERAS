import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }
  get isLoginRoute(): boolean {
    return this.router.url === '/';
  }
  get isVNCRoute(): boolean {
    return this.router.url.startsWith('/vnc-client');
  }
  title = 'Equipment Remote Access System';
}
