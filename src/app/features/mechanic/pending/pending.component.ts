import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InspectionService } from '../../../core/services/inspection.service';
import { Inspection } from '../../../core/models/inspection.model';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {
  pending: Inspection[] = [];      // PENDING (para asignarse)
  assigned: Inspection[] = [];     // IN_PROGRESS (mías, para aprobar/rechazar)
  loading = true;
  message = '';
  tab: 'pending' | 'assigned' = 'pending';   // pestaña activa

  notes: { [id: number]: string } = {};
  cert: { [id: number]: string } = {};

  constructor(private inspectionService: InspectionService) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    // Cargar ambas listas
    this.inspectionService.getPending().subscribe({
      next: (i) => { this.pending = i; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.inspectionService.getAssigned().subscribe({
      next: (i) => { this.assigned = i; },
      error: () => {}
    });
  }

  setTab(t: 'pending' | 'assigned') { this.tab = t; this.message = ''; }

  assign(insp: Inspection) {
    if (!insp.id) return;
    this.inspectionService.assign(insp.id).subscribe({
      next: () => { this.message = 'ASSIGNED_OK'; this.tab = 'assigned'; this.load(); },
      error: () => this.message = 'ACTION_ERROR'
    });
  }

  approve(insp: Inspection) {
    if (!insp.id) return;
    const n = this.notes[insp.id] || 'Vehículo en buen estado';
    const c = this.cert[insp.id] || 'CERT-' + insp.id;
    this.inspectionService.approve(insp.id, n, c).subscribe({
      next: () => { this.message = 'APPROVED_OK'; this.load(); },
      error: () => this.message = 'ACTION_ERROR'
    });
  }

  reject(insp: Inspection) {
    if (!insp.id) return;
    const n = this.notes[insp.id] || 'No cumple los requisitos';
    this.inspectionService.reject(insp.id, n).subscribe({
      next: () => { this.message = 'REJECTED_OK'; this.load(); },
      error: () => this.message = 'ACTION_ERROR'
    });
  }

  statusClass(s?: string) {
    return { PENDING:'badge-pending', IN_PROGRESS:'badge-pending', APPROVED:'badge-reviewed', REJECTED:'badge-rejected' }[s||'PENDING'];
  }
}
