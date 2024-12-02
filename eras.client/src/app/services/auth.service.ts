import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) { }

  // Save user details in local storage
  setLogin(userRole: string, userId: string): void {
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userId', userId);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userRole') && !!localStorage.getItem('userId');
  }

  // Get user role
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Log out user
  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.router.navigate(['']);
    this.http.post('/api/authentication/logout', {}).subscribe();
  }

  setImageUrl(imageUrl: string) {
    localStorage.setItem('imageUrl', imageUrl);
  }

  getImageUrl(): string {
    return localStorage.getItem('imageUrl') ?? 'assets/images/profile.jpg';
  }
}
