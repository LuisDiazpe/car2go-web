import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { LanguageService } from './core/services/language.service';
import { BackendResolverService } from './core/services/backend-resolver.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, ToolbarComponent],
  template: `<app-toolbar></app-toolbar><router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private languageService: LanguageService,
    private backendResolver: BackendResolverService
  ) {}

  ngOnInit(): void {
    // Al arrancar, busca qué backend (A o B) está disponible y lo deja listo.
    // Los mensajes aparecen en la consola del navegador (F12).
    this.backendResolver.resolve();
  }
}
