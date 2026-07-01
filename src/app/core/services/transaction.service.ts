import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = `API:/transactions`;

  constructor(private http: HttpClient) {}

  myPurchases(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.api}/my/purchases`);
  }
  mySales(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.api}/my/sales`);
  }

  // Stripe paso 1: pedir el clientSecret
  createPaymentIntent(amount: number, currency = 'pen'): Observable<{ clientSecret: string; paymentIntentId: string }> {
    return this.http.post<{ clientSecret: string; paymentIntentId: string }>(
      `${this.api}/create-payment-intent`, { amount, currency });
  }

  // Registrar transacción (tarjeta o efectivo)
  create(data: { sellerProfileId: number; vehicleId: number; amount: number; paymentMethod: string }): Observable<any> {
    return this.http.post<any>(this.api, data);
  }

  // El vendedor confirma un pago en efectivo
  confirmCash(transactionId: number): Observable<any> {
    return this.http.put<any>(`${this.api}/${transactionId}/confirm-cash`, {});
  }

  // Contador de interesados (compras en efectivo pendientes) de un auto — público
  getInterested(vehicleId: number): Observable<{ vehicleId: number; interested: number }> {
    return this.http.get<{ vehicleId: number; interested: number }>(`${this.api}/interested/${vehicleId}`);
  }
}
