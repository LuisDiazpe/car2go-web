export interface Transaction {
  id?: number;
  buyerProfileId?: number;
  sellerProfileId: number;
  vehicleId: number;
  amount: number;
  paymentMethod: string;
  status?: 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'FAILED';
  createdAt?: string;
}

export interface Favorite {
  id?: number;
  buyerProfileId?: number;
  vehicleId: number;
  createdAt?: string;
}
