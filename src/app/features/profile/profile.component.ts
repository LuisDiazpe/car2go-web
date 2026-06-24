import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { SocialService, Comment, ReviewSummary } from '../../core/services/social.service';
import { AuthService } from '../../core/services/auth.service';
import { TrustBadgeComponent } from '../../shared/trust-badge/trust-badge.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, StarRatingComponent, TrustBadgeComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  targetId!: number;
  comments: Comment[] = [];
  reviewSummary: ReviewSummary = { targetProfileId: 0, average: 0, count: 0, reviews: [] };
  loading = true;

  // formularios
  newComment = '';
  newRating = 5;
  newReviewComment = '';
  message = '';
  error = '';
  tab: 'reviews' | 'comments' = 'reviews';

  constructor(
    private route: ActivatedRoute,
    private social: SocialService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.targetId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load() {
    this.loading = true;
    this.social.getReviews(this.targetId).subscribe({
      next: (r) => { this.reviewSummary = r; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.social.getComments(this.targetId).subscribe({
      next: (c) => this.comments = c,
      error: () => {}
    });
  }

  get isLoggedIn() { return this.auth.isAuthenticated(); }

  sendComment() {
    if (!this.newComment.trim()) return;
    this.social.addComment(this.targetId, this.newComment.trim()).subscribe({
      next: () => { this.newComment = ''; this.message = 'COMMENT_SENT'; this.load(); },
      error: () => this.error = 'COMMENT_ERROR'
    });
  }

  sendReview() {
    this.error = '';
    this.social.addReview(this.targetId, this.newRating, this.newReviewComment.trim()).subscribe({
      next: () => { this.newReviewComment = ''; this.message = 'REVIEW_SENT'; this.load(); },
      error: (e) => {
        if (e.status === 403) this.error = 'REVIEW_NEEDS_TRANSACTION';
        else if (e.status === 503) this.error = 'REVIEW_SERVICE_DOWN';
        else this.error = 'REVIEW_ERROR';
      }
    });
  }

  setStars(n: number) { this.newRating = n; }
}
