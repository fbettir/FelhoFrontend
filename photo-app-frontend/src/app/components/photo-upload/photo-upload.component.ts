import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card style="max-width: 600px; margin: 40px auto;">
      <h2>📤 Fénykép feltöltés</h2>

      <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" enctype="multipart/form-data">
<mat-form-field appearance="fill">
  <mat-label>Kép neve</mat-label>
  <input matInput formControlName="name" required>
  <mat-error *ngIf="uploadForm.get('name')?.invalid">
    Legalább 40 karakter hosszúnak kell lennie.
  </mat-error>
</mat-form-field>

        <input type="file" (change)="onFileChange($event)" accept="image/*" required />

        <button mat-raised-button color="primary" type="submit" [disabled]="!uploadForm.valid || !selectedFile">
          Feltöltés
        </button>
      </form>
    </mat-card>
  `
})
export class PhotoUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private photoService: PhotoService
  ) {
    this.uploadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(40)]]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Előbb be kell jelentkezned!', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    if (!this.uploadForm.valid || !this.selectedFile) return;

    const name = this.uploadForm.get('name')?.value;

    this.photoService.uploadPhoto(name, this.selectedFile).subscribe({
      next: () => {
        this.snackBar.open('Sikeres feltöltés!', 'OK', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Hiba a feltöltés során.', 'OK', { duration: 3000 });
      }
    });
  }
}
