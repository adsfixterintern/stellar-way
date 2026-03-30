export interface IEvent {
  _id: string;
  title: string;
  subTitle: string;
  date: string; 
  time: string;
  image: string; 
  seat: number;
  price: number;
  status: "active" | "inactive";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// API Response


export interface IEventResponse {
  success: boolean;
  message: string;
  data: IEvent[];
}


export interface IEventBooking {
  _id: string;
  userId: string;
  eventId: {
    _id: string;
    title: string;
    subTitle: string;
    image: string;
    price: number;
  } | string;
  numberOfSeats: number;
  selectedDate: string;
  selectedTime: string;
  transactionId: string;
  totalAmount: number;
  paymentMethod: string;
  phone: string;
  paymentStatus: "paid" | "pending" | "failed";
  createdAt: { $date: string } | string;
}