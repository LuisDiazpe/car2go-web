import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'catalog', loadComponent: () => import('./features/public/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'vehicle/:id', loadComponent: () => import('./features/public/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent) },
  { path: '**', redirectTo: 'home' }
];
