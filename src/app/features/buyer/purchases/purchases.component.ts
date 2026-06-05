import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.myPurchases().subscribe({
      next: (t) => { this.transactions = t; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  statusClass(s?: string) {
    return { PENDING:'badge-pending', COMPLETED:'badge-reviewed', REFUNDED:'badge-sold', FAILED:'badge-rejected' }[s||'PENDING'];
  }
}
