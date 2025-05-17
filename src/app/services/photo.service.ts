import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Photo {
  name: string; // blob neve = fájlnév
  url: string;
  uploadDate: string;
}

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private baseUrl = `${environment.apiUrl}/photos`;

  constructor(private http: HttpClient) {}

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.baseUrl);
  }

  uploadPhoto(name: string, file: File, token: string): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http.post(this.baseUrl, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

deletePhoto(photoName: string, token: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${photoName}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`,
    }),
  });
}

}
