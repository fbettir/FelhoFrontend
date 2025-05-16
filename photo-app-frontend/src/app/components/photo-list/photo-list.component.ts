import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Photo, PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <mat-card style="max-width: 800px; margin: 20px auto;">
      <h2>📷 Fényképeim</h2>

      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Rendezés</mat-label>
        <mat-select [(value)]="sortBy" (selectionChange)="sortPhotos()">
          <mat-option value="name">Név szerint</mat-option>
          <mat-option value="date">Dátum szerint</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-list>
        <mat-list-item *ngFor="let photo of sortedPhotos" (click)="selectPhoto(photo)">
          <mat-icon matListIcon>photo</mat-icon>
          <div matLine>{{ photo.name }}</div>
          <div matLine class="mat-caption">{{ photo.uploadDate | date:'yyyy.MM.dd HH:mm' }}</div>
        </mat-list-item>
      </mat-list>
    </mat-card>

    <mat-card *ngIf="selectedPhoto" style="max-width: 800px; margin: 20px auto; text-align: center;">
      <h3>{{ selectedPhoto.name }}</h3>
      <img [src]="selectedPhoto.url" alt="photo" style="max-width: 100%;">
    </mat-card>
  `
})
export class PhotoListComponent implements OnInit {
  photos: Photo[] = [];
  sortedPhotos: Photo[] = [];
  selectedPhoto: Photo | null = null;
  sortBy: 'name' | 'date' = 'name';

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.photoService.getPhotos().subscribe(data => {
      this.photos = data;
      this.sortPhotos();
    });
  }

  sortPhotos(): void {
    if (this.sortBy === 'name') {
      this.sortedPhotos = [...this.photos].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.sortedPhotos = [...this.photos].sort((a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
    }
  }

  selectPhoto(photo: Photo): void {
    this.selectedPhoto = photo;
  }
}
