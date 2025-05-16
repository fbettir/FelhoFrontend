import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card style="max-width: 400px; margin: 40px auto; text-align: center;">
      <h2>Bejelentkezés</h2>
      <p>Kérlek, jelentkezz be a Google fiókoddal:</p>
      <button mat-raised-button color="primary" (click)="signInWithGoogle()">
        Google bejelentkezés
      </button>
    </mat-card>
  `
})
export class LoginComponent {
  constructor(
    private socialAuth: SocialAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

  signInWithGoogle(): void {
    this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      this.authService.setUser(user); // tároljuk a felhasználót központilag
      this.router.navigate(['/']);   // sikeres login után főoldalra vissza
    });
  }
}
