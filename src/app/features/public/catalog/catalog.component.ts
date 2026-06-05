import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  search = '';

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe({
      next: (v) => { this.vehicles = v; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): Vehicle[] {
    const q = this.search.toLowerCase().trim();
    if (!q) return this.vehicles;
    return this.vehicles.filter(v =>
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q));
  }

  statusClass(s?: string) {
    return { PENDING: 'badge-pending', REVIEWED: 'badge-reviewed', REJECTED: 'badge-rejected', SOLD: 'badge-sold' }[s || 'PENDING'];
  }
  img(v: Vehicle) { return v.images?.[0] || 'https://via.placeholder.com/400x250?text=Car2Go'; }
}
