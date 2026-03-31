export type OrderStatus = 'preparing' | 'on-the-way' | 'delivered';

export interface DriverDetails {
  name: string;
  rating: number;
  avatarUrl: string; 
}

export interface OrderDetailsProps {
  orderNumber: string;
  foodName: string;
  foodQuantity: number;
  driver: DriverDetails;
}

export interface OrderStatusDetails {
  title: string;
  subTitle: string;
  eta: string;
}

export interface OrderModalProps {
  status: OrderStatus;
  order: OrderDetailsProps;
  isOpen: boolean;
  onClose: () => void;
}

export interface OrderModalProps {
  status: OrderStatus;
  order: OrderDetailsProps;
  isOpen: boolean;
  onClose: () => void;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface IOrderPayload {
  customerInfo: {
    user: string;
    name: string;
    email: string;
  };
  phone: string;
  address: string;
  items: {
    menuId: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
}