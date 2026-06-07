import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { BackendResolverService } from '../services/backend-resolver.service';

/**
 * Interceptor HTTP (Angular 18, functional).
 * Hace dos cosas:
 *  1) FAILOVER: reemplaza el marcador "API:/" por la URL del backend activo
 *     (resuelta por BackendResolverService entre el gateway A y B).
 *  2) SEGURIDAD: agrega el token Bearer automáticamente y, si hay un 401,
 *     cierra sesión y redirige al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const resolver = inject(BackendResolverService);
  const router = inject(Router);

  // Si la petición usa el marcador API:/ resolvemos el backend activo.
  const needsBase = req.url.startsWith('API:/');

  const buildAndSend = (base: string) => {
    let url = req.url;
    if (needsBase) {
      // API:/auth -> https://gateway-activo/api/v1/auth
      url = base + req.url.substring('API:'.length); // quita "API:" deja "/auth"... 
      // base ya termina en /api/v1, y req.url es "API:/auth" -> "/auth"
      url = base + req.url.replace('API:', '');
    }
    const token = authService.getToken();
    const authReq = req.clone({
      url,
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        // Si el backend activo dejó de responder (status 0 o 503), reintenta resolver.
        if (error.status === 0 || error.status === 503) {
          resolver.reset();
        }
        return throwError(() => error);
      })
    );
  };

  if (needsBase) {
    return from(resolver.getApiBase()).pipe(switchMap(base => buildAndSend(base)));
  }
  return buildAndSend('');
};
