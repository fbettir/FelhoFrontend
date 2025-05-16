import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Photo {
  id: string;
  name: string;
  uploadDate: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private baseUrl = '/api/photos'; // az Azure backend vagy proxy kiszolgáló címe

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get authHeaders(): HttpHeaders {
    const token = this.authService.token;
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.baseUrl);
  }

  uploadPhoto(name: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    return this.http.post(this.baseUrl, formData, {
      headers: this.authHeaders
    });
  }

  deletePhoto(photoId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${photoId}`, {
      headers: this.authHeaders
    });
  }
}
