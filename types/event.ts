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