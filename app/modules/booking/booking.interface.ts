export interface IBooking {
  _id?: string;
  userId: string; 
  name: string; 
  email: string; 
  phone: string; 
  address?: string;
  guest: number;
  time: string;
  date: string;
  specialRequest?: string; 
  createdAt?: string;
  updatedAt?: string;
}
export interface ICreateBookingRequest {
  userId: string;   
  email: string;    
  name: string;
  phone: string;
  guest: number;
  time: string;
  date: string;     
  specialRequest?: string;
  address:string
}