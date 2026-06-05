export interface Inspection {
  id?: number;
  vehicleId: number;
  mechanicProfileId?: number;
  sellerProfileId?: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
  mechanicNotes?: string;
  certificateDetails?: string;
  scheduledAt?: string;
  completedAt?: string;
  createdAt?: string;
}
