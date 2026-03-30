export interface IRider {
  _id?: string;          
  userId: string;         
  phoneNumber: string; 
  vehicleType: 'bike' | 'cycle' | 'car';
  licenseNumber?: string;
  identityCard: string;
  area: string;
  status?: 'pending' | 'active' | 'rejected'; 
  rating?: number;
  totalDeliveries?: number;
  createdAt?: string;    
  updatedAt?: string;
}