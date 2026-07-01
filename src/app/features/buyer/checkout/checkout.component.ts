import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51TnmpNRQZXZfdPELbV4mGZXGVDhrVc0V0dABVvqss1ppzZURCIsAVr3qFi7qerKhynoJnQlntveTTlSZ8cKeaW7100bztyQ7TA';

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

  // Método de pago elegido: 'CARD' (Stripe) o 'CASH' (efectivo)
  method: 'CARD' | 'CASH' = 'CARD';

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;
  cardReady = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private transactionService: TransactionService
  ) {}

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getById(id).subscribe({
      next: (v) => {
        this.vehicle = v; this.loading = false;
        // Montar la tarjeta solo si el método es CARD (por defecto)
        setTimeout(() => this.mountCardIfNeeded(), 100);
      },
      error: () => { this.loading = false; }
    });
  }

  // Cambiar método de pago
  selectMethod(m: 'CARD' | 'CASH') {
    this.method = m;
    this.error = '';
    if (m === 'CARD') {
      setTimeout(() => this.mountCardIfNeeded(), 100);
    }
  }

  private mountCardIfNeeded() {
    if (this.method !== 'CARD' || this.cardReady || !this.stripe) return;
    const el = document.getElementById('card-element');
    if (!el) { setTimeout(() => this.mountCardIfNeeded(), 150); return; }
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card', {
      style: { base: { fontSize: '16px', color: '#1f2d3d' } }
    });
    this.card.mount('#card-element');
    this.cardReady = true;
  }

  async pay() {
    if (!this.vehicle?.id || !this.vehicle.sellerProfileId) { this.error = 'PAYMENT_ERROR'; return; }

    // ----- PAGO EN EFECTIVO -----
    if (this.method === 'CASH') {
      this.processing = true; this.error = '';
      this.transactionService.create({
        sellerProfileId: this.vehicle.sellerProfileId,
        vehicleId: this.vehicle.id,
        amount: this.vehicle.price,
        paymentMethod: 'CASH'
      }).subscribe({
        next: () => { this.processing = false; this.done = true; setTimeout(() => this.router.navigate(['/buyer/purchases']), 2200); },
        error: (e) => { this.processing = false; this.error = e?.error?.message || 'PAYMENT_ERROR'; }
      });
      return;
    }

    // ----- PAGO CON TARJETA (STRIPE) -----
    if (!this.stripe || !this.card) { this.error = 'PAYMENT_ERROR'; return; }
    this.processing = true; this.error = '';

    try {
      const intent = await this.transactionService
        .createPaymentIntent(this.vehicle.price, 'pen').toPromise();
      if (!intent?.clientSecret) { throw new Error('no client secret'); }

      const result = await this.stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: { card: this.card }
      });

      if (result.error) {
        this.processing = false;
        this.error = result.error.message || 'PAYMENT_ERROR';
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        this.transactionService.create({
          sellerProfileId: this.vehicle.sellerProfileId,
          vehicleId: this.vehicle.id,
          amount: this.vehicle.price,
          paymentMethod: 'STRIPE'
        }).subscribe({
          next: () => { this.processing = false; this.done = true; setTimeout(() => this.router.navigate(['/buyer/purchases']), 1800); },
          error: (e) => { this.processing = false; this.error = e?.error?.message || 'PAYMENT_ERROR'; }
        });
      }
    } catch (e: any) {
      this.processing = false;
      this.error = 'PAYMENT_ERROR';
    }
  }

  img(v: Vehicle) { return v.images?.[0] || 'https://placehold.co/400x250?text=Car2Go'; }
}
