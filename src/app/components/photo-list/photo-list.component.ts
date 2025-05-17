import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PhotoService, Photo } from '../../services/photo.service';
import { AuthService } from '@auth0/auth0-angular'; // ✅
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
  ],
  template: `
    <div style="max-width: 900px; margin: 20px auto;">
      <h2>🖼️ Feltöltött képek</h2>

      
      <div style="margin-bottom: 16px;">
        <label>Rendezés:</label>
        <select [(ngModel)]="sortBy">
          <option value="name">Név szerint</option>
          <option value="uploadDate">Dátum szerint</option>
        </select>
        <select [(ngModel)]="sortDirection">
          <option value="asc">Növekvő</option>
          <option value="desc">Csökkenő</option>
        </select>
      </div>

      <ng-container *ngIf="photos.length > 0; else noPhotos">
        <mat-card
          *ngFor="let photo of sortedPhotos"
          style="margin-bottom: 20px;"
        >
          <img [src]="photo.url" alt="kép" />

          <mat-card-content>
            <p><strong>Név:</strong> {{ photo.name }}</p>
            <p>
              <strong>Feltöltve:</strong>
              {{ photo.uploadDate | date : 'yyyy.MM.dd HH:mm' }}
            </p>
          </mat-card-content>
          <mat-card-actions *ngIf="authService.isAuthenticated$ | async">
            <button mat-button color="warn" (click)="deletePhoto(photo)">
              Törlés
            </button>
          </mat-card-actions>
        </mat-card>
      </ng-container>

      <ng-template #noPhotos>
        <p>Nincs feltöltött kép.</p>
      </ng-template>
    </div>
  `,
})
export class PhotoListComponent implements OnInit {
  photos: Photo[] = [];
  sortBy: 'name' | 'uploadDate' = 'uploadDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    public authService: AuthService,
    private photoService: PhotoService,
    private snackBar: MatSnackBar
  ) {}

  get sortedPhotos(): Photo[] {
    return this.photos.slice().sort((a, b) => {
      const field = this.sortBy;
      const valA = a[field];
      const valB = b[field];
      const result = valA < valB ? -1 : valA > valB ? 1 : 0;
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.photoService.getPhotos().subscribe({
      next: (data) => (this.photos = data),
      error: (err) => {
        console.error(err);
        this.snackBar.open('Nem sikerült betölteni a képeket.', 'OK', {
          duration: 3000,
        });
      },
    });
  }

  async deletePhoto(photo: Photo): Promise<void> {
    if (!confirm(`Biztosan törölni szeretnéd a(z) "${photo.name}" képet?`))
      return;

    try {
      const token = await firstValueFrom(
        this.authService.getAccessTokenSilently()
      );

      const photoName = photo.name;
      await firstValueFrom(this.photoService.deletePhoto(photoName, token));

      this.snackBar.open('Kép törölve.', 'OK', { duration: 3000 });
      this.loadPhotos();
    } catch (err) {
      console.error(err);
      this.snackBar.open('Hiba történt a törlés során.', 'OK', {
        duration: 3000,
      });
    }
  }
}
