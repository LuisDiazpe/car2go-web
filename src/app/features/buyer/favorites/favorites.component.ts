import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FavoriteService } from '../../../core/services/favorite.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;

  constructor(private favoriteService: FavoriteService, private vehicleService: VehicleService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    this.favoriteService.getMyFavorites().subscribe({
      next: (favs) => {
        if (favs.length === 0) { this.vehicles = []; this.loading = false; return; }
        // Por cada favorito, traer el detalle del vehículo
        forkJoin(favs.map(f => this.vehicleService.getById(f.vehicleId).pipe(catchError(() => of(null)))))
          .subscribe(results => {
            this.vehicles = results.filter((v): v is Vehicle => v !== null);
            this.loading = false;
          });
      },
      error: () => { this.loading = false; }
    });
  }

  remove(v: Vehicle) {
    if (!v.id) return;
    this.favoriteService.remove(v.id).subscribe({ next: () => this.load() });
  }

  img(v: Vehicle) { return v.images?.[0] || 'https://via.placeholder.com/400x250?text=Car2Go'; }
}
