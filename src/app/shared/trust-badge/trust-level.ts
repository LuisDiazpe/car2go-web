/**
 * Lógica del nivel de confianza (Feature D).
 * Convierte un promedio de estrellas + cantidad de reseñas en un nivel
 * con su etiqueta y color. Es una función pura (sin estado), reutilizable.
 */
export interface TrustLevel {
  key: string;       // clave i18n del nivel
  color: string;     // color del badge
  icon: string;      // icono FontAwesome
}

export function getTrustLevel(average: number, count: number): TrustLevel {
  if (count === 0) {
    return { key: 'TRUST_NEW', color: '#9e9e9e', icon: 'fa-circle-question' };
  }
  if (average < 2.5) {
    return { key: 'TRUST_LOW', color: '#e53935', icon: 'fa-triangle-exclamation' };
  }
  if (average < 3.5) {
    return { key: 'TRUST_OK', color: '#f9a825', icon: 'fa-thumbs-up' };
  }
  if (average < 4.5) {
    return { key: 'TRUST_GOOD', color: '#1e88e5', icon: 'fa-shield-halved' };
  }
  return { key: 'TRUST_EXCELLENT', color: '#2e7d32', icon: 'fa-award' };
}

/** Prefijo de rol según contexto: SELLER -> "Vendedor", etc. (clave i18n) */
export function roleLabelKey(role?: string): string | null {
  if (!role) return null;
  if (role.includes('SELLER')) return 'ROLE_SELLER_LABEL';
  if (role.includes('MECHANIC')) return 'ROLE_MECHANIC_LABEL';
  if (role.includes('BUYER')) return 'ROLE_BUYER_LABEL';
  return null;
}
