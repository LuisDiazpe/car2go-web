import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {
  vehicle?: Vehicle;
  loading = true;
  favMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private favoriteService: FavoriteService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getById(id).subscribe({
      next: (v) => { this.vehicle = v; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get isBuyer() { return this.auth.hasRole('ROLE_BUYER'); }

  buy() {
    if (this.vehicle?.id) {
      this.router.navigate(['/buyer/checkout', this.vehicle.id]);
    }
  }

  addFavorite() {
    if (!this.vehicle?.id) return;
    this.favoriteService.add(this.vehicle.id).subscribe({
      next: () => this.favMessage = 'ADDED_FAVORITE',
      error: (e) => this.favMessage = e.status === 409 ? 'ALREADY_FAVORITE' : 'FAVORITE_ERROR'
    });
  }

  img(v: Vehicle) { return v.images?.[0] || 'https://via.placeholder.com/700x420?text=Car2Go'; }
}
