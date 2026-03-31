export interface IRider {
  _id?: string;          
  userId: string;         
  phoneNumber: string; 
  vehicleType: 'bike' | 'cycle' | 'car' | " ";
  licenseNumber?: string;
  identityCard: string;
  area: string;
  status?: 'pending' | 'active' | 'rejected'; 
  rating?: number;
  totalDeliveries?: number;
  createdAt?: string;    
  updatedAt?: string;
}



export interface IOrderItem {
  menuId: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface IOrder {
  _id: string;
  customerInfo: {
    user: string;
    name: string;
    email: string;
  };
  items: IOrderItem[];
  totalPrice: number;
  phone: string;
  address: string;
  paymentStatus: 'paid' | 'unpaid';
  deliveryStatus: 'pending' | 'confirmed' | 'cooking' | 'on-the-way' | 'delivered';
  transactionId: string;
  paymentMethod: string;
  isOTPVerified: boolean;
  riderId: string | null;
  deliveryOTP?: string;
  createdAt: string;
  updatedAt: string;
}