export interface ITable {
  _id: string;
  tableNumber: string;
  image: string;
  totalSeat: number;
  position: 'window-side' | 'center' | 'corner' | 'outdoor';
  description: string;
  status: 'available' | 'booked' | 'maintenance';
  createdAt?: string;
  updatedAt?: string;
}

export interface ITableResponse {
  success: boolean;
  message: string;
  data: ITable[];
}