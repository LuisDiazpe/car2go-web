import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Estrellas proporcionales (solo lectura).
 * Pinta el promedio de forma proporcional: 4.3 -> 4 estrellas llenas + 30% de la 5ta.
 * Se logra superponiendo una capa dorada recortada por ancho porcentual.
 */
@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stars" [title]="value + ' / 5'">
      <div class="stars-bg">
        <i class="fa-solid fa-star" *ngFor="let s of [1,2,3,4,5]"></i>
      </div>
      <div class="stars-fill" [style.width.%]="percent">
        <i class="fa-solid fa-star" *ngFor="let s of [1,2,3,4,5]"></i>
      </div>
    </div>
  `,
  styles: [`
    .stars { position: relative; display: inline-block; font-size: 18px; line-height: 1; }
    .stars-bg { color: #d8d8d8; }
    .stars-fill { color: #f5a623; position: absolute; top: 0; left: 0; overflow: hidden; white-space: nowrap; }
    .stars-bg i, .stars-fill i { margin-right: 2px; }
  `]
})
export class StarRatingComponent {
  @Input() value = 0;          // promedio, ej. 4.3
  @Input() max = 5;
  get percent(): number {
    return Math.max(0, Math.min(100, (this.value / this.max) * 100));
  }
}
