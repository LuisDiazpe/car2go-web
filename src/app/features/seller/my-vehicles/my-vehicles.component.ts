import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { InspectionService } from '../../../core/services/inspection.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './my-vehicles.component.html',
  styleUrls: ['./my-vehicles.component.css']
})
export class MyVehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  message = '';

  constructor(private vehicleService: VehicleService, private inspectionService: InspectionService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    this.vehicleService.getMyVehicles().subscribe({
      next: (v) => { this.vehicles = v; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  requestInspection(v: Vehicle) {
    if (!v.id) return;
    const date = new Date(); date.setDate(date.getDate() + 7);
    this.inspectionService.request(v.id, date.toISOString().slice(0,19)).subscribe({
      next: () => this.message = 'INSPECTION_REQUESTED',
      error: () => this.message = 'INSPECTION_REQUEST_ERROR'
    });
  }

  del(v: Vehicle) {
    if (!v.id || !confirm('¿Eliminar este vehículo?')) return;
    this.vehicleService.delete(v.id).subscribe({ next: () => this.load() });
  }

  statusClass(s?: string) {
    return { PENDING:'badge-pending', REVIEWED:'badge-reviewed', REJECTED:'badge-rejected', SOLD:'badge-sold' }[s||'PENDING'];
  }
}
