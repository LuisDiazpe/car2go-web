import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  vehicle?: Vehicle;
  loading = true;
  processing = false;
  done = false;
  error = '';
  paymentMethod = 'CARD';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getById(id).subscribe({
      next: (v) => { this.vehicle = v; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  pay() {
    if (!this.vehicle?.id || !this.vehicle.sellerProfileId) return;
    this.processing = true; this.error = '';
    this.transactionService.create({
      sellerProfileId: this.vehicle.sellerProfileId,
      vehicleId: this.vehicle.id,
      amount: this.vehicle.price,
      paymentMethod: this.paymentMethod
    }).subscribe({
      next: () => { this.processing = false; this.done = true; setTimeout(() => this.router.navigate(['/buyer/purchases']), 1800); },
      error: (e) => { this.processing = false; this.error = e?.error?.message || 'PAYMENT_ERROR'; }
    });
  }

  img(v: Vehicle) { return v.images?.[0] || 'https://via.placeholder.com/400x250?text=Car2Go'; }
}
