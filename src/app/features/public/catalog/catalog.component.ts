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

  // Búsqueda general
  search = '';

  // Filtros avanzados
  filterBrand = '';
  filterFuel = '';
  filterLocation = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minYear: number | null = null;
  maxYear: number | null = null;
  showFilters = false;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe({
      next: (v) => { this.vehicles = v; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  // Opciones únicas para los selects (se sacan de los autos cargados)
  get fuelOptions(): string[] {
    return [...new Set(this.vehicles.map(v => v.fuel).filter(Boolean))];
  }
  get locationOptions(): string[] {
    return [...new Set(this.vehicles.map(v => v.location).filter(Boolean))];
  }

  get filtered(): Vehicle[] {
    return this.vehicles.filter(v => {
      // Búsqueda general (marca, modelo, ubicación)
      const q = this.search.toLowerCase().trim();
      const matchSearch = !q ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q);

      // Filtros específicos
      const matchBrand = !this.filterBrand || v.brand.toLowerCase().includes(this.filterBrand.toLowerCase());
      const matchFuel = !this.filterFuel || v.fuel === this.filterFuel;
      const matchLocation = !this.filterLocation || v.location === this.filterLocation;
      const matchMinPrice = this.minPrice == null || Number(v.price) >= this.minPrice;
      const matchMaxPrice = this.maxPrice == null || Number(v.price) <= this.maxPrice;
      const matchMinYear = this.minYear == null || Number(v.year) >= this.minYear;
      const matchMaxYear = this.maxYear == null || Number(v.year) <= this.maxYear;

      return matchSearch && matchBrand && matchFuel && matchLocation &&
        matchMinPrice && matchMaxPrice && matchMinYear && matchMaxYear;
    });
  }

  clearFilters() {
    this.filterBrand = ''; this.filterFuel = ''; this.filterLocation = '';
    this.minPrice = null; this.maxPrice = null; this.minYear = null; this.maxYear = null;
    this.search = '';
  }

  get activeFilterCount(): number {
    let c = 0;
    if (this.filterBrand) c++;
    if (this.filterFuel) c++;
    if (this.filterLocation) c++;
    if (this.minPrice != null) c++;
    if (this.maxPrice != null) c++;
    if (this.minYear != null) c++;
    if (this.maxYear != null) c++;
    return c;
  }

  statusClass(s?: string) {
    return { PENDING: 'badge-pending', REVIEWED: 'badge-reviewed', REJECTED: 'badge-rejected', SOLD: 'badge-sold' }[s || 'PENDING'];
  }
  img(v: Vehicle) { return v.images?.[0] || 'https://via.placeholder.com/400x250?text=Car2Go'; }
}
