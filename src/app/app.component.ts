import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, ToolbarComponent],
  template: `<app-toolbar></app-toolbar><router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent {
  constructor(private languageService: LanguageService) {}
}
