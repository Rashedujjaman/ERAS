import { Component, Renderer2, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initMouseTrailEffect();
  }
  get isLoginRoute(): boolean {
    return this.router.url === '/';
  }
  get isVNCRoute(): boolean {
    return this.router.url.startsWith('/vnc-client');
  }

  private initMouseTrailEffect(): void {
    const mouseTrail = document.getElementById('mouse-trail');

    document.addEventListener('mousemove', (event: MouseEvent) => {
      const circle = document.createElement('div');
      circle.classList.add('trail-circle');

      // Set the position of the circle to follow the mouse
      circle.style.left = `${event.pageX - 7.5}px`;
      circle.style.top = `${event.pageY - 7.5}px`;

      // Append the circle to the mouse trail container
      mouseTrail?.appendChild(circle);

      // Remove the circle after the animation ends
      setTimeout(() => {
        mouseTrail?.removeChild(circle);
      }, 2000);
    });
  }

  title = 'Equipment Remote Access System';
}
