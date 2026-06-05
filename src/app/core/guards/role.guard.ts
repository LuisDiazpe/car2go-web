import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege rutas según el rol. Uso en las rutas:
 *   { path: 'mechanic', canActivate: [roleGuard], data: { role: 'ROLE_MECHANIC' } }
 * SEGURIDAD: impide que un usuario acceda a pantallas de un rol que no le corresponde.
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as string;

  if (authService.isAuthenticated() && authService.hasRole(requiredRole)) {
    return true;
  }
  router.navigate(['/home']);
  return false;
};
