import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { CurrentUser } from '../../core/models/user.model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: CurrentUser | null = null;
  menuOpen = false;

  constructor(
    public auth: AuthService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(u => this.user = u);
  }

  switchLang(l: 'es' | 'en') { this.lang.use(l); }
  logout() { this.auth.logout(); }
  toggleMenu() { this.menuOpen = !this.menuOpen; }

  get isSeller() { return this.user?.role === 'ROLE_SELLER'; }
  get isMechanic() { return this.user?.role === 'ROLE_MECHANIC'; }
  get isBuyer() { return this.user?.role === 'ROLE_BUYER'; }
}
