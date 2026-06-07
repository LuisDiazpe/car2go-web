import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * BackendResolverService - Sistema de failover entre dos backends (A y B).
 *
 * COMPORTAMIENTO:
 *  - Al arrancar, hace ping a /actuator/health de los gateways A y B EN PARALELO.
 *  - Usa el PRIMERO que responda OK como backend activo.
 *  - Loguea en consola (F12) el estado de cada uno, para que el usuario sepa
 *    si debe encender manualmente el backend B (cuenta de respaldo).
 *  - Si el activo deja de responder durante el uso, se puede reintentar la
 *    resolución llamando a resolve() de nuevo.
 *
 * NOTA: el gateway A se mantiene vivo con cron-job, por eso normalmente
 * responde primero. El B se enciende manualmente en Render cuando hace falta.
 */
@Injectable({ providedIn: 'root' })
export class BackendResolverService {
  private activeBase: string | null = null;
  private resolving: Promise<string> | null = null;

  private readonly A = environment.apiGatewayA;
  private readonly B = environment.apiGatewayB;
  private readonly path = environment.apiPath;

  /** Devuelve la URL base activa (con /api/v1). Resuelve si aún no hay una. */
  async getApiBase(): Promise<string> {
    if (this.activeBase) return this.activeBase;
    if (!this.resolving) this.resolving = this.resolve();
    return this.resolving;
  }

  /** Devuelve la base activa ya resuelta de forma síncrona (o A por defecto). */
  getApiBaseSync(): string {
    return this.activeBase || (this.A + this.path);
  }

  /** Hace ping a A y B en paralelo y elige el primero que responda. */
  async resolve(): Promise<string> {
    console.log('%c[Car2Go] Buscando backend disponible...', 'color:#1565c0;font-weight:bold');

    const ping = (base: string, label: string): Promise<string> =>
      new Promise((resolve, reject) => {
        const url = `${base}/actuator/health`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60s (Render tarda en despertar)
        fetch(url, { signal: controller.signal })
          .then(r => {
            clearTimeout(timeout);
            if (r.ok) {
              console.log(`%c[Car2Go] ✓ Backend ${label} DISPONIBLE (${base})`, 'color:#2e7d32;font-weight:bold');
              resolve(base + this.path);
            } else {
              console.warn(`[Car2Go] Backend ${label} respondió ${r.status} (${base})`);
              reject(new Error(`${label} status ${r.status}`));
            }
          })
          .catch(err => {
            clearTimeout(timeout);
            console.warn(`%c[Car2Go] ✗ Backend ${label} CAÍDO o dormido (${base}). ${label === 'B' ? 'Debes encenderlo manualmente en Render.' : ''}`, 'color:#c62828;font-weight:bold');
            reject(err);
          });
      });

    try {
      // Promise.any devuelve el PRIMERO que se resuelve con éxito.
      const winner = await Promise.any([ping(this.A, 'A'), ping(this.B, 'B')]);
      this.activeBase = winner;
      console.log(`%c[Car2Go] Backend activo: ${winner}`, 'color:#1565c0;font-weight:bold');
      return winner;
    } catch {
      // Si NINGUNO respondió, avisa y usa A por defecto (para reintentar luego).
      console.error('%c[Car2Go] Ningún backend respondió. Enciende el backend B en Render y recarga.', 'color:#c62828;font-weight:bold;font-size:14px');
      this.activeBase = null;
      this.resolving = null;
      return this.A + this.path; // fallback
    }
  }

  /** Fuerza una nueva resolución (por si el activo se cayó durante el uso). */
  reset() {
    this.activeBase = null;
    this.resolving = null;
  }
}
