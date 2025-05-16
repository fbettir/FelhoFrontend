import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<SocialUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private socialAuthService: SocialAuthService) {
    this.socialAuthService.authState.subscribe((user) =>
      this.userSubject.next(user)
    );
  }

  get token(): string | null {
    return this.userSubject.value?.idToken || null;
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  get user(): SocialUser | null {
    return this.userSubject.value;
  }

  setUser(user: SocialUser | null): void {
    this.userSubject.next(user);
  }
}
