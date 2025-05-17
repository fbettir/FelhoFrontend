import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoListComponent } from './components/photo-list/photo-list.component';
import { PhotoUploadComponent } from './components/photo-upload/photo-upload.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: PhotoListComponent },
  { path: 'upload', component: PhotoUploadComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
