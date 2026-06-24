import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { getTrustLevel, roleLabelKey, TrustLevel } from './trust-level';

/**
 * Badge de confianza (Feature D).
 * Muestra el nivel (Nuevo, Confiable, Muy confiable, Excelente) con color e icono,
 * opcionalmente con el rol como contexto ("Vendedor muy confiable").
 *
 * Uso:
 *   <app-trust-badge [average]="4.3" [count]="10" [role]="'ROLE_SELLER'"></app-trust-badge>
 */
@Component({
  selector: 'app-trust-badge',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <span class="trust-badge" [style.background]="level.color"
          [title]="(average || 0) + ' / 5 (' + count + ')'">
      <i class="fa-solid" [ngClass]="level.icon"></i>
      <span class="trust-text">
        <ng-container *ngIf="roleKey">{{ roleKey | translate }} </ng-container>{{ level.key | translate }}
      </span>
      <span class="trust-score" *ngIf="count > 0">{{ average }}★</span>
    </span>
  `,
  styles: [`
    .trust-badge { display: inline-flex; align-items: center; gap: 6px; color: #fff;
      padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: 600;
      font-family: 'Sora', sans-serif; white-space: nowrap; }
    .trust-score { background: rgba(255,255,255,.25); border-radius: 999px; padding: 0 6px; font-size: 12px; }
    .trust-text { line-height: 1; }
  `]
})
export class TrustBadgeComponent {
  @Input() average = 0;
  @Input() count = 0;
  @Input() role?: string;   // opcional: contexto de rol

  get level(): TrustLevel { return getTrustLevel(this.average, this.count); }
  get roleKey(): string | null { return roleLabelKey(this.role); }
}
