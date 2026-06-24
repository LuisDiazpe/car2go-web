import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { SocialService, UserSummary, RankingEntry } from '../../core/services/social.service';
import { TrustBadgeComponent } from '../../shared/trust-badge/trust-badge.component';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';

/**
 * Ranking de "más recomendados" (Feature D).
 * Orquesta dos microservicios: pide los usuarios por rol (ms-iam) y sus
 * promedios de reseñas (ms-userinteraction), luego los combina y ordena.
 */
@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, TrustBadgeComponent, StarRatingComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  sellers: RankingEntry[] = [];
  mechanics: RankingEntry[] = [];
  loading = true;
  tab: 'sellers' | 'mechanics' = 'sellers';

  constructor(private social: SocialService) {}

  ngOnInit(): void {
    this.loadRole('SELLER', 'sellers');
    this.loadRole('MECHANIC', 'mechanics');
  }

  private loadRole(role: string, target: 'sellers' | 'mechanics') {
    this.social.getUsersByRole(role).subscribe({
      next: (users: UserSummary[]) => {
        if (users.length === 0) { this.finish(target, []); return; }
        const ids = users.map(u => u.id);
        // Pedir los promedios de esos usuarios
        this.social.getRanking(ids).subscribe({
          next: (ranking: RankingEntry[]) => {
            // Cruzar: agregar username y role a cada entrada del ranking
            const merged = ranking.map(r => {
              const u = users.find(x => x.id === r.profileId);
              return { ...r, username: u?.username, role: u?.role };
            });
            this.finish(target, merged);
          },
          error: () => this.finish(target, [])
        });
      },
      error: () => this.finish(target, [])
    });
  }

  private finish(target: 'sellers' | 'mechanics', data: RankingEntry[]) {
    if (target === 'sellers') this.sellers = data;
    else this.mechanics = data;
    this.loading = false;
  }

  get current(): RankingEntry[] {
    return this.tab === 'sellers' ? this.sellers : this.mechanics;
  }

  medal(i: number): string {
    return ['🥇', '🥈', '🥉'][i] || `${i + 1}`;
  }
}
