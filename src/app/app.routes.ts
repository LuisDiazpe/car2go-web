import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Públicas
  { path: 'home', loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'catalog', loadComponent: () => import('./features/public/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'vehicle/:id', loadComponent: () => import('./features/public/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent) },
  { path: 'user/:id', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'ranking', loadComponent: () => import('./features/ranking/ranking.component').then(m => m.RankingComponent) },



  // Vendedor (ROLE_SELLER)
  { path: 'seller/publish', canActivate: [roleGuard], data: { role: 'ROLE_SELLER' }, loadComponent: () => import('./features/seller/publish/publish.component').then(m => m.PublishComponent) },
  { path: 'seller/my-vehicles', canActivate: [roleGuard], data: { role: 'ROLE_SELLER' }, loadComponent: () => import('./features/seller/my-vehicles/my-vehicles.component').then(m => m.MyVehiclesComponent) },
  { path: 'seller/sales', canActivate: [roleGuard], data: { role: 'ROLE_SELLER' }, loadComponent: () => import('./features/seller/sales/sales.component').then(m => m.SalesComponent) },

  // Mecánico (ROLE_MECHANIC)
  { path: 'mechanic/pending', canActivate: [roleGuard], data: { role: 'ROLE_MECHANIC' }, loadComponent: () => import('./features/mechanic/pending/pending.component').then(m => m.PendingComponent) },

  // Comprador (ROLE_BUYER)
  { path: 'buyer/favorites', canActivate: [roleGuard], data: { role: 'ROLE_BUYER' }, loadComponent: () => import('./features/buyer/favorites/favorites.component').then(m => m.FavoritesComponent) },
  { path: 'buyer/checkout/:id', canActivate: [roleGuard], data: { role: 'ROLE_BUYER' }, loadComponent: () => import('./features/buyer/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'buyer/purchases', canActivate: [roleGuard], data: { role: 'ROLE_BUYER' }, loadComponent: () => import('./features/buyer/purchases/purchases.component').then(m => m.PurchasesComponent) },

  { path: '**', redirectTo: 'home' }
];
