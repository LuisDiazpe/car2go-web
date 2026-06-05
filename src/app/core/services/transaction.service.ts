import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly api = `${environment.apiBaseUrl}/transactions`;
  constructor(private http: HttpClient) {}

  create(t: Transaction): Observable<Transaction> { return this.http.post<Transaction>(this.api, t); }
  myPurchases(): Observable<Transaction[]> { return this.http.get<Transaction[]>(`${this.api}/my/purchases`); }
  mySales(): Observable<Transaction[]> { return this.http.get<Transaction[]>(`${this.api}/my/sales`); }
  refund(id: number): Observable<Transaction> { return this.http.put<Transaction>(`${this.api}/${id}/refund`, {}); }
}
