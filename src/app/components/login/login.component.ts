import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card style="max-width: 400px; margin: 40px auto; text-align: center;">
      <h2>Bejelentkezés</h2>
      <p>Kérlek, jelentkezz be a fiókoddal:</p>
      <button *ngIf="!(auth.isAuthenticated$ | async)" (click)="login()">
        Bejelentkezés
      </button>
      <button *ngIf="auth.isAuthenticated$ | async" (click)="logout()">
        Kijelentkezés
      </button>
    </mat-card>
  `,
})
export class LoginComponent {
  constructor(public auth: AuthService, private router: Router) {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }

  login() {
    this.auth.loginWithRedirect();
  }
  logout() {
    this.auth.logout({
  logoutParams: {
    returnTo: window.location.origin
  }
});
  }
}
