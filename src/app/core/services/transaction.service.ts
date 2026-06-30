import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = `API:/transactions`;

  constructor(private http: HttpClient) {}

  // Historial (nombres que ya usa el proyecto)
  myPurchases(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.api}/my/purchases`);
  }
  mySales(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.api}/my/sales`);
  }

  // Paso 1 de Stripe: pedir el clientSecret
  createPaymentIntent(amount: number, currency = 'pen'): Observable<{ clientSecret: string; paymentIntentId: string }> {
    return this.http.post<{ clientSecret: string; paymentIntentId: string }>(
      `${this.api}/create-payment-intent`, { amount, currency });
  }

  // Paso 2: registrar la transacción tras confirmar el pago
  create(data: { sellerProfileId: number; vehicleId: number; amount: number; paymentMethod: string }): Observable<any> {
    return this.http.post<any>(this.api, data);
  }
}
