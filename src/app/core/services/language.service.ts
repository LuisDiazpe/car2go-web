import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/** Maneja el cambio de idioma (es/en) y lo recuerda en sessionStorage. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(private translate: TranslateService) {
    const saved = sessionStorage.getItem('language') || 'es';
    this.translate.use(saved);
  }
  use(lang: 'es' | 'en'): void {
    this.translate.use(lang);
    sessionStorage.setItem('language', lang);
  }
  current(): string {
    return this.translate.currentLang || 'es';
  }
}
