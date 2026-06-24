import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id?: number;
  authorProfileId: number;
  authorUsername: string;
  targetProfileId: number;
  content: string;
  createdAt?: string;
}

export interface Review {
  id?: number;
  authorProfileId: number;
  authorUsername: string;
  targetProfileId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface ReviewSummary {
  targetProfileId: number;
  average: number;
  count: number;
  reviews: Review[];
}

/**
 * Servicio de interacción social: comentarios y reseñas (Sprint 3).
 * Usa el marcador API:/ que el interceptor reemplaza por el backend activo (failover A/B).
 */
@Injectable({ providedIn: 'root' })
export class SocialService {
  constructor(private http: HttpClient) {}

  // ---- Comentarios ----
  getComments(targetProfileId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`API:/comments/user/${targetProfileId}`);
  }
  addComment(targetProfileId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`API:/comments`, { targetProfileId, content });
  }

  // ---- Reseñas ----
  getReviews(targetProfileId: number): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`API:/reviews/user/${targetProfileId}`);
  }
  addReview(targetProfileId: number, rating: number, comment: string): Observable<Review> {
    return this.http.post<Review>(`API:/reviews`, { targetProfileId, rating, comment });
  }
}
