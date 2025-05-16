import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    NgIf
  ],
  template: `
    <mat-toolbar color="primary">
      <span>📸 Photo App</span>
      <span style="flex: 1 1 auto;"></span>
      <button mat-button routerLink="/" routerLinkActive="active">Főoldal</button>
      <button mat-button routerLink="/upload" routerLinkActive="active">Feltöltés</button>
      <button mat-button *ngIf="!loggedIn" routerLink="/login">Bejelentkezés</button>
      <button mat-button *ngIf="loggedIn" (click)="logout()">Kijelentkezés</button>
    </mat-toolbar>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  loggedIn = false;

  constructor(private authService: SocialAuthService, private router: Router) {
    this.authService.authState.subscribe(user => {
      this.loggedIn = !!user;
    });
  }

  logout() {
    this.authService.signOut().then(() => {
      this.loggedIn = false;
      this.router.navigate(['/']);
    });
  }
}
