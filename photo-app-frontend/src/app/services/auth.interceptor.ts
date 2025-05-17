import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Ha az URL már teljes, ne módosítsd
  const isFullUrl = req.url.startsWith('http://') || req.url.startsWith('https://');
  const isApiCall = req.url.startsWith('/api');

  if (!isApiCall && !isFullUrl) {
    return next(req); // nem API és nem teljes URL, pl. /assets vagy /uploads
  }

  return from(auth.getAccessTokenSilently()).pipe(
switchMap(token => {
  console.log('➡️ Kapott token az interceptorban:', token); // <--- IDE

  const url = isApiCall ? `${environment.apiUrl}${req.url}` : req.url;

  const apiReq = req.clone({
    url,
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(apiReq);
})
  );
} 