import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SignInRequest, SignInResponse, SignUpRequest, CurrentUser } from '../models/user.model';

/**
 * Servicio central de autenticación.
 * SEGURIDAD:
 *  - El token se mantiene EN MEMORIA (variable privada) durante la sesión.
 *  - Se respalda en sessionStorage (se borra al cerrar la pestaña), NO en localStorage,
 *    para reducir la superficie de ataque XSS y evitar que el token persista indefinidamente.
 *  - El rol se deriva del propio JWT (claim 'role'), no se confía en un valor aparte.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `API:/auth`;
  private token: string | null = null;

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al recargar la página, intenta recuperar la sesión desde sessionStorage.
    const saved = sessionStorage.getItem('auth');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.token = data.token;
        this.currentUserSubject.next(data.user);
      } catch {
        this.clearSession();
      }
    }
  }

  signIn(request: SignInRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.api}/sign-in`, request).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  signUp(request: SignUpRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.api}/sign-up`, request);
  }

  /** Procesa la respuesta de login: guarda token y decodifica el rol del JWT. */
  private handleAuth(res: SignInResponse): void {
    this.token = res.token;
    const role = this.extractRole(res.token);
    const user: CurrentUser = { id: res.id, username: res.username, role };
    this.currentUserSubject.next(user);
    sessionStorage.setItem('auth', JSON.stringify({ token: res.token, user }));
  }

  /** Decodifica el payload del JWT (sin validar firma, solo para leer el rol en el cliente). */
  private extractRole(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch {
      return '';
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  logout(): void {
    this.clearSession();
  }

  private clearSession(): void {
    this.token = null;
    this.currentUserSubject.next(null);
    sessionStorage.removeItem('auth');
  }
}
