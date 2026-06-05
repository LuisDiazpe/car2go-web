import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly api = `${environment.apiBaseUrl}/vehicles`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(this.api); }
  getById(id: number): Observable<Vehicle> { return this.http.get<Vehicle>(`${this.api}/${id}`); }
  getByLocation(loc: string): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${this.api}/location/${loc}`); }
  getMyVehicles(): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${this.api}/my`); }
  create(v: Vehicle): Observable<Vehicle> { return this.http.post<Vehicle>(this.api, v); }
  update(id: number, v: Vehicle): Observable<Vehicle> { return this.http.put<Vehicle>(`${this.api}/${id}`, v); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.api}/${id}`); }
}
