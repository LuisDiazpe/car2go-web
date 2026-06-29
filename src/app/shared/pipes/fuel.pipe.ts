import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Pipe que traduce el valor del combustible (guardado en español en la BD)
 * al idioma actual. Mapea cada variante a su clave i18n.
 * Uso: {{ vehicle.fuel | fuel }}
 *
 * Es "impure" para que se actualice al cambiar de idioma en caliente.
 */
@Pipe({ name: 'fuel', standalone: true, pure: false })
export class FuelPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: string | undefined | null): string {
    if (!value) return '';

    // Normaliza el valor (minúsculas, sin tildes) y lo mapea a una clave i18n
    const norm = value.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes

    const map: Record<string, string> = {
      'gasolina': 'GASOLINE',
      'gasoline': 'GASOLINE',
      'diesel': 'DIESEL',
      'electrico': 'ELECTRIC',
      'electric': 'ELECTRIC',
      'hibrido': 'HYBRID',
      'hybrid': 'HYBRID'
    };

    const key = map[norm];
    // Si lo reconoce, devuelve la traducción; si no, muestra el valor original
    return key ? this.translate.instant(key) : value;
  }
}
