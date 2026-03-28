export interface IOverView {
  success: boolean;
  message: string;
  meta: null;
  data: {
    totalPaidOrders: number;
    totalRevenue: number; 
    totalPendingOrders: number
  };
}