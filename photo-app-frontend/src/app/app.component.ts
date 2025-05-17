import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common'; // ✅ importáld az AsyncPipe-ot
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>📸 Photo App</span>
      <span style="flex: 1 1 auto;"></span>

      <button
        mat-button
        [routerLink]="['/']"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        Főoldal
      </button>
      <button mat-button [routerLink]="['/upload']" routerLinkActive="active">
        Feltöltés
      </button>

      <button
        mat-button
        *ngIf="!(auth.isAuthenticated$ | async)"
        (click)="login()"
      >
        Bejelentkezés
      </button>
      <button
        mat-button
        *ngIf="auth.isAuthenticated$ | async"
        (click)="logout()"
      >
        Kijelentkezés
      </button>
    </mat-toolbar>

    <router-outlet />
  `,
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
  //     if (!isAuthenticated) {
  //       this.auth.loginWithRedirect(); // vagy hagyod a felhasználóra a kézi login-t
  //     }
  //   });
  // }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
