export interface IEvent {
  _id: string;
  title: string;
  subTitle: string;
  date: string; // "2026-08-20"
  time: string; // "06:30 PM"
  image: string; // URL string
  seat: number;
  price: number;
  status: "active" | "inactive";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// API Response-এর জন্য যদি প্রয়োজন হয়
export interface IEventResponse {
  success: boolean;
  message: string;
  data: IEvent[];
}