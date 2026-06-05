/** Respuesta del backend al hacer sign-in (ms-iam). */
export interface SignInResponse {
  id: number;
  username: string;
  token: string;
}

/** Datos del usuario autenticado que guardamos en memoria. */
export interface CurrentUser {
  id: number;
  username: string;
  role: string;
}

/** Request de registro (incluye email, agregado en el backend). */
export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

/** Request de login: acepta email O username (campo identifier). */
export interface SignInRequest {
  identifier: string;
  password: string;
}
