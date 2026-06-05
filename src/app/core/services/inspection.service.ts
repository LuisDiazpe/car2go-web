import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Inspection } from '../models/inspection.model';

@Injectable({ providedIn: 'root' })
export class InspectionService {
  private readonly api = `${environment.apiBaseUrl}/inspections`;
  constructor(private http: HttpClient) {}

  request(vehicleId: number, scheduledAt: string): Observable<Inspection> {
    return this.http.post<Inspection>(this.api, { vehicleId, scheduledAt });
  }
  getPending(): Observable<Inspection[]> { return this.http.get<Inspection[]>(`${this.api}/pending`); }
  getByVehicle(vehicleId: number): Observable<Inspection> { return this.http.get<Inspection>(`${this.api}/vehicle/${vehicleId}`); }
  assign(id: number): Observable<Inspection> { return this.http.put<Inspection>(`${this.api}/${id}/assign`, {}); }
  approve(id: number, notes: string, certificateDetails: string): Observable<Inspection> {
    return this.http.put<Inspection>(`${this.api}/${id}/approve`, { notes, certificateDetails });
  }
  reject(id: number, notes: string): Observable<Inspection> {
    return this.http.put<Inspection>(`${this.api}/${id}/reject`, { notes });
  }
}
