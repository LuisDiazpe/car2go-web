import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Transaction } from '../../../core/models/transaction.model';

interface SaleRow extends Transaction {
  vehicleLabel?: string;
}

/**
 * "Mis ventas" del vendedor (Sprint 4).
 * Lista las transacciones de sus autos. Las ventas en efectivo PENDING tienen
 * un botón "Confirmar venta" que marca el auto como vendido.
 */
@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  sales: SaleRow[] = [];
  loading = true;
  confirmingId: number | null = null;
  message = '';

  constructor(
    private transactionService: TransactionService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.transactionService.mySales().subscribe({
      next: (list) => {
        this.sales = list;
        this.loading = false;
        // Cargar el nombre de cada auto (para mostrarlo en vez del id)
        this.sales.forEach(s => {
          this.vehicleService.getById(s.vehicleId).subscribe({
            next: (v) => s.vehicleLabel = `${v.brand} ${v.model}`,
            error: () => s.vehicleLabel = `#${s.vehicleId}`
          });
        });
      },
      error: () => { this.loading = false; }
    });
  }

  confirm(sale: SaleRow) {
    if (!sale.id) return;
    this.confirmingId = sale.id;
    this.message = '';
    this.transactionService.confirmCash(sale.id).subscribe({
      next: () => {
        this.confirmingId = null;
        this.message = 'SALE_CONFIRMED';
        this.load(); // recargar para reflejar el nuevo estado
      },
      error: () => { this.confirmingId = null; this.message = 'SALE_CONFIRM_ERROR'; }
    });
  }

  isCashPending(s: SaleRow): boolean {
    return s.status === 'PENDING' && (s.paymentMethod === 'CASH' || s.paymentMethod === 'EFECTIVO');
  }
}
