import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly api = `API:/favorites`;
  constructor(private http: HttpClient) {}

  getMyFavorites(): Observable<Favorite[]> { return this.http.get<Favorite[]>(this.api); }
  add(vehicleId: number): Observable<Favorite> { return this.http.post<Favorite>(`${this.api}/${vehicleId}`, {}); }
  remove(vehicleId: number): Observable<void> { return this.http.delete<void>(`${this.api}/${vehicleId}`); }
}
