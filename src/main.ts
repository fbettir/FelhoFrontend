import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { MaterialModule } from './app/material.module';
import { AuthModule } from '@auth0/auth0-angular';

import { AuthInterceptor } from './app/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      MaterialModule,
      AuthModule.forRoot({
        domain: 'muerapp.eu.auth0.com',
        clientId: 'gfc7zI7TQ7i0WPF6uHxlXb3i3IEIZ1IM',
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: 'https://felholab-api' 
        }
      })
    )
  ]
}).catch(err => console.error(err));
