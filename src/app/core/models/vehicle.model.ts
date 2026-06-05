export interface Vehicle {
  id?: number;
  brand: string;
  model: string;
  year: string;
  price: number;
  color: string;
  transmission: string;
  engine: string;
  mileage: number;
  doors: string;
  plate: string;
  location: string;
  description: string;
  images: string[];
  fuel: string;
  topSpeed: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  sellerProfileId?: number;
  status?: 'PENDING' | 'REVIEWED' | 'REJECTED' | 'SOLD';
  createdAt?: string;
}
